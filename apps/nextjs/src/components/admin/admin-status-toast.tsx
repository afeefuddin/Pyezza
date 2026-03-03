"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function AdminStatusToast({
  message,
  durationMs = 5000,
  progressColor = "green",
}: {
  message: string;
  durationMs?: number;
  progressColor?: "green" | "red";
}) {
  const [visible, setVisible] = useState(true);
  const [progressActive, setProgressActive] = useState(false);

  useEffect(() => {
    const animationKickoff = requestAnimationFrame(() => {
      setProgressActive(true);
    });
    const timeout = window.setTimeout(() => {
      setVisible(false);
    }, durationMs);

    return () => {
      cancelAnimationFrame(animationKickoff);
      window.clearTimeout(timeout);
    };
  }, [durationMs]);

  if (!visible) {
    return null;
  }

  const progressBarClass =
    progressColor === "red" ? "bg-red-500" : "bg-green-500";

  return (
    <div className="fixed bottom-6 right-6 z-[70] w-[360px] max-w-[calc(100vw-3rem)] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
      <div
        className={`h-1 transition-[width] ease-linear ${progressBarClass}`}
        style={{
          width: progressActive ? "0%" : "100%",
          transitionDuration: `${durationMs}ms`,
        }}
      />
      <div className="flex items-start justify-between gap-3 px-4 py-3">
        <p className="pr-2 text-sm font-medium text-slate-700">{message}</p>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="inline-flex h-6 w-6 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
