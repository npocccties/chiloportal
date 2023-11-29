import { GetStaticPropsResult } from "next";
import Error from "next/error";
import Head from "next/head";
import Template from "templates/Top";
import { readMarkdowns, Markdown } from "lib/markdown";
import { readConfigs } from "lib/config";
import { Post, Config } from "schemas";
import title from "lib/title";

type ErrorProps = {
  title: string;
  statusCode: number;
};

export type Props = {
  posts: Markdown<Post>["data"]["matter"][];
  recommendedWisdomBadgesIds: NonNullable<Config["recommendedWisdomBadgesIds"]>;
  learningContents: NonNullable<Config["learningContents"]>;
};

export async function getStaticProps(): Promise<
  GetStaticPropsResult<ErrorProps | Props>
> {
  const markdowns = await readMarkdowns({ type: "post", sort: true });
  if (markdowns instanceof globalThis.Error)
    return { props: { title: markdowns.message, statusCode: 500 } };
  const posts = markdowns.map((markdown) => markdown.data.matter);
  const configs = await readConfigs();
  if (configs instanceof globalThis.Error)
    return { props: { title: configs.message, statusCode: 500 } };
  if (configs.length === 0)
    return { props: { title: "Config Not Found", statusCode: 500 } };
  const { recommendedWisdomBadgesIds = [], learningContents = [] } = configs[0];
  return {
    props: {
      posts,
      recommendedWisdomBadgesIds,
      learningContents,
    },
  };
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
