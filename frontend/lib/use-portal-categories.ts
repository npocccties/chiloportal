import useSWRImmutable from "swr/immutable";
import { client } from "lib/client";
import { PortalCategory } from "api/@types";

const key = "portal_category/list" as const;

async function fetcher(_: typeof key) {
  return client.portalCategory.list.$get();
}

export default function usePortalCategories() {
  return useSWRImmutable<PortalCategory[]>(key, fetcher);
}
