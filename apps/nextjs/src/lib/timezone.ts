export const timezoneOptions: Record<
  string,
  {
    label: string;
    zones: string[];
  }
> = {
  "Etc/GMT+12": {
    label: "GMT-12:00",
    zones: ["Baker Island", "Howland Island"],
  },

  "Etc/GMT+11": {
    label: "GMT-11:00",
    zones: ["American Samoa", "Niue"],
  },
  "Pacific/Honolulu": {
    label: "GMT-10:00",
    zones: ["Hawaii", "Cook Islands"],
  },
  "Pacific/Marquesas": {
    label: "GMT-09:30",
    zones: ["Marquesas Islands"],
  },
  "America/Anchorage": {
    label: "GMT-09:00",
    zones: ["Alaska", "French Polynesia"],
  },
  "America/Los_Angeles": {
    label: "GMT-08:00",
    zones: ["Los Angeles", "Vancouver"],
  },
  "America/Denver": {
    label: "GMT-07:00",
    zones: ["Denver", "Phoenix"],
  },
  "America/Chicago": {
    label: "GMT-06:00",
    zones: ["Chicago", "Mexico City"],
  },
  "America/New_York": {
    label: "GMT-05:00",
    zones: ["New York", "Toronto"],
  },
  "America/Halifax": {
    label: "GMT-04:00",
    zones: ["Halifax", "Santiago"],
  },
  "America/St_Johns": {
    label: "GMT-03:30",
    zones: ["St. John's", "Newfoundland"],
  },
  "America/Sao_Paulo": {
    label: "GMT-03:00",
    zones: ["São Paulo", "Buenos Aires"],
  },
  "Etc/GMT+2": {
    label: "GMT-02:00",
    zones: ["Fernando de Noronha", "South Georgia"],
  },
  "Etc/GMT+1": {
    label: "GMT-01:00",
    zones: ["Cape Verde", "Azores"],
  },
  "Etc/GMT-0": {
    label: "GMT+00:00",
    zones: ["London", "Dublin"],
  },
  "Europe/Paris": {
    label: "GMT+01:00",
    zones: ["Paris", "Berlin"],
  },
  "Europe/Athens": {
    label: "GMT+02:00",
    zones: ["Cairo", "Jerusalem"],
  },
  "Europe/Moscow": {
    label: "GMT+03:00",
    zones: ["Moscow", "Istanbul"],
  },
  "Asia/Tehran": {
    label: "GMT+03:30",
    zones: ["Tehran", "Iran"],
  },
  "Asia/Dubai": {
    label: "GMT+04:00",
    zones: ["Dubai", "Baku"],
  },
  "Asia/Kabul": {
    label: "GMT+04:30",
    zones: ["Kabul", "Afghanistan"],
  },
  "Asia/Tashkent": {
    label: "GMT+05:00",
    zones: ["Tashkent", "Maldives"],
  },
  "Asia/Kolkata": {
    label: "GMT+05:30",
    zones: ["Mumbai", "New Delhi"],
  },
  "Asia/Kathmandu": {
    label: "GMT+05:45",
    zones: ["Kathmandu", "Nepal"],
  },
  "Asia/Dhaka": {
    label: "GMT+06:00",
    zones: ["Dhaka", "Almaty"],
  },
  "Asia/Yangon": {
    label: "GMT+06:30",
    zones: ["Yangon", "Cocos Islands"],
  },
  "Asia/Bangkok": {
    label: "GMT+07:00",
    zones: ["Bangkok", "Jakarta"],
  },
  "Asia/Singapore": {
    label: "GMT+08:00",
    zones: ["Singapore", "Beijing"],
  },
  "Australia/Eucla": {
    label: "GMT+08:45",
    zones: ["Eucla", "Western Australia"],
  },
  "Asia/Tokyo": {
    label: "GMT+09:00",
    zones: ["Tokyo", "Seoul"],
  },
  "Australia/Adelaide": {
    label: "GMT+09:30",
    zones: ["Adelaide", "Darwin"],
  },
  "Australia/Sydney": {
    label: "GMT+10:00",
    zones: ["Sydney", "Melbourne"],
  },
  "Australia/Lord_Howe": {
    label: "GMT+10:30",
    zones: ["Lord Howe Island"],
  },
  "Pacific/Guadalcanal": {
    label: "GMT+11:00",
    zones: ["Solomon Islands", "New Caledonia"],
  },
  "Pacific/Auckland": {
    label: "GMT+12:00",
    zones: ["Auckland", "Fiji"],
  },
  "Pacific/Chatham": {
    label: "GMT+12:45",
    zones: ["Chatham Islands"],
  },
  "Pacific/Apia": {
    label: "GMT+13:00",
    zones: ["Samoa", "Tonga"],
  },
  "Pacific/Kiritimati": {
    label: "GMT+14:00",
    zones: ["Line Islands", "Kiritimati"],
  },
};

export function timezonePresent(value: string) {
  if (timezoneOptions[value]) {
    return true;
  } else {
    return false;
  }
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

// TODO: Consider daylight saving days and write this in a better format
export function convertToUTC(offset: number, timezone: string) {
  const tz = timezoneOptions[timezone];
  if (!tz) {
    return offset;
  }

  const sign = tz.label.slice(3).charAt(0);

  const timestamp = tz.label.slice(4).split(":");
  const hours = Number.parseInt(timestamp[0], 10);
  const mins = Number.parseInt(timestamp[1], 10);
  const totalOffset = 3600 * hours + 60 * mins;

  let managedOffset: number;

  if (sign === "+") {
    // then we have to subtract that many hours
    managedOffset = offset - totalOffset;
  } else {
    //add that many hours
    managedOffset = offset + totalOffset;
  }

  // Normalize to a value between 0 and 86399 seconds
  managedOffset = (managedOffset + 86400) % 86400;
  return managedOffset;
}

export function convertToLocal(offset: number, timezone: string) {
  const tz = timezoneOptions[timezone];
  if (!tz) {
    return offset;
  }

  const sign = tz.label.slice(3).charAt(0);

  const timestamp = tz.label.slice(4).split(":");
  const hours = Number.parseInt(timestamp[0], 10);
  const mins = Number.parseInt(timestamp[1], 10);
  const totalOffset = 3600 * hours + 60 * mins;

  let managedOffset: number;

  if (sign === "-") {
    // then we have to subtract that many hours
    managedOffset = offset - totalOffset;
  } else {
    //add that many hours
    managedOffset = offset + totalOffset;
  }

  // Normalize to a value between 0 and 86399 seconds
  managedOffset = (managedOffset + 86400) % 86400;
  return managedOffset;
}
