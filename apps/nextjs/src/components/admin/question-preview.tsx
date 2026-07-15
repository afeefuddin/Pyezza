type QuestionType = "socialsips" | "wouldyourather" | "spotlight";

type QuestionPreviewProps = {
  content: string;
  gif: string | null;
  type: QuestionType;
};

function getPreviewHeading(type: QuestionType) {
  switch (type) {
    case "socialsips":
      return "🥤 Time for a social sip 🥤";
    case "wouldyourather":
      return "Would you rather 🤔";
    case "spotlight":
      return "🌟 The Spotlight is on @teammate 🌟";
  }
}

function getGifImageUrl(value: string) {
  try {
    const url = new URL(value);
    const isGiphyPage =
      url.hostname === "giphy.com" || url.hostname === "www.giphy.com";
    const gifId = isGiphyPage
      ? url.pathname.match(/-([a-zA-Z0-9]+)$/)?.[1]
      : undefined;

    return gifId ? `https://media.giphy.com/media/${gifId}/giphy.gif` : value;
  } catch {
    return value;
  }
}

export default function QuestionPreview({
  content,
  gif,
  type,
}: QuestionPreviewProps) {
  return (
    <div className="rounded-lg border border-slate-200/80 bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-orange-500 text-sm font-bold text-white">
          P
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-none text-slate-900">
            Pyezza
            <span className="ml-1.5 rounded bg-slate-100 px-1 py-0.5 text-[9px] font-bold tracking-wide text-slate-500">
              APP
            </span>
          </p>
          <p className="mt-1 text-[11px] text-slate-400">Message preview</p>
        </div>
      </div>

      <div className="space-y-2 pl-10 text-sm text-slate-800">
        <p className="font-semibold">{getPreviewHeading(type)}</p>
        <p className="border-l-4 border-slate-200 pl-3 leading-6 text-slate-700">
          {content}
        </p>
        {gif ? (
          <div className="overflow-hidden rounded-md border border-slate-200 bg-slate-50">
            {/* A native image element preserves GIF animation. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getGifImageUrl(gif)}
              alt="GIF attached to this question"
              className="max-h-64 w-full object-contain"
              loading="lazy"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
