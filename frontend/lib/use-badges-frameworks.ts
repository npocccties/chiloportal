import useSWRImmutable from "swr/immutable";
import { client } from "lib/client";
import { Consumer, Framework } from "api/@types";

const key = "badges/consumer/list/consumer/framework/list" as const;

async function fetcher(
  _: typeof key,
  badgesId: number
): Promise<{ consumers: Consumer[]; frameworksPerConsumers: Framework[][] }> {
  const consumers = await client.wisdomBadges.consumer.list.$get({
    query: { badges_id: badgesId },
  });
  const frameworksPerConsumers = await Promise.all(
    consumers.map((consumer) =>
      client.consumer.framework.list.$get({
        query: { consumer_id: consumer.consumer_id },
      })
    )
  );
  return { consumers, frameworksPerConsumers };
}

export default function useBadgesFrameworks(
  badgesId: number,
  shouldFetch: boolean = true
) {
  return useSWRImmutable(shouldFetch ? [key, badgesId] : null, fetcher);
}
