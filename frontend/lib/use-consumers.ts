import useSWRImmutable from "swr/immutable";
import { client } from "lib/client";
import { Consumer } from "api/@types";

const key = "consumer/list" as const;

type Key = typeof key;

async function fetcher(_: Key): Promise<Consumer[]> {
  return client.consumer.list.$get();
}

export default function useConsumers() {
  return useSWRImmutable(key, fetcher);
}
