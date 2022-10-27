import useSWRImmutable from "swr/immutable";
import { client } from "lib/client";
import { Consumer } from "api/@types";

const key = "wisdom-badges/consumer/list" as const;

async function fetcher(_: typeof key, badgesId: number) {
  return client.wisdomBadges.consumer.list.$get({
    query: { badges_id: badgesId },
  });
}

export default function useWisdomBadgesConsumers(
  badgesId: number,
  shouldFetch: boolean = true
) {
  return useSWRImmutable<Consumer[]>(
    shouldFetch ? [key, badgesId] : null,
    fetcher
  );
}
