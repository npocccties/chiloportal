import { GetServerSidePropsResult } from "next";
import Error from "next/error";
import Head from "next/head";
import Template from "templates/Discover";
import title from "lib/title";

type ErrorProps = {
  title: string;
  statusCode: number;
};

export type Props = object;

export async function getServerSideProps(): Promise<
  GetServerSidePropsResult<ErrorProps | Props>
> {
  return { props: {} };
}

export default function Page(props: ErrorProps | Props) {
  if ("statusCode" in props) return <Error {...props} />;
  return (
    <>
      <Head>
        <title>{title("バッジを探す")}</title>
      </Head>
      <Template {...props} />
    </>
  );
}
