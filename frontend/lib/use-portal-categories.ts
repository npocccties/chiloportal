import useSWRImmutable from "swr/immutable";
import { client } from "lib/client";
import { PortalCategory } from "api/@types";

const key = "portal_category/list" as const;

async function fetcher(_: typeof key) {
  const { body } = await client.portalCategory.list.get();
  return body;
}

export default function useConsumers() {
  return useSWRImmutable<PortalCategory[]>(key, fetcher);
}
