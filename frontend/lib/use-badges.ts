import useSWRImmutable from "swr/immutable";
import { client } from "lib/client";
import { BadgeDetail2 } from "api/@types";

const key = "badges";

async function fetcher(
  _: typeof key,
  type: "wisdom" | "knowledge",
  badgesIds: number[]
) {
  return client.badges.$get({
    query: { badges_type: type, badges_ids: badgesIds.join(",") },
  });
}

export default function useBadges(
  type: "wisdom" | "knowledge",
  badgesIds: number[]
) {
  return useSWRImmutable<BadgeDetail2[]>(
    badgesIds.length > 0 ? [key, type, badgesIds] : null,
    fetcher
  );
}
