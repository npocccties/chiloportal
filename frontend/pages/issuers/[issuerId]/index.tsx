import { GetStaticPropsResult, GetStaticPathsResult } from "next";
import Error from "next/error";
import Head from "next/head";
import { client } from "lib/node-client";
import Template from "templates/Issuer";
import { readMarkdowns, Markdown } from "lib/markdown";
import { readConfigs } from "lib/config";
import { Post, Config } from "schemas";
import { NEXT_PUBLIC_API_MOCKING } from "lib/env";
import title from "lib/title";
import getStaticIssuerIds from "lib/get-static-issuer-ids";

export type Context = {
  params: { issuerId: string };
};

type ErrorProps = {
  title: string;
  statusCode: number;
};

export type Props = {
  posts: Markdown<Post>["data"]["matter"][];
  recommendedWisdomBadgesIds: NonNullable<Config["recommendedWisdomBadgesIds"]>;
  learningContents: NonNullable<Config["learningContents"]>;
};

export async function getStaticProps({
  params: { issuerId },
}: Context): Promise<GetStaticPropsResult<ErrorProps | Props>> {
  const markdowns = await readMarkdowns({
    type: "post",
    sort: true,
    issuerId: Number(issuerId),
  });
  if (markdowns instanceof globalThis.Error)
    return { props: { title: markdowns.message, statusCode: 500 } };
  const posts = markdowns.map((markdown) => markdown.data.matter);
  const configs = await readConfigs({ issuerId: Number(issuerId) });
  if (configs instanceof globalThis.Error)
    return { props: { title: configs.message, statusCode: 500 } };
  if (configs.length === 0)
    return { props: { title: "Issuer Not Found", statusCode: 404 } };
  const { recommendedWisdomBadgesIds = [], learningContents = [] } = configs[0];
  return {
    props: {
      posts,
      recommendedWisdomBadgesIds,
      learningContents,
    },
  };
}

export async function getStaticPaths(): Promise<
  GetStaticPathsResult<Context["params"]>
> {
  if (NEXT_PUBLIC_API_MOCKING) {
    const issuerIds = await getStaticIssuerIds();
    const paths = issuerIds.map((issuerId) => ({
      params: { issuerId: String(issuerId) },
    }));
    return { paths, fallback: false };
  }
  const issuers = await client.issuer.list.$get().catch(() => []);
  const paths = issuers.map((issuer) => ({
    params: { issuerId: String(issuer.issuer_id) },
  }));
  return { paths, fallback: false };
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
