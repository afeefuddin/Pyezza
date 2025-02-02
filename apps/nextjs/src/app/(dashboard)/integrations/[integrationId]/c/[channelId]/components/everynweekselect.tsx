import { Dispatch, SetStateAction } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function EveryNWeekSelect({
  value,
  setValue,
}: {
  value: number;
  setValue: Dispatch<SetStateAction<number>>;
}) {
  const valueMetaData: Record<number, string> = {
    1: "Every Week",
    2: "Every 2 Weeks",
    3: "Every 3 Weeks",
    4: "Every Month",
  };

  return (
    <Select value={value.toString()} onValueChange={(v) => setValue(Number(v))}>
      <SelectTrigger className="w-full col-span-4">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(valueMetaData).map(([key, label]) => (
          <SelectItem value={key} key={key}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
