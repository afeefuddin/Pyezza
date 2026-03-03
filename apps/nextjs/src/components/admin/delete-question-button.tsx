"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function DeleteQuestionButton({
  id,
  onDelete,
}: {
  id: number;
  onDelete: (formData: FormData) => void | Promise<void>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Delete question"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 text-red-700 transition hover:bg-red-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-white text-slate-900">
        <DialogHeader>
          <DialogTitle>Delete Question?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. The selected question will be permanently removed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <button
              type="button"
              className="inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium"
            >
              Cancel
            </button>
          </DialogClose>
          <form action={onDelete}>
            <input type="hidden" name="id" value={id} />
            <button
              type="submit"
              className="inline-flex h-9 items-center justify-center rounded-md bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Yes, delete
            </button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
