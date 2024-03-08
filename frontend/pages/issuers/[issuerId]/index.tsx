import { GetStaticPropsResult, GetStaticPathsResult } from "next";
import Error from "next/error";
import Head from "next/head";
import { client } from "lib/client";
import Template from "templates/Issuer";
import { readMarkdowns, Markdown } from "lib/markdown";
import { readConfigs } from "lib/config";
import { Post, Config } from "schemas";
import { NEXT_PUBLIC_API_MOCKING } from "lib/env";
import title from "lib/title";
import { PortalCategory, Issuer } from "api/@types";
import getStaticIssuerIds from "lib/get-static-issuer-ids";

export type Context = {
  params: { issuerId: string };
};

type ErrorProps = {
  title: string;
  statusCode: number;
};

export type Props = {
  portalCategories: PortalCategory[];
  issuerBadgesCount: number;
  portalCategoryBadgesCounts: number[];
  issuer: Issuer;
  posts: Markdown<Post>["data"]["matter"][];
  backgroundImage: string | null;
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
  const portalCategories = await client.portalCategory.list
    .$get()
    .catch(() => []);
  const issuerBadgesCount = await client.badges.list
    .$get({
      query: {
        issuer_id: Number(issuerId),
      },
    })
    .then(({ total_count }) => total_count)
    .catch(() => 0);
  const portalCategoryBadgesCounts = await Promise.all(
    portalCategories.map((portalCategory) =>
      client.badges.list
        .$get({
          query: { portal_category_id: portalCategory.portal_category_id },
        })
        .then(({ total_count }) => total_count)
        .catch(() => 0),
    ),
  );
  const {
    backgroundImage = null,
    recommendedWisdomBadgesIds = [],
    learningContents = [],
  } = configs[0];
  const issuers = await client.issuer.list.$get().catch(() => []);
  let issuer: Issuer | undefined;
  if (NEXT_PUBLIC_API_MOCKING) {
    if (!issuers[0])
      return { props: { title: "Issuer Not Found", statusCode: 404 } };
    issuer = {
      ...issuers[0],
      issuer_id: Number(issuerId),
    } satisfies Issuer;
  } else {
    issuer = issuers.find((issuer) => issuer.issuer_id === Number(issuerId));
    if (!issuer)
      return { props: { title: "Issuer Not Found", statusCode: 404 } };
  }
  return {
    props: {
      issuerBadgesCount,
      portalCategoryBadgesCounts,
      portalCategories,
      issuer,
      posts,
      backgroundImage,
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
        <title>{title(props.issuer.name)}</title>
        <meta property="og:title" content={title(props.issuer.name)} />
      </Head>
      <Template {...props} />
    </>
  );
}
