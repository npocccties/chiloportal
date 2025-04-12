import { GetServerSidePropsResult } from "next";
import Error from "next/error";
import Head from "next/head";
import { getErrorProps } from "lib/client";
import Template from "templates/Dashboard";
import title from "lib/title";

export type Query = { tab?: "course" | "badge" };

export type Context = {
  query: Query;
};

type ErrorProps = {
  title: string;
  statusCode: number;
};

export type Props = {
  tab: "course" | "badge";
};

export async function getServerSideProps({
  query: { tab = "course" },
}: Context): Promise<GetServerSidePropsResult<ErrorProps | Props>> {
  try {
    return {
      props: { tab },
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
        <title>{title("ダッシュボード")}</title>
        <meta property="og:title" content={title("ダッシュボード")} />
      </Head>
      <Template {...props} />
    </>
  );
}
