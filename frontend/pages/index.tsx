import { readFile } from "node:fs/promises";
import YAML from "yaml";
import matter from "gray-matter";
import { GetStaticPropsResult } from "next";
import { BadgeDetail1 } from "api/@types";
import Template from "templates/Top";
import { readPosts } from "lib/post";

export type Props = {
  posts: { title: string; slug: string }[];
  recommendedWisdomBadgesList: BadgeDetail1["badges_id"][];
  learningContents: { name: string; url: string }[];
};

export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
  const posts = await readPosts();
  const frontmatters = posts.map(
    (post) => matter(post).data as Props["posts"][number]
  );
  const config = await readFile("config.yaml", "utf8");
  const { recommendedWisdomBadgesList = [], learningContents = [] } =
    YAML.parse(config);
  return {
    props: {
      posts: frontmatters,
      recommendedWisdomBadgesList,
      learningContents,
    },
  };
}

export default Template;
