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
  const pageNumber = Number(p);
  const wisdomBadgesList =
    q.length > 0
      ? await client.wisdomBadges.list.keyword.$get({
          query: {
            keyword: q,
            page_number: Number.isInteger(pageNumber) ? pageNumber : undefined,
          },
        })
      : {
          badges: [],
          total_count: 0,
          start: 0,
          end: 0,
        };
  return {
    props: { keyword: q, wisdomBadgesList },
  };
}

export default Template;
