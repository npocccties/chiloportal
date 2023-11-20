import useSWRImmutable from "swr/immutable";
import { client } from "lib/client";
import { BadgeDetail2 } from "api/@types";

const key = "badges" as const;

type Key = {
  key: typeof key;
  type: "wisdom" | "knowledge";
  badgesIds: number[];
};

async function fetcher({
  key: _,
  type,
  badgesIds,
}: Key): Promise<BadgeDetail2[]> {
  return client.badges.$get({
    query: { badges_type: type, badges_ids: badgesIds.join(",") },
  });
}

export default function useBadges(
  type: Key["type"],
  badgesIds: Key["badgesIds"],
) {
  return useSWRImmutable(
    badgesIds.length > 0 ? { key, type, badgesIds } : null,
    fetcher,
  );
}
