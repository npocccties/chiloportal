import useSWRImmutable from "swr/immutable";
import { client } from "lib/client";
import { BadgeDetail2 } from "api/@types";

const key = "badges";

async function fetcher(
  _: typeof key,
  type: "wisdom" | "knowledge",
  ids: number[]
) {
  return client.badges.$get({
    query: { badges_type: type, badges_ids: ids.join(",") },
  });
}

export default function useBadges(type: "wisdom" | "knowledge", ids: number[]) {
  return useSWRImmutable<BadgeDetail2[]>([key, type, ids], fetcher);
}
