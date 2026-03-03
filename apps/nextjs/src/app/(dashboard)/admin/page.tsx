import Link from "next/link";
import { RotateCcw } from "lucide-react";
import {
  deleteMessageTemplate,
  getAdminDashboardData,
} from "@/actions/admin";
import AdminStatusToast from "@/components/admin/admin-status-toast";
import CreateQuestionModal from "@/components/admin/create-question-modal";
import DeleteQuestionButton from "@/components/admin/delete-question-button";
import DismissibleStatusAlert from "@/components/admin/dismissible-status-alert";
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
  const selectedTab = TAB_CONFIG.some((item) => item.key === resolvedSearchParams?.tab)
    ? (resolvedSearchParams?.tab as (typeof TAB_CONFIG)[number]["key"])
    : "questions";
  const pageFromSearchParam = Array.isArray(resolvedSearchParams?.page)
    ? resolvedSearchParams.page[0]
    : resolvedSearchParams?.page;
  const currentPage = Math.max(1, Number(pageFromSearchParam || "1") || 1);

  const data = await getAdminDashboardData({
    type: selectedType,
    topics: selectedTopics,
    page: currentPage,
  });

  if (!data) {
    return (
      <div className="p-4 lg:p-8 w-full overflow-y-auto">
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
  const hasActiveQuestionFilters =
    Boolean(selectedType) || selectedTopics.length > 0;
  const questionsPagination = data.pagination;
  const createQuestionsPageHref = (page: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(resolvedSearchParams)) {
      if (key === "mode") continue;
      if (Array.isArray(value)) {
        for (const item of value) {
          params.append(key, item);
        }
      } else if (value !== undefined) {
        params.set(key, value);
      }
    }
    params.set("tab", "questions");
    params.set("page", String(page));
    return `/admin?${params.toString()}`;
  };

  return (
    <div className="p-4 lg:p-8 w-full overflow-y-auto space-y-8">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Console</h1>
            <p className="text-muted-foreground">
              Manage content and workspace entities from one place with quick
              filters and tab-wise previews.
            </p>
          </div>
          {selectedTab === "questions" ? (
            <CreateQuestionModal defaultType={selectedType} />
          ) : null}
        </div>

        <section className="space-y-6 rounded-xl border bg-white p-6">
          <div className="flex flex-nowrap gap-8 overflow-x-auto">
            {TAB_CONFIG.map((tab) => (
              <Link
                key={tab.key}
                href={`/admin?tab=${tab.key}`}
                className={`whitespace-nowrap border-b-2 pb-3 text-sm font-semibold transition ${
                  selectedTab === tab.key
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          {resolvedSearchParams?.status === "created" ? (
            <AdminStatusToast message="New question added successfully." />
          ) : null}
          {resolvedSearchParams?.status === "generated" ? (
            <DismissibleStatusAlert className="border-green-200 bg-green-50 text-green-700">
              AI generated and saved {resolvedSearchParams.count || "0"} new questions.
            </DismissibleStatusAlert>
          ) : null}
          {resolvedSearchParams?.status === "deleted" ? (
            <AdminStatusToast
              message="Question deleted successfully."
              progressColor="red"
            />
          ) : null}
          {resolvedSearchParams?.status === "invalid" ? (
            <DismissibleStatusAlert className="border-red-200 bg-red-50 text-red-700">
              Invalid input. Please check form values and retry.
            </DismissibleStatusAlert>
          ) : null}
          {resolvedSearchParams?.status === "delete-invalid" ? (
            <DismissibleStatusAlert className="border-red-200 bg-red-50 text-red-700">
              Invalid question selection. Please try deleting again.
            </DismissibleStatusAlert>
          ) : null}
          {resolvedSearchParams?.status === "generate-invalid" ? (
            <DismissibleStatusAlert className="border-red-200 bg-red-50 text-red-700">
              Invalid AI generation input. Count must be between 10 and 20.
            </DismissibleStatusAlert>
          ) : null}
          {resolvedSearchParams?.status === "generate-empty" ? (
            <DismissibleStatusAlert className="border-amber-200 bg-amber-50 text-amber-700">
              AI could not find enough non-duplicate questions. Try changing topic
              or type.
            </DismissibleStatusAlert>
          ) : null}
          {resolvedSearchParams?.status === "generate-failed" ? (
            <DismissibleStatusAlert className="border-red-200 bg-red-50 text-red-700">
              AI generation failed. Check OPENAI_API_KEY and try again.
            </DismissibleStatusAlert>
          ) : null}
          {resolvedSearchParams?.status === "delete-failed" ? (
            <DismissibleStatusAlert className="border-red-200 bg-red-50 text-red-700">
              Could not delete this question right now. It may be referenced elsewhere.
            </DismissibleStatusAlert>
          ) : null}
          {resolvedSearchParams?.status === "delete-blocked" ? (
            <DismissibleStatusAlert className="border-amber-200 bg-amber-50 text-amber-700">
              This template cannot be deleted because messages already created from it exist.
            </DismissibleStatusAlert>
          ) : null}

          {selectedTab === "questions" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Existing Questions</h2>
              <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  Showing {data.messageTemplates.length} of {questionsPagination.totalItems} questions
                </p>
                {hasActiveQuestionFilters ? (
                  <>
                    <span className="h-4 w-px bg-slate-300" aria-hidden="true" />
                    <Link
                      href="/admin?tab=questions"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-600 underline-offset-4 hover:underline"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Reset filters
                    </Link>
                  </>
                ) : null}
              </div>
            </div>

            <QuestionFilters
              selectedType={selectedType}
              selectedTopics={selectedTopics}
            />

            <div className="overflow-x-auto rounded-md border bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40 text-left">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Topic</th>
                    <th className="py-3 px-4">Content</th>
                    <th className="py-3 px-4">Active</th>
                    <th className="py-3 px-4">Created</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.messageTemplates.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b align-top odd:bg-white even:bg-muted/20"
                    >
                      <td className="py-3 px-4 font-mono text-xs">{item.id}</td>
                      <td className="py-3 px-4">{item.type}</td>
                      <td className="py-3 px-4">{item.topic.join(", ") || "-"}</td>
                      <td className="py-3 px-4 max-w-xl whitespace-pre-wrap">
                        {item.content}
                      </td>
                      <td className="py-3 px-4">
                        {item.active ? (
                          <span className="inline-flex w-fit items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-green-800">
                            yes
                          </span>
                        ) : (
                          <span className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-slate-600">
                            no
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {item.createdAt.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end">
                          <DeleteQuestionButton
                            id={item.id}
                            onDelete={deleteMessageTemplate}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!data.messageTemplates.length ? (
                    <tr>
                      <td colSpan={7} className="py-8 px-4 text-center text-muted-foreground">
                        No questions found for selected filters.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
            {questionsPagination.totalPages > 1 ? (
              <div className="flex items-center justify-between pt-2">
                <p className="text-sm text-muted-foreground">
                  Page {questionsPagination.page} of {questionsPagination.totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <Link
                    href={createQuestionsPageHref(Math.max(1, questionsPagination.page - 1))}
                    aria-disabled={questionsPagination.page <= 1}
                    className={`inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-sm font-medium ${
                      questionsPagination.page <= 1
                        ? "pointer-events-none opacity-50"
                        : "hover:bg-muted"
                    }`}
                  >
                    Previous
                  </Link>
                  <Link
                    href={createQuestionsPageHref(
                      Math.min(questionsPagination.totalPages, questionsPagination.page + 1)
                    )}
                    aria-disabled={questionsPagination.page >= questionsPagination.totalPages}
                    className={`inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-sm font-medium ${
                      questionsPagination.page >= questionsPagination.totalPages
                        ? "pointer-events-none opacity-50"
                        : "hover:bg-muted"
                    }`}
                  >
                    Next
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
          ) : null}

          {selectedTab !== "questions" && selectedTablePreview ? (
            <div className="space-y-3">
              <h3 className="font-semibold mb-3">
                {selectedTablePreview.name} (latest {selectedTablePreview.rows.length} rows)
              </h3>
              {selectedTablePreview.rows.length === 0 ? (
                <p className="text-sm text-muted-foreground">No data found.</p>
              ) : (
                <div className="overflow-x-auto rounded-md border bg-white">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/40 text-left">
                        {Object.keys(selectedTablePreview.rows[0]).map((column) => (
                            <th key={column} className="py-3 px-4">
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
                            <td key={column} className="py-3 px-4 max-w-md break-words">
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
          ) : null}
        </section>
      </div>
    </div>
  );
}
