import Link from "next/link";
import {
  createMessageTemplate,
  generateAIQuestions,
  getAdminDashboardData,
} from "@/actions/admin";
import QuestionFilters from "@/components/admin/question-filters";

const TOPICS = [
  "fun",
  "hypothetical",
  "food",
  "cars",
  "games",
  "aspirational",
] as const;

const TYPES = ["socialsips", "wouldyourather", "spotlight"] as const;

function formatValue(value: unknown) {
  if (value === null || value === undefined) return "-";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

type AdminSearchParams = {
  status?: string;
  count?: string;
  mode?: string;
  type?: string;
  tab?: string;
  [key: string]: string | string[] | undefined;
};

const TAB_CONFIG = [
  { key: "questions", label: "Questions", tableName: null },
  { key: "users", label: "Users", tableName: "User" },
  { key: "integrations", label: "Integrations", tableName: "Integration" },
  { key: "channels", label: "Channels", tableName: "Channel" },
  {
    key: "channel-settings",
    label: "Channel Settings",
    tableName: "ChannelSetting",
  },
  {
    key: "message-templates",
    label: "Message Templates",
    tableName: "MessageTemplate",
  },
  { key: "messages", label: "Messages", tableName: "Message" },
  { key: "reminders", label: "Reminders", tableName: "Reminder" },
  {
    key: "spotlight-queue",
    label: "Spotlight Queue",
    tableName: "SpotlightMessageQueue",
  },
] as const;

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: AdminSearchParams | Promise<AdminSearchParams>;
}) {
  const resolvedSearchParams = searchParams
    ? typeof (searchParams as Promise<AdminSearchParams>).then === "function"
      ? await (searchParams as Promise<AdminSearchParams>)
      : (searchParams as AdminSearchParams)
    : {};

  const selectedType =
    resolvedSearchParams?.type &&
    TYPES.includes(resolvedSearchParams.type as (typeof TYPES)[number])
      ? (resolvedSearchParams.type as (typeof TYPES)[number])
      : undefined;
  const topicFromPrefixedKeys = TOPICS.filter((topic) => {
    const key = `topic_${topic}`;
    const value = resolvedSearchParams?.[key];
    if (Array.isArray(value)) {
      return value.some((item) => ["1", "on", "true"].includes(item));
    }
    return ["1", "on", "true"].includes(String(value));
  });
  const topicFromGenericKey = (
    Array.isArray(resolvedSearchParams?.topic)
      ? resolvedSearchParams.topic
      : resolvedSearchParams?.topic
      ? [resolvedSearchParams.topic]
      : []
  ).filter((topic): topic is (typeof TOPICS)[number] =>
    TOPICS.includes(topic as (typeof TOPICS)[number])
  );
  const selectedTopics = Array.from(
    new Set([...topicFromPrefixedKeys, ...topicFromGenericKey])
  );
  const mode = resolvedSearchParams?.mode === "create" ? "create" : "list";
  const selectedTab = TAB_CONFIG.some((item) => item.key === resolvedSearchParams?.tab)
    ? (resolvedSearchParams?.tab as (typeof TAB_CONFIG)[number]["key"])
    : "questions";

  const data = await getAdminDashboardData({
    type: selectedType,
    topics: selectedTopics,
  });

  if (!data) {
    return (
      <div className="p-8 lg:p-16 w-full overflow-y-auto">
        <h1 className="text-3xl font-bold">Admin</h1>
        <p className="text-muted-foreground mt-2">
          Admin access required. Please sign in with an admin-marked account.
        </p>
      </div>
    );
  }

  const selectedTableName = TAB_CONFIG.find(
    (item) => item.key === selectedTab
  )?.tableName;
  const selectedTablePreview = selectedTableName
    ? data.tablePreviews.find((table) => table.name === selectedTableName)
    : null;

  return (
    <div className="p-8 lg:p-16 w-full overflow-y-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Console</h1>
          <p className="text-muted-foreground">
            Manage content and workspace entities from one place with quick
            filters and tab-wise previews.
          </p>
        </div>
        {selectedTab === "questions" && mode === "create" ? (
          <Link
            href="/admin?tab=questions"
            className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium"
          >
            Back to Existing Questions
          </Link>
        ) : selectedTab === "questions" ? (
          <Link
            href="/admin?tab=questions&mode=create"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Create New Questions
          </Link>
        ) : null}
      </div>

      <section className="rounded-xl border bg-white p-3">
        <div className="flex flex-wrap gap-2">
          {TAB_CONFIG.map((tab) => (
            <Link
              key={tab.key}
              href={`/admin?tab=${tab.key}${
                tab.key === "questions" && mode === "create"
                  ? "&mode=create"
                  : ""
              }`}
              className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium ${
                selectedTab === tab.key
                  ? "bg-primary text-primary-foreground"
                  : "border hover:bg-muted"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </section>

      {resolvedSearchParams?.status === "created" ? (
        <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          New question added successfully.
        </div>
      ) : null}
      {resolvedSearchParams?.status === "generated" ? (
        <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          AI generated and saved {resolvedSearchParams.count || "0"} new questions.
        </div>
      ) : null}
      {resolvedSearchParams?.status === "invalid" ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Invalid input. Please check form values and retry.
        </div>
      ) : null}
      {resolvedSearchParams?.status === "generate-invalid" ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Invalid AI generation input. Count must be between 10 and 20.
        </div>
      ) : null}
      {resolvedSearchParams?.status === "generate-empty" ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
          AI could not find enough non-duplicate questions. Try changing topic
          or type.
        </div>
      ) : null}
      {resolvedSearchParams?.status === "generate-failed" ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          AI generation failed. Check OPENAI_API_KEY and try again.
        </div>
      ) : null}

      {selectedTab === "questions" ? (
      <section className="rounded-xl border bg-white p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Existing Questions</h2>
          <p className="text-sm text-muted-foreground">
            Showing {data.messageTemplates.length} questions
          </p>
        </div>

        <QuestionFilters
          selectedType={selectedType}
          selectedTopics={selectedTopics}
        />

        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-left">
                <th className="py-2 px-3">ID</th>
                <th className="py-2 px-3">Type</th>
                <th className="py-2 px-3">Topic</th>
                <th className="py-2 px-3">Content</th>
                <th className="py-2 px-3">Active</th>
                <th className="py-2 px-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {data.messageTemplates.map((item) => (
                <tr
                  key={item.id}
                  className="border-b align-top odd:bg-white even:bg-muted/20"
                >
                  <td className="py-2 px-3 font-mono text-xs">{item.id}</td>
                  <td className="py-2 px-3">{item.type}</td>
                  <td className="py-2 px-3">{item.topic.join(", ") || "-"}</td>
                  <td className="py-2 px-3 max-w-xl whitespace-pre-wrap">
                    {item.content}
                  </td>
                  <td className="py-2 px-3">{item.active ? "yes" : "no"}</td>
                  <td className="py-2 px-3">
                    {item.createdAt.toLocaleString()}
                  </td>
                </tr>
              ))}
              {!data.messageTemplates.length ? (
                <tr>
                  <td colSpan={6} className="py-8 px-3 text-center text-muted-foreground">
                    No questions found for selected filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
      ) : null}

      {selectedTab === "questions" && mode === "create" ? (
        <section className="rounded-xl border bg-white p-6 space-y-6">
          <h2 className="text-xl font-semibold">Create New Questions</h2>

          <div className="space-y-3">
            <h3 className="font-medium">AI Bulk Create (10-20)</h3>
            <form action={generateAIQuestions} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="ai-type" className="text-sm font-medium">
                    Question Type
                  </label>
                  <select
                    id="ai-type"
                    name="type"
                    required
                    defaultValue={selectedType || "socialsips"}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  >
                    {TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label htmlFor="count" className="text-sm font-medium">
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
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Preferred Topics</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {TOPICS.map((topic) => (
                    <label
                      key={`ai-${topic}`}
                      className="flex items-center gap-2 rounded-md border p-2 text-sm"
                    >
                      <input type="checkbox" name="topic" value={topic} />
                      <span>{topic}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Generate Questions
              </button>
            </form>
          </div>

          <div className="border-t pt-5 space-y-3">
            <h3 className="font-medium">Manual Single Question</h3>
            <form action={createMessageTemplate} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="content" className="text-sm font-medium">
                  Question Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  required
                  className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  placeholder="Write question text here..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="type" className="text-sm font-medium">
                    Question Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    required
                    defaultValue={selectedType || "socialsips"}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  >
                    {TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label htmlFor="gif" className="text-sm font-medium">
                    GIF URL (optional)
                  </label>
                  <input
                    id="gif"
                    name="gif"
                    type="url"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Topics</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {TOPICS.map((topic) => (
                    <label
                      key={topic}
                      className="flex items-center gap-2 rounded-md border p-2 text-sm"
                    >
                      <input type="checkbox" name="topic" value={topic} />
                      <span>{topic}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Save Question
              </button>
            </form>
          </div>
        </section>
      ) : null}

      {selectedTab !== "questions" && selectedTablePreview ? (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">{selectedTablePreview.name}</h2>
          <div className="rounded-xl border bg-white p-6">
            <h3 className="font-semibold mb-3">
              {selectedTablePreview.name} (latest {selectedTablePreview.rows.length} rows)
            </h3>
            {selectedTablePreview.rows.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data found.</p>
            ) : (
              <div className="overflow-x-auto rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40 text-left">
                      {Object.keys(selectedTablePreview.rows[0]).map((column) => (
                        <th key={column} className="py-2 px-3">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTablePreview.rows.map((row, index) => (
                      <tr
                        key={index}
                        className="border-b align-top odd:bg-white even:bg-muted/20"
                      >
                        {Object.entries(row).map(([column, value]) => (
                          <td key={column} className="py-2 px-3 max-w-md break-words">
                            {formatValue(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}
