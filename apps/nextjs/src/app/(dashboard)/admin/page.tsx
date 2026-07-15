import Link from "next/link";
import { Hash, ImageIcon, RotateCcw } from "lucide-react";
import { deleteMessageTemplate, getAdminQuestionsData } from "@/actions/admin";
import AdminStatusToast from "@/components/admin/admin-status-toast";
import CreateQuestionModal from "@/components/admin/create-question-modal";
import DeleteQuestionButton from "@/components/admin/delete-question-button";
import DismissibleStatusAlert from "@/components/admin/dismissible-status-alert";
import QuestionFilters from "@/components/admin/question-filters";
import QuestionPreview from "@/components/admin/question-preview";

const TOPICS = [
  "fun",
  "hypothetical",
  "food",
  "cars",
  "games",
  "aspirational",
] as const;

const TYPES = ["socialsips", "wouldyourather", "spotlight"] as const;

const TYPE_LABELS: Record<(typeof TYPES)[number], string> = {
  socialsips: "Social Sips",
  wouldyourather: "Would You Rather",
  spotlight: "Spotlight",
};

type AdminSearchParams = {
  status?: string;
  count?: string;
  type?: string;
  [key: string]: string | string[] | undefined;
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: AdminSearchParams | Promise<AdminSearchParams>;
}) {
  const resolvedSearchParams = await (searchParams ?? {});

  const selectedType =
    resolvedSearchParams.type &&
    TYPES.includes(resolvedSearchParams.type as (typeof TYPES)[number])
      ? (resolvedSearchParams.type as (typeof TYPES)[number])
      : undefined;
  const topicFromPrefixedKeys = TOPICS.filter((topic) => {
    const value = resolvedSearchParams[`topic_${topic}`];
    if (Array.isArray(value)) {
      return value.some((item) => ["1", "on", "true"].includes(item));
    }
    return ["1", "on", "true"].includes(String(value));
  });
  const genericTopics = resolvedSearchParams.topic;
  const topicFromGenericKey = (
    Array.isArray(genericTopics)
      ? genericTopics
      : genericTopics
        ? [genericTopics]
        : []
  ).filter((topic): topic is (typeof TOPICS)[number] =>
    TOPICS.includes(topic as (typeof TOPICS)[number]),
  );
  const selectedTopics = Array.from(
    new Set([...topicFromPrefixedKeys, ...topicFromGenericKey]),
  );
  const pageFromSearchParam = Array.isArray(resolvedSearchParams.page)
    ? resolvedSearchParams.page[0]
    : resolvedSearchParams.page;
  const currentPage = Math.max(1, Number(pageFromSearchParam || "1") || 1);

  const data = await getAdminQuestionsData({
    type: selectedType,
    topics: selectedTopics,
    page: currentPage,
  });

  if (!data) {
    return (
      <div className="w-full overflow-y-auto p-4 lg:p-8">
        <h1 className="text-3xl font-bold">Questions</h1>
        <p className="mt-2 text-muted-foreground">
          Admin access required. Please sign in with an admin-marked account.
        </p>
      </div>
    );
  }

  const hasActiveQuestionFilters =
    Boolean(selectedType) || selectedTopics.length > 0;
  const questionsPagination = data.pagination;
  const createQuestionsPageHref = (page: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(resolvedSearchParams)) {
      if (["mode", "status", "count", "tab", "page"].includes(key)) continue;
      if (Array.isArray(value)) {
        value.forEach((item) => params.append(key, item));
      } else if (value !== undefined) {
        params.set(key, value);
      }
    }
    params.set("page", String(page));
    return `/admin?${params.toString()}`;
  };

  return (
    <main className="w-full overflow-y-auto bg-slate-50/70 px-4 py-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
              Message templates
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              Questions
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Create prompts and review exactly how each one will appear to your
              team.
            </p>
          </div>
          <CreateQuestionModal defaultType={selectedType} />
        </header>

        {resolvedSearchParams.status === "created" ? (
          <AdminStatusToast message="New question added successfully." />
        ) : null}
        {resolvedSearchParams.status === "generated" ? (
          <DismissibleStatusAlert className="border-green-200 bg-green-50 text-green-700">
            AI generated and saved {resolvedSearchParams.count || "0"} new
            questions.
          </DismissibleStatusAlert>
        ) : null}
        {resolvedSearchParams.status === "deleted" ? (
          <AdminStatusToast
            message="Question deleted successfully."
            progressColor="red"
          />
        ) : null}
        {resolvedSearchParams.status === "invalid" ? (
          <DismissibleStatusAlert className="border-red-200 bg-red-50 text-red-700">
            Invalid input. Please check form values and retry.
          </DismissibleStatusAlert>
        ) : null}
        {resolvedSearchParams.status === "generate-invalid" ? (
          <DismissibleStatusAlert className="border-red-200 bg-red-50 text-red-700">
            Invalid AI generation input. Count must be between 10 and 20.
          </DismissibleStatusAlert>
        ) : null}
        {resolvedSearchParams.status === "generate-empty" ? (
          <DismissibleStatusAlert className="border-amber-200 bg-amber-50 text-amber-700">
            AI could not find enough non-duplicate questions. Try another topic
            or type.
          </DismissibleStatusAlert>
        ) : null}
        {resolvedSearchParams.status === "generate-failed" ? (
          <DismissibleStatusAlert className="border-red-200 bg-red-50 text-red-700">
            AI generation failed. Check OPENAI_API_KEY and try again.
          </DismissibleStatusAlert>
        ) : null}
        {resolvedSearchParams.status === "delete-failed" ? (
          <DismissibleStatusAlert className="border-red-200 bg-red-50 text-red-700">
            This question could not be deleted right now.
          </DismissibleStatusAlert>
        ) : null}
        {resolvedSearchParams.status === "delete-invalid" ? (
          <DismissibleStatusAlert className="border-red-200 bg-red-50 text-red-700">
            Invalid question selection. Please try deleting it again.
          </DismissibleStatusAlert>
        ) : null}
        {resolvedSearchParams.status === "delete-blocked" ? (
          <DismissibleStatusAlert className="border-amber-200 bg-amber-50 text-amber-700">
            This template cannot be deleted because messages created from it
            already exist.
          </DismissibleStatusAlert>
        ) : null}

        <section className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5">
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-800">
                  {data.messageTemplates.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-800">
                  {questionsPagination.totalItems}
                </span>{" "}
                questions
              </p>
              {hasActiveQuestionFilters ? (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-600 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset filters
                </Link>
              ) : null}
            </div>
            <QuestionFilters
              selectedType={selectedType}
              selectedTopics={selectedTopics}
            />
          </div>

          <div className="divide-y divide-slate-100">
            {data.messageTemplates.map((item) => (
              <article
                key={item.id}
                className="grid gap-5 py-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,1.1fr)]"
              >
                <div className="flex min-w-0 flex-col">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700">
                        {TYPE_LABELS[item.type]}
                      </span>
                      {item.topic.map((topic) => (
                        <span
                          key={topic}
                          className="inline-flex items-center gap-1 text-xs text-slate-500"
                        >
                          <Hash className="h-3 w-3" />
                          {topic}
                        </span>
                      ))}
                      {!item.active ? (
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">
                          Inactive
                        </span>
                      ) : null}
                    </div>
                    <DeleteQuestionButton
                      id={item.id}
                      onDelete={deleteMessageTemplate}
                    />
                  </div>

                  <p className="whitespace-pre-wrap text-base font-medium leading-7 text-slate-900">
                    {item.content}
                  </p>

                  <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5 text-xs text-slate-400">
                    <span>Question #{item.id}</span>
                    <span>{item.createdAt.toLocaleDateString()}</span>
                    {item.gif ? (
                      <span className="inline-flex items-center gap-1.5 text-slate-500">
                        <ImageIcon className="h-3.5 w-3.5" /> GIF attached
                      </span>
                    ) : null}
                  </div>
                </div>

                <QuestionPreview
                  content={item.content}
                  gif={item.gif}
                  type={item.type}
                />
              </article>
            ))}

            {!data.messageTemplates.length ? (
              <div className="py-16 text-center">
                <p className="font-medium text-slate-800">No questions found</p>
                <p className="mt-1 text-sm text-slate-500">
                  Try removing a filter or create a new question.
                </p>
              </div>
            ) : null}
          </div>
        </section>

        {questionsPagination.totalPages > 1 ? (
          <nav
            className="flex items-center justify-between"
            aria-label="Question pages"
          >
            <p className="text-sm text-slate-500">
              Page {questionsPagination.page} of{" "}
              {questionsPagination.totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Link
                href={createQuestionsPageHref(
                  Math.max(1, questionsPagination.page - 1),
                )}
                aria-disabled={questionsPagination.page <= 1}
                className={`rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${
                  questionsPagination.page <= 1
                    ? "pointer-events-none opacity-50"
                    : ""
                }`}
              >
                Previous
              </Link>
              <Link
                href={createQuestionsPageHref(
                  Math.min(
                    questionsPagination.totalPages,
                    questionsPagination.page + 1,
                  ),
                )}
                aria-disabled={
                  questionsPagination.page >= questionsPagination.totalPages
                }
                className={`rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${
                  questionsPagination.page >= questionsPagination.totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }`}
              >
                Next
              </Link>
            </div>
          </nav>
        ) : null}
      </div>
    </main>
  );
}
