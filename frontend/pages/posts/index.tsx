import matter from "gray-matter";
import { GetStaticPropsResult } from "next";
import Template from "templates/Posts";
import { readPosts } from "lib/post";

export type Props = {
  posts: { title: string; slug: string }[];
};

export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
  const posts = await readPosts();
  const frontmatters = posts.map(
    (post) => matter(post).data as Props["posts"][number]
  );
  return {
    props: { posts: frontmatters },
  };
}

export default Template;
