import { GetStaticPropsResult } from "next";
import Error from "next/error";
import { BadgeDetail2 } from "api/@types";
import Template from "templates/Top";
import { readMarkdowns, Markdown } from "lib/markdown";
import { readConfig } from "lib/config";

type ErrorProps = {
  title: string;
  statusCode: number;
};

export type Props = {
  posts: Markdown["data"]["matter"][];
  recommendedWisdomBadgesIds: BadgeDetail2["badges_id"][];
  learningContents: { name: string; url: string }[];
};

export async function getStaticProps(): Promise<
  GetStaticPropsResult<ErrorProps | Props>
> {
  const markdowns = await readMarkdowns("posts", true);
  if (markdowns instanceof globalThis.Error)
    return { props: { title: markdowns.message, statusCode: 500 } };
  const posts = markdowns.map((markdown) => markdown.data.matter);
  const config = await readConfig();
  if (config instanceof globalThis.Error)
    return { props: { title: config.message, statusCode: 500 } };
  const { recommendedWisdomBadgesIds = [], learningContents = [] } = config;
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
  return <Template {...props} />;
}
