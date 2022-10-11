import { client } from "lib/client";
import { BadgeDetail2 } from "api/@types";
import Template from "templates/Search";

export type Context = {
  query: { q: string; p: string };
};

export type Props = {
  keyword: string;
  wisdomBadgesList: { badges: BadgeDetail2[]; total_count: number };
};

export async function getServerSideProps({
  query: { q = "", p },
}: Context): Promise<{ props: Props }> {
  const { body: wisdomBadgesList } = await client.wisdomBadges.list.keyword.get(
    {
      query: { keyword: q, page_number: Number(p) },
    }
  );
  return {
    props: { keyword: q, wisdomBadgesList },
  };
}

export default Template;
