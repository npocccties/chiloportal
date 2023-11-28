import useSWRImmutable from "swr/immutable";
import { client } from "lib/client";
import { Consumer } from "api/@types";

const key = "wisdomBadges/consumer/list" as const;

type Key = {
  key: typeof key;
  badgesId: number;
};

async function fetcher({ key: _, badgesId }: Key): Promise<Consumer[]> {
  return client.wisdomBadges.consumer.list.$get({
    query: { badges_id: badgesId },
  });
}

export default function useWisdomBadgesConsumers(
  badgesId: Key["badgesId"],
  shouldFetch: boolean = true,
) {
  return useSWRImmutable(shouldFetch ? { key, badgesId } : null, fetcher);
}
