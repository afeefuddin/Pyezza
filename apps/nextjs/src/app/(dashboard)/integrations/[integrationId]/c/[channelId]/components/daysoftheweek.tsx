import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";

export function DaysOfTheWeek({
  value,
  setValue,
}: {
  value: number[];
  setValue: Dispatch<SetStateAction<number[]>>;
}) {
  const days = ["Mon", "Tue", "Wed", "Thurs", "Fri", "Sat", "Sun"];

  return (
    <div className="flex gap-2 w-full col-span-4">
      {days.map((d, idx) => {
        const isSelected = value.includes(idx);
        return (
          <div
            key={idx}
            className={cn(
              "py-2 flex items-center justify-center bg-muted hover:cursor-pointer rounded flex-1",
              {
                "bg-primary/90 text-primary-foreground": isSelected,
              }
            )}
            onClick={() => {
              setValue((prev) =>
                prev.includes(idx)
                  ? prev.filter((c) => (prev.length > 1 ? c !== idx : true))
                  : [...prev, idx]
              );
            }}
          >
            {d}
          </div>
        );
      })}
    </div>
  );
}