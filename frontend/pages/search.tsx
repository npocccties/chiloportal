import { GetServerSidePropsResult } from "next";
import Error from "next/error";
import { client, getErrorProps } from "lib/client";
import Template from "templates/Search";

export type Query = { q?: string; p?: string };

export type Context = {
  query: Query;
};

type ErrorProps = {
  title: string;
  statusCode: number;
};

export type Props = {
  keyword: string;
  wisdomBadgesList: Awaited<
    ReturnType<typeof client.wisdomBadges.list.keyword.$get>
  >;
};

export async function getServerSideProps({
  query: { q = "", p },
}: Context): Promise<GetServerSidePropsResult<ErrorProps | Props>> {
  try {
    const pageNumber = Number(p);
    const wisdomBadgesList =
      q.length > 0
        ? await client.wisdomBadges.list.keyword.$get({
            query: {
              keyword: q,
              page_number: Number.isInteger(pageNumber)
                ? pageNumber
                : undefined,
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
  } catch (e) {
    return { props: await getErrorProps(e) };
  }
}

export default function Page(props: ErrorProps | Props) {
  if ("statusCode" in props) return <Error {...props} />;
  return <Template {...props} />;
}
