import useSWRImmutable from "swr/immutable";
import { client } from "lib/client";
import { Consumer } from "api/@types";

const key = "consumer/list" as const;

async function fetcher(_: typeof key) {
  return client.consumer.list.$get();
}

export default function useConsumers() {
  return useSWRImmutable<Consumer[]>(key, fetcher);
}
