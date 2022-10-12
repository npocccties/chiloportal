import { client } from "lib/client";
import { BadgeDetail2 } from "api/@types";
import Template from "templates/Search";

export type Query = { q?: string; p?: string };

export type Context = {
  query: Query;
};

export type Props = {
  keyword: string;
  wisdomBadgesList: { badges: BadgeDetail2[]; total_count: number };
};

export async function getServerSideProps({
  query: { q = "", p },
}: Context): Promise<{ props: Props }> {
  const wisdomBadgesList = await client.wisdomBadges.list.keyword.$get({
    query: { keyword: q, page_number: Number(p) },
  });
  return {
    props: { keyword: q, wisdomBadgesList },
  };
}

export default Template;
