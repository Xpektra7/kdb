const DATA_MODE_COOKIE = "useDummyData";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function readCookie(): string | undefined {
  if (typeof document === "undefined") return undefined;
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${DATA_MODE_COOKIE}=`))
    ?.split("=")[1];
}

export function getDataMode(): boolean {
  return readCookie() === "true";
}

export function setDataMode(useDummy: boolean): void {
  if (typeof document === "undefined") return;
  document.cookie = `${DATA_MODE_COOKIE}=${useDummy}; path=/; max-age=${MAX_AGE}`;
}

export function toggleDataMode(): boolean {
  const next = !getDataMode();
  setDataMode(next);
  return next;
}