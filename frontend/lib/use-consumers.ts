import useSWRImmutable from "swr/immutable";
import { client } from "lib/client";
import { Consumer } from "api/@types";

const key = "consumer/list" as const;

async function fetcher(_: typeof key) {
  const { body } = await client.consumer.list.get();
  return body;
}

export default function useConsumers() {
  return useSWRImmutable<Consumer[]>(key, fetcher);
}
