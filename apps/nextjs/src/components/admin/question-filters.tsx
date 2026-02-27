"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import Link from "next/link";

const TOPICS = [
  "fun",
  "hypothetical",
  "food",
  "cars",
  "games",
  "aspirational",
] as const;

const TYPES = ["socialsips", "wouldyourather", "spotlight"] as const;

type Topic = (typeof TOPICS)[number];
type Type = (typeof TYPES)[number];

export default function QuestionFilters({
  selectedType,
  selectedTopics,
}: {
  selectedType?: Type;
  selectedTopics: Topic[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [typeValue, setTypeValue] = useState<string>(selectedType || "");
  const [topics, setTopics] = useState<Set<Topic>>(
    () => new Set(selectedTopics)
  );

  const selectedCount = useMemo(() => topics.size, [topics]);

  function pushFilters(nextType: string, nextTopics: Set<Topic>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", "questions");
    params.set("mode", "list");

    // Clear status banners when changing filters.
    params.delete("status");
    params.delete("count");

    if (nextType) {
      params.set("type", nextType);
    } else {
      params.delete("type");
    }

    for (const topic of TOPICS) {
      params.delete(`topic_${topic}`);
    }
    for (const topic of nextTopics) {
      params.set(`topic_${topic}`, "1");
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  function onTypeChange(value: string) {
    setTypeValue(value);
    pushFilters(value, topics);
  }

  function onTopicToggle(topic: Topic) {
    const next = new Set(topics);
    if (next.has(topic)) {
      next.delete(topic);
    } else {
      next.add(topic);
    }
    setTopics(next);
    pushFilters(typeValue, next);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
      <div className="space-y-1">
        <p className="text-sm font-medium">Question Type</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onTypeChange("")}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${
              !typeValue
                ? "border-primary bg-primary/10 text-primary"
                : "border-muted-foreground/30 hover:bg-muted"
            }`}
            aria-pressed={!typeValue}
          >
            all
          </button>
          {TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onTypeChange(typeValue === type ? "" : type)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${
                typeValue === type
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-muted-foreground/30 hover:bg-muted"
              }`}
              aria-pressed={typeValue === type}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1 md:col-span-2">
        <p className="text-sm font-medium">
          Preferred Topics (quick multi-select)
        </p>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((topic) => {
            const active = topics.has(topic);
            return (
              <button
                key={`filter-${topic}`}
                type="button"
                onClick={() => onTopicToggle(topic)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-muted-foreground/30 hover:bg-muted"
                }`}
                aria-pressed={active}
              >
                {topic}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex md:items-end">
        <Link
          href="/admin?tab=questions"
          className="inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium"
        >
          Reset {selectedCount ? `(${selectedCount})` : ""}
        </Link>
      </div>
    </div>
  );
}
