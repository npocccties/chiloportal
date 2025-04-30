import { HttpError } from "http-errors-enhanced";
import { UserAttributes } from "pages/api/verify-cookie";
import useSWRImmutable from "swr/immutable";

const key = "verify-cookie" as const;

async function fetcher(): Promise<UserAttributes> {
  const userAttributes = await fetch("/api/verify-cookie")
    .then((res) => {
      if (!res.ok) throw new HttpError(res.status, res.statusText);
      return res;
    })
    .then((res) => res.json());
  return userAttributes;
}

export default function useUserAttributes() {
  return useSWRImmutable(key, fetcher);
}
