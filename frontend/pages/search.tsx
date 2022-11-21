import { GetServerSidePropsResult } from "next";
import Error from "next/error";
import Head from "next/head";
import { client, getErrorProps } from "lib/client";
import Template from "templates/Search";
import { pagesPath } from "lib/$path";
import title from "lib/title";

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
    if (q.trim().length === 0)
      return {
        redirect: { destination: pagesPath.$url().pathname, permanent: false },
      };
    const wisdomBadgesList = await client.wisdomBadges.list.keyword.$get({
      query: {
        keyword: q,
        page_number: Number.isInteger(pageNumber) ? pageNumber : undefined,
      },
    });

    return {
      props: { keyword: q, wisdomBadgesList },
    };
  } catch (e) {
    return { props: await getErrorProps(e) };
  }
}

export default function Page(props: ErrorProps | Props) {
  if ("statusCode" in props) return <Error {...props} />;
  return (
    <>
      <Head>
        <title>{title(`検索結果「${props.keyword}」`)}</title>
      </Head>
      <Template {...props} />
    </>
  );
}
