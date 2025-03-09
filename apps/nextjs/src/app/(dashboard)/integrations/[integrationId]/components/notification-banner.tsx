"use client";
import { Bell, X } from "lucide-react";
import { useState } from "react";

export default function NotificationBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) {
    return null;
  }
  return (
    <div className="relative mb-6 rounded-lg bg-gradient-to-r from-orange-200 to-orange-300 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white">
          <Bell size={20} />
        </div>

        <div className="flex-1">
          <p className="font-medium text-gray-800">
            The channel has been added to Slack. Join Now and Invite your team!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="rounded-full p-1 text-gray-600"
            aria-label="Close notification"
            onClick={() => setVisible(false)}
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
