import { GetStaticPropsResult } from "next";
import Error from "next/error";
import Head from "next/head";
import Template from "templates/Top";
import title from "lib/title";
import { client } from "lib/client";
import { Issuer } from "api/@types";

type ErrorProps = {
  title: string;
  statusCode: number;
};

export type Props = {
  issuers: Issuer[];
};

export async function getStaticProps(): Promise<
  GetStaticPropsResult<ErrorProps | Props>
> {
  const issuers = await client.issuer.list.$get().catch(() => []);
  return { props: { issuers } };
}

export default function Page(props: ErrorProps | Props) {
  if ("statusCode" in props) return <Error {...props} />;
  return (
    <>
      <Head>
        <title>{title()}</title>
      </Head>
      <Template {...props} />
    </>
  );
}
