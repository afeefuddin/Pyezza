"use client";

import { useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import { createMessageTemplate, generateAIQuestions } from "@/actions/admin";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const TYPES = ["socialsips", "wouldyourather", "spotlight"] as const;
const TOPICS = [
  "fun",
  "hypothetical",
  "food",
  "cars",
  "games",
  "aspirational",
] as const;

type QuestionType = (typeof TYPES)[number];
type TopicType = (typeof TOPICS)[number];
type ModalTab = "manual" | "bulk";

function TypeSelector({
  value,
  onChange,
  inputName,
}: {
  value: QuestionType;
  onChange: (value: QuestionType) => void;
  inputName: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-slate-700">Question Type</p>
      <input type="hidden" name={inputName} value={value} />
      <div className="flex flex-wrap gap-2">
        {TYPES.map((type) => {
          const isActive = type === value;
          return (
            <button
              key={type}
              type="button"
              onClick={() => onChange(type)}
              className={`w-fit rounded-xl border px-3 py-2 text-left text-sm font-medium transition ${
                isActive
                  ? "border-orange-500 bg-orange-50 text-orange-700"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              {type}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TopicSelector({
  value,
  onChange,
}: {
  value: TopicType;
  onChange: (value: TopicType) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-slate-700">Topics</p>
      <input type="hidden" name="topic" value={value} />
      <div className="flex flex-wrap gap-2">
        {TOPICS.map((topic) => {
          const isActive = topic === value;
          return (
          <button
            key={topic}
            type="button"
            onClick={() => onChange(topic)}
            className={`w-fit rounded-xl border px-3 py-2 text-left text-sm font-medium transition ${
              isActive
                ? "border-orange-500 bg-orange-50 text-orange-700"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            <span className="capitalize">{topic}</span>
          </button>
        )})}
      </div>
    </div>
  );
}

export default function CreateQuestionModal({
  defaultType,
}: {
  defaultType?: QuestionType;
}) {
  const [tab, setTab] = useState<ModalTab>("manual");
  const [manualType, setManualType] = useState<QuestionType>(
    defaultType || "socialsips"
  );
  const [bulkType, setBulkType] = useState<QuestionType>(
    defaultType || "socialsips"
  );
  const [manualTopic, setManualTopic] = useState<TopicType>("fun");
  const [bulkTopic, setBulkTopic] = useState<TopicType>("fun");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Create New Questions
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl gap-0 overflow-hidden border-slate-200 bg-white p-0 text-slate-900">
        <div className="border-b px-6 py-5">
          <DialogTitle className="text-xl font-semibold text-slate-900">
            Create New Questions
          </DialogTitle>
        </div>

        <div className="border-b px-6 pt-2">
          <div className="flex gap-8">
            <button
              type="button"
              onClick={() => setTab("manual")}
              className={`border-b-2 pb-3 text-sm font-semibold transition ${
                tab === "manual"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Manual Creation
            </button>
            <button
              type="button"
              onClick={() => setTab("bulk")}
              className={`border-b-2 pb-3 text-sm font-semibold transition ${
                tab === "bulk"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              AI Bulk Create
            </button>
          </div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
          {tab === "manual" ? (
            <form action={createMessageTemplate} className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="content" className="text-sm font-semibold text-slate-700">
                    Question Content
                  </label>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-600"
                  >
                    <Sparkles className="h-4 w-4" />
                    AI Assist
                  </button>
                </div>
                <textarea
                  id="content"
                  name="content"
                  required
                  className="min-h-36 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-orange-400"
                  placeholder="Write question text here..."
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <TypeSelector
                  value={manualType}
                  onChange={setManualType}
                  inputName="type"
                />
                <div className="space-y-2">
                  <label htmlFor="gif" className="text-sm font-semibold text-slate-700">
                    GIF URL (optional)
                  </label>
                  <input
                    id="gif"
                    name="gif"
                    type="url"
                    className="h-10 w-full rounded-xl border border-slate-200 px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-orange-400"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <TopicSelector value={manualTopic} onChange={setManualTopic} />

              <div className="flex items-center justify-between border-t bg-slate-50 -mx-6 px-6 py-4">
                <DialogClose asChild>
                  <button
                    type="button"
                    className="inline-flex h-10 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                </DialogClose>
                <button
                  type="submit"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-orange-500 px-5 text-sm font-semibold text-white hover:bg-orange-600"
                >
                  Save Question
                </button>
              </div>
            </form>
          ) : (
            <form action={generateAIQuestions} className="space-y-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <TypeSelector value={bulkType} onChange={setBulkType} inputName="type" />
                <div className="space-y-2">
                  <label htmlFor="count" className="text-sm font-semibold text-slate-700">
                    Count
                  </label>
                  <input
                    id="count"
                    name="count"
                    type="number"
                    min={10}
                    max={20}
                    defaultValue={10}
                    required
                    className="h-10 w-full rounded-xl border border-slate-200 px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-orange-400"
                  />
                  <p className="text-xs text-slate-500">Allowed range: 10 to 20 questions</p>
                </div>
              </div>

              <TopicSelector value={bulkTopic} onChange={setBulkTopic} />

              <div className="flex items-center justify-between border-t bg-slate-50 -mx-6 px-6 py-4">
                <DialogClose asChild>
                  <button
                    type="button"
                    className="inline-flex h-10 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                </DialogClose>
                <button
                  type="submit"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-orange-500 px-5 text-sm font-semibold text-white hover:bg-orange-600"
                >
                  Generate Questions
                </button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
