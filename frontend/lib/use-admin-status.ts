import useSWRImmutable from "swr/immutable";
import { NEXT_PUBLIC_API_BASE_URL } from "lib/env";

const key = "admin/status" as const;

/** 管理画面の URL（API と同じホストの /admin/） */
export const adminUrl = (): string =>
  new URL("/admin/", NEXT_PUBLIC_API_BASE_URL || window.location.origin).href;

async function fetcher(): Promise<boolean> {
  // session_cookie（学認）を送り、管理ユーザーかどうかをバックエンドに確かめる
  const url = new URL(
    "admin/status/",
    NEXT_PUBLIC_API_BASE_URL.replace(/\/?$/, "/"),
  );
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) return false;
  const { is_admin: isAdmin } = (await res.json()) as { is_admin: boolean };
  return isAdmin === true;
}

/** ログイン中の人が管理ユーザーかどうか。ログインしていなければ問い合わせない */
export default function useAdminStatus(loggedIn: boolean) {
  return useSWRImmutable(loggedIn ? key : null, fetcher, {
    shouldRetryOnError: false,
  });
}
