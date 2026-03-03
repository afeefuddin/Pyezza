"use server";

import { prisma } from "@repo/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getUser } from "./user";

const messageTemplateTypeSchema = z.enum([
  "socialsips",
  "wouldyourather",
  "spotlight",
]);

const topicSchema = z.enum([
  "fun",
  "hypothetical",
  "food",
  "cars",
  "games",
  "aspirational",
]);

const createMessageTemplateSchema = z.object({
  content: z.string().trim().min(3, "Content is required"),
  gif: z.string().trim().optional(),
  type: messageTemplateTypeSchema,
  topic: z.array(topicSchema).default([]),
});

const generateQuestionsSchema = z.object({
  type: messageTemplateTypeSchema,
  count: z.coerce.number().int().min(10).max(20),
  topic: z.array(topicSchema).default([]),
});

const deleteMessageTemplateSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const aiQuestionSchema = z.object({
  content: z.string().trim().min(6),
  topic: z.array(topicSchema).optional().default([]),
});

const aiQuestionResponseSchema = z.array(aiQuestionSchema);

type SimilaritySeed = {
  normalized: string;
  tokens: Set<string>;
  trigrams: Set<string>;
};

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toTokens(text: string) {
  return new Set(text.split(" ").filter(Boolean));
}

function toTrigrams(text: string) {
  const padded = `  ${text}  `;
  const grams = new Set<string>();
  for (let i = 0; i <= padded.length - 3; i += 1) {
    grams.add(padded.slice(i, i + 3));
  }
  return grams;
}

function intersectionSize<T>(a: Set<T>, b: Set<T>) {
  const [small, big] = a.size <= b.size ? [a, b] : [b, a];
  let count = 0;
  for (const item of small) {
    if (big.has(item)) {
      count += 1;
    }
  }
  return count;
}

function jaccardSimilarity(a: Set<string>, b: Set<string>) {
  if (!a.size && !b.size) return 1;
  const overlap = intersectionSize(a, b);
  const union = a.size + b.size - overlap;
  return union === 0 ? 0 : overlap / union;
}

function diceSimilarity(a: Set<string>, b: Set<string>) {
  if (!a.size && !b.size) return 1;
  const overlap = intersectionSize(a, b);
  return (2 * overlap) / (a.size + b.size);
}

function buildSeed(text: string): SimilaritySeed {
  const normalized = normalizeText(text);
  return {
    normalized,
    tokens: toTokens(normalized),
    trigrams: toTrigrams(normalized),
  };
}

function isTooSimilar(candidate: SimilaritySeed, seeds: SimilaritySeed[]) {
  if (!candidate.normalized) return true;

  for (const seed of seeds) {
    if (candidate.normalized === seed.normalized) {
      return true;
    }

    const tokenScore = jaccardSimilarity(candidate.tokens, seed.tokens);
    const trigramScore = diceSimilarity(candidate.trigrams, seed.trigrams);

    if (tokenScore >= 0.72 || trigramScore >= 0.82) {
      return true;
    }
  }

  return false;
}

