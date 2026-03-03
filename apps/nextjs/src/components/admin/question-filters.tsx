"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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

  useEffect(() => {
    setTypeValue(selectedType || "");
    setTopics(new Set(selectedTopics));
  }, [selectedType, selectedTopics]);

  const selectedCount = useMemo(() => topics.size, [topics]);

  function pushFilters(nextType: string, nextTopics: Set<Topic>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", "questions");
    params.delete("mode");
    params.delete("page");

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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-end lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-700">Question Type</p>
        <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => onTypeChange("")}
            className={`w-fit whitespace-nowrap rounded-xl border px-3 py-2 text-left text-sm font-medium transition ${
              !typeValue
                ? "border-orange-500 bg-orange-50 text-orange-700"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
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
              className={`w-fit whitespace-nowrap rounded-xl border px-3 py-2 text-left text-sm font-medium transition ${
                typeValue === type
                  ? "border-orange-500 bg-orange-50 text-orange-700"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
              aria-pressed={typeValue === type}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-700">
          Preferred Topics (quick multi-select)
        </p>
        <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1">
          {TOPICS.map((topic) => {
            const active = topics.has(topic);
            return (
              <button
                key={`filter-${topic}`}
                type="button"
                onClick={() => onTopicToggle(topic)}
                className={`w-fit whitespace-nowrap rounded-xl border px-3 py-2 text-left text-sm font-medium transition ${
                  active
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
                aria-pressed={active}
              >
                {topic}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
