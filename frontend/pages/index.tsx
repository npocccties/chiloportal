import { readFile } from "node:fs/promises";
import YAML from "yaml";
import { GetStaticPropsResult } from "next";
import Error from "next/error";
import { BadgeDetail2 } from "api/@types";
import Template from "templates/Top";
import { readMarkdowns } from "lib/markdown";

type ErrorProps = {
  title: string;
  statusCode: number;
};

export type Props = {
  posts: { title: string; slug: string }[];
  recommendedWisdomBadgesIds: BadgeDetail2["badges_id"][];
  learningContents: { name: string; url: string }[];
};

export async function getStaticProps(): Promise<
  GetStaticPropsResult<ErrorProps | Props>
> {
  const markdowns = await readMarkdowns("posts", true);
  if (markdowns instanceof globalThis.Error)
    return { props: { title: markdowns.message, statusCode: 500 } };
  const posts = markdowns.map(({ title, slug }) => ({ title, slug }));
  const config = await readFile("config.yaml", "utf8");
  const { recommendedWisdomBadgesIds = [], learningContents = [] } =
    YAML.parse(config);
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