async function callOpenAIForQuestions(args: {
  type: z.infer<typeof messageTemplateTypeSchema>;
  count: number;
  topics: z.infer<typeof topicSchema>[];
  existingQuestions: string[];
}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content:
            "You generate concise, high-quality team engagement questions. Return strict JSON only.",
        },
        {
          role: "user",
          content: `Generate ${args.count} unique ${args.type} questions.

Constraints:
- Keep each question under 160 chars.
- Avoid sexual, hateful, or unsafe content.
- Avoid repeating or paraphrasing existing questions.
- Output must be a JSON array only.
- Each item shape: {"content":"...", "topic":["fun"]}.
- Valid topic values: fun, hypothetical, food, cars, games, aspirational.
- If no clear topic, return empty topic array.

Preferred topics for this batch: ${args.topics.join(", ") || "none"}.

Existing questions to avoid (exact + similar):
${JSON.stringify(args.existingQuestions)}`,
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "questions",
          schema: {
            type: "array",
            minItems: args.count,
            items: {
              type: "object",
              additionalProperties: false,
              required: ["content", "topic"],
              properties: {
                content: { type: "string" },
                topic: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: [
                      "fun",
                      "hypothetical",
                      "food",
                      "cars",
                      "games",
                      "aspirational",
                    ],
                  },
                },
              },
            },
          },
        },
      },
      max_output_tokens: 3000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with status ${response.status}`);
  }

  const json = await response.json();
  const textOutput = json?.output_text;
  if (typeof textOutput !== "string") {
    throw new Error("OpenAI response missing output_text");
  }

  const parsed = JSON.parse(textOutput);
  return aiQuestionResponseSchema.parse(parsed);
}

export async function createMessageTemplate(formData: FormData) {
  const user = await getUser();
  if (!user || !user.isAdmin) {
    redirect("/admin?status=unauthorized");
  }

  const parseResult = createMessageTemplateSchema.safeParse({
    content: formData.get("content"),
    gif: formData.get("gif"),
    type: formData.get("type"),
    topic: formData.getAll("topic"),
  });

  if (!parseResult.success) {
    redirect("/admin?status=invalid");
  }

  const payload = parseResult.data;

  await prisma.messageTemplate.create({
    data: {
      content: payload.content,
      gif: payload.gif ? payload.gif : null,
      type: payload.type,
      topic: payload.topic,
      active: true,
    },
  });

  revalidatePath("/admin");
  redirect("/admin?status=created");
}

export async function generateAIQuestions(formData: FormData) {
  const user = await getUser();
  if (!user || !user.isAdmin) {
    redirect("/admin?status=unauthorized");
  }

  const parsed = generateQuestionsSchema.safeParse({
    type: formData.get("type"),
    count: formData.get("count"),
    topic: formData.getAll("topic"),
  });

  if (!parsed.success) {
    redirect("/admin?status=generate-invalid");
  }

  const payload = parsed.data;

  const existingTemplates = await prisma.messageTemplate.findMany({
    where: {
      type: payload.type,
    },
    select: {
      content: true,
    },
  });

  const existingContents = existingTemplates.map((item) => item.content);
  const existingSeeds = existingContents.map(buildSeed);
  const acceptedSeeds: SimilaritySeed[] = [...existingSeeds];
  const accepted: { content: string; topic: z.infer<typeof topicSchema>[] }[] =
    [];

  // Retry up to 3 rounds so we can still hit requested count after similarity filtering.
  for (let round = 0; round < 3 && accepted.length < payload.count; round += 1) {
    const toGenerate = Math.min(
      60,
      Math.max(12, (payload.count - accepted.length) * 3)
    );

    let generatedBatch: z.infer<typeof aiQuestionSchema>[] = [];
    try {
      generatedBatch = await callOpenAIForQuestions({
        type: payload.type,
        count: toGenerate,
        topics: payload.topic,
        existingQuestions: existingContents.concat(
          accepted.map((item) => item.content)
        ),
      });
    } catch {
      redirect("/admin?status=generate-failed");
    }

    for (const item of generatedBatch) {
      const content = item.content.trim();
      const seed = buildSeed(content);
      if (isTooSimilar(seed, acceptedSeeds)) {
        continue;
      }

      const topics = payload.topic.length ? payload.topic : item.topic;
      accepted.push({ content, topic: topics });
      acceptedSeeds.push(seed);

      if (accepted.length >= payload.count) {
        break;
      }
    }
  }

  if (!accepted.length) {
    redirect("/admin?status=generate-empty");
  }

  const toInsert = accepted.slice(0, payload.count);

  await prisma.messageTemplate.createMany({
    data: toInsert.map((item) => ({
      content: item.content,
      type: payload.type,
      topic: item.topic,
      active: true,
    })),
  });

  revalidatePath("/admin");
  redirect(`/admin?status=generated&count=${toInsert.length}`);
}

export async function deleteMessageTemplate(formData: FormData) {
  const user = await getUser();
  if (!user || !user.isAdmin) {
    redirect("/admin?tab=questions&status=unauthorized");
  }

  const parsed = deleteMessageTemplateSchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsed.success) {
    redirect("/admin?tab=questions&status=delete-invalid");
  }

  const linkedMessagesCount = await prisma.message.count({
    where: { messageTemplateId: parsed.data.id },
  });

  if (linkedMessagesCount > 0) {
    redirect("/admin?tab=questions&status=delete-blocked");
  }

  try {
    await prisma.messageTemplate.delete({
      where: { id: parsed.data.id },
    });
  } catch {
    redirect("/admin?tab=questions&status=delete-failed");
  }

  revalidatePath("/admin");
  redirect("/admin?tab=questions&status=deleted");
}

export async function getAdminDashboardData(filters?: {
  type?: z.infer<typeof messageTemplateTypeSchema>;
  topics?: z.infer<typeof topicSchema>[];
  page?: number;
}) {
  const user = await getUser();
  if (!user || !user.isAdmin) {
    return null;
  }

  const pageSize = 10;
  const currentPage = Math.max(1, filters?.page ?? 1);
  const messageTemplateWhere = {
    ...(filters?.type ? { type: filters.type } : {}),
    ...(filters?.topics?.length ? { topic: { hasSome: filters.topics } } : {}),
  };

  const [
    totalMessageTemplates,
    messageTemplates,
    users,
    integrations,
    channels,
    channelSettings,
    messages,
    reminders,
    spotlightQueue,
  ] = await Promise.all([
    prisma.messageTemplate.count({
      where: messageTemplateWhere,
    }),
    prisma.messageTemplate.findMany({
      where: messageTemplateWhere,
      orderBy: { id: "desc" },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        content: true,
        type: true,
        topic: true,
        active: true,
        createdAt: true,
      },
    }),
    prisma.user.findMany({
      orderBy: { id: "desc" },
      take: 5,
      select: {
        id: true,
        email: true,
        name: true,
        externalProviderId: true,
      },
    }),
    prisma.integration.findMany({
      orderBy: { id: "desc" },
      take: 5,
      select: {
        id: true,
        teamName: true,
        teamId: true,
        type: true,
        active: true,
      },
    }),
    prisma.channel.findMany({
      orderBy: { id: "desc" },
      take: 5,
      select: {
        id: true,
        publicId: true,
        channelName: true,
        type: true,
        active: true,
        integrationId: true,
      },
    }),
    prisma.channelSetting.findMany({
      orderBy: { id: "desc" },
      take: 5,
      select: {
        id: true,
        channelId: true,
        timezone: true,
        timeOfday: true,
        daysOfWeek: true,
      },
    }),
    prisma.message.findMany({
      orderBy: { id: "desc" },
      take: 5,
      select: {
        id: true,
        channelId: true,
        messageTemplateId: true,
        status: true,
        sent_ts: true,
      },
    }),
    prisma.reminder.findMany({
      orderBy: { id: "desc" },
      take: 5,
      select: {
        id: true,
        messageId: true,
        status: true,
        sent_ts: true,
      },
    }),
    prisma.spotlightMessageQueue.findMany({
      orderBy: { id: "desc" },
      take: 5,
      select: {
        id: true,
        channelId: true,
        members: true,
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalMessageTemplates / pageSize));

  return {
    messageTemplates,
    pagination: {
      page: currentPage,
      pageSize,
      totalItems: totalMessageTemplates,
      totalPages,
    },
    tablePreviews: [
      { name: "User", rows: users },
      { name: "Integration", rows: integrations },
      { name: "Channel", rows: channels },
      { name: "ChannelSetting", rows: channelSettings },
      { name: "MessageTemplate", rows: messageTemplates.slice(0, 5) },
      { name: "Message", rows: messages },
      { name: "Reminder", rows: reminders },
      { name: "SpotlightMessageQueue", rows: spotlightQueue },
    ],
  };
}
