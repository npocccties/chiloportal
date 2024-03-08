import { GetServerSidePropsResult } from "next";
import Error from "next/error";
import Head from "next/head";
import { client, getErrorProps } from "lib/client";
import Template from "templates/Search";
import title from "lib/title";
import parsePageQuery from "lib/parse-page-query";

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
  > | null;
};

export async function getServerSideProps({
  query: { q = "", p },
}: Context): Promise<GetServerSidePropsResult<ErrorProps | Props>> {
  try {
    const pageNumber = parsePageQuery(p);
    const wisdomBadgesList = q
      ? await client.wisdomBadges.list.keyword.$get({
          query: {
            keyword: q,
            page_number: pageNumber,
          },
        })
      : null;

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
        <title>
          {title(...[props.keyword || [], "キーワード検索"].flat())}
        </title>
        <meta
          property="og:title"
          content={title(...[props.keyword || [], "キーワード検索"].flat())}
        />
      </Head>
      <Template {...props} />
    </>
  );
}
