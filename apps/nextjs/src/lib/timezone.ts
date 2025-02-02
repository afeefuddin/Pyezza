export interface TimezoneOption {
  value: string; // IANA timezone identifier (used for storing in the DB)
  label: string; // Display label with the GMT offset
  zones: string[]; // Human-friendly zone names
}

export const timezoneOptions: TimezoneOption[] = [
  {
    value: "Etc/GMT+12", // IANA identifier for GMT-12:00
    label: "GMT-12:00",
    zones: ["Baker Island", "Howland Island"],
  },
  {
    value: "Etc/GMT+11", // GMT-11:00
    label: "GMT-11:00",
    zones: ["American Samoa", "Niue"],
  },
  {
    value: "Pacific/Honolulu", // GMT-10:00 (Hawaii)
    label: "GMT-10:00",
    zones: ["Hawaii", "Cook Islands"],
  },
  {
    value: "Pacific/Marquesas", // GMT-09:30 (Marquesas Islands use a -09:30 offset)
    label: "GMT-09:30",
    zones: ["Marquesas Islands"],
  },
  {
    value: "America/Anchorage", // GMT-09:00 (Alaska)
    label: "GMT-09:00",
    zones: ["Alaska", "French Polynesia"],
  },
  {
    value: "America/Los_Angeles", // GMT-08:00
    label: "GMT-08:00",
    zones: ["Los Angeles", "Vancouver"],
  },
  {
    value: "America/Denver", // GMT-07:00
    label: "GMT-07:00",
    zones: ["Denver", "Phoenix"],
  },
  {
    value: "America/Chicago", // GMT-06:00
    label: "GMT-06:00",
    zones: ["Chicago", "Mexico City"],
  },
  {
    value: "America/New_York", // GMT-05:00
    label: "GMT-05:00",
    zones: ["New York", "Toronto"],
  },
  {
    value: "America/Halifax", // GMT-04:00
    label: "GMT-04:00",
    zones: ["Halifax", "Santiago"],
  },
  {
    value: "America/St_Johns", // GMT-03:30
    label: "GMT-03:30",
    zones: ["St. John's", "Newfoundland"],
  },
  {
    value: "America/Sao_Paulo", // GMT-03:00
    label: "GMT-03:00",
    zones: ["São Paulo", "Buenos Aires"],
  },
  {
    value: "Etc/GMT+2", // GMT-02:00
    label: "GMT-02:00",
    zones: ["Fernando de Noronha", "South Georgia"],
  },
  {
    value: "Etc/GMT+1", // GMT-01:00
    label: "GMT-01:00",
    zones: ["Cape Verde", "Azores"],
  },
  {
    value: "Etc/GMT-0", // GMT+00:00
    label: "GMT+00:00",
    zones: ["London", "Dublin"],
  },
  {
    value: "Europe/Paris", // GMT+01:00 (or "Europe/Berlin")
    label: "GMT+01:00",
    zones: ["Paris", "Berlin"],
  },
  {
    value: "Europe/Athens", // GMT+02:00
    label: "GMT+02:00",
    zones: ["Cairo", "Jerusalem"],
  },
  {
    value: "Europe/Moscow", // GMT+03:00 (or Istanbul)
    label: "GMT+03:00",
    zones: ["Moscow", "Istanbul"],
  },
  {
    value: "Asia/Tehran", // GMT+03:30
    label: "GMT+03:30",
    zones: ["Tehran", "Iran"],
  },
  {
    value: "Asia/Dubai", // GMT+04:00
    label: "GMT+04:00",
    zones: ["Dubai", "Baku"],
  },
  {
    value: "Asia/Kabul", // GMT+04:30
    label: "GMT+04:30",
    zones: ["Kabul", "Afghanistan"],
  },
  {
    value: "Asia/Tashkent", // GMT+05:00
    label: "GMT+05:00",
    zones: ["Tashkent", "Maldives"],
  },
  {
    value: "Asia/Kolkata", // GMT+05:30
    label: "GMT+05:30",
    zones: ["Mumbai", "New Delhi"],
  },
  {
    value: "Asia/Kathmandu", // GMT+05:45
    label: "GMT+05:45",
    zones: ["Kathmandu", "Nepal"],
  },
  {
    value: "Asia/Dhaka", // GMT+06:00
    label: "GMT+06:00",
    zones: ["Dhaka", "Almaty"],
  },
  {
    value: "Asia/Yangon", // GMT+06:30
    label: "GMT+06:30",
    zones: ["Yangon", "Cocos Islands"],
  },
  {
    value: "Asia/Bangkok", // GMT+07:00
    label: "GMT+07:00",
    zones: ["Bangkok", "Jakarta"],
  },
  {
    value: "Asia/Singapore", // GMT+08:00
    label: "GMT+08:00",
    zones: ["Singapore", "Beijing"],
  },
  {
    value: "Australia/Eucla", // GMT+08:45
    label: "GMT+08:45",
    zones: ["Eucla", "Western Australia"],
  },
  {
    value: "Asia/Tokyo", // GMT+09:00
    label: "GMT+09:00",
    zones: ["Tokyo", "Seoul"],
  },
  {
    value: "Australia/Adelaide", // GMT+09:30
    label: "GMT+09:30",
    zones: ["Adelaide", "Darwin"],
  },
  {
    value: "Australia/Sydney", // GMT+10:00
    label: "GMT+10:00",
    zones: ["Sydney", "Melbourne"],
  },
  {
    value: "Australia/Lord_Howe", // GMT+10:30
    label: "GMT+10:30",
    zones: ["Lord Howe Island"],
  },
  {
    value: "Pacific/Guadalcanal", // GMT+11:00
    label: "GMT+11:00",
    zones: ["Solomon Islands", "New Caledonia"],
  },
  {
    value: "Pacific/Auckland", // GMT+12:00
    label: "GMT+12:00",
    zones: ["Auckland", "Fiji"],
  },
  {
    value: "Pacific/Chatham", // GMT+12:45
    label: "GMT+12:45",
    zones: ["Chatham Islands"],
  },
  {
    value: "Pacific/Apia", // GMT+13:00
    label: "GMT+13:00",
    zones: ["Samoa", "Tonga"],
  },
  {
    value: "Pacific/Kiritimati", // GMT+14:00
    label: "GMT+14:00",
    zones: ["Line Islands", "Kiritimati"],
  },
];

export function timezonePresent(value: string) {
  for (const a of timezoneOptions) {
    if (a.value === value) {
      return true;
    }
  }
  return false;
}

export function getTimezoneOffset(timezone: string): number {
  const now = new Date();
  const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
    hour12: false,
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const parts = dateTimeFormatter.formatToParts(now);
  const numberMap: Record<string, string> = {};
  for (const { type, value } of parts) {
    if (
      type === "year" ||
      type === "month" ||
      type === "day" ||
      type === "hour" ||
      type === "minute" ||
      type === "second"
    ) {
      numberMap[type] = value;
    }
  }

  const targetDateStr = `${numberMap.year}-${numberMap.month}-${numberMap.day}T${numberMap.hour}:${numberMap.minute}:${numberMap.second}`;
  const targetDate = new Date(targetDateStr);

  const diffInMinutes = (targetDate.getTime() - now.getTime()) / (1000 * 60);
  return Math.round((diffInMinutes / 60) * 100) / 100;
}
