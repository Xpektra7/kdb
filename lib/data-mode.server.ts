'use server';
import { cookies } from "next/headers";
const DATA_MODE_COOKIE = "useDummyData";

export async function getDataModeServer(): Promise<boolean> {
  return (await cookies()).get(DATA_MODE_COOKIE)?.value === "true";
}