import useSWRImmutable from "swr/immutable";
import { client } from "lib/client";
import { PortalCategory } from "api/@types";

const key = "portalCategory/list" as const;

type Key = typeof key;

async function fetcher(_: Key): Promise<PortalCategory[]> {
  return client.portalCategory.list.$get();
}

export default function usePortalCategories() {
  return useSWRImmutable(key, fetcher);
}
