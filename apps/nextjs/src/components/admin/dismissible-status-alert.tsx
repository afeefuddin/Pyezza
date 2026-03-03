"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function DismissibleStatusAlert({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className={`relative rounded-md border p-3 pr-10 text-sm ${className}`}>
      {children}
      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label="Close alert"
        className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-md hover:bg-black/5"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
