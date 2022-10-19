import { client } from "lib/client";
import Template from "templates/Search";

export type Query = { q?: string; p?: string };

export type Context = {
  query: Query;
};

export type Props = {
  keyword: string;
  wisdomBadgesList: Awaited<
    ReturnType<typeof client.portalCategory.badges.list.$get>
  >;
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
