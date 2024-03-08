import useSWRImmutable from "swr/immutable";
import { client } from "lib/client";
import { Issuer } from "api/@types";

const key = "issuer/list" as const;

type Key = {
  key: typeof key;
};

async function fetcher({ key: _ }: Key): Promise<Issuer[]> {
  return client.issuer.list.$get();
}

export default function useIssuers(shouldFetch: boolean = true) {
  return useSWRImmutable(shouldFetch ? { key } : null, fetcher);
}
