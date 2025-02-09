export function secondToDate(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  // We use January 1, 1970 as the arbitrary date.
  const date = new Date(1970, 0, 1, hours, minutes, secs);
  return date;
}

export function dateToSeconds(date: Date): number {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return hours * 3600 + minutes * 60 + seconds;
}
