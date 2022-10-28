import { GetStaticPropsResult } from "next";
import Error from "next/error";
import Template from "templates/Posts";
import { readMarkdowns, Markdown } from "lib/markdown";

type ErrorProps = {
  title: string;
  statusCode: number;
};

export type Props = {
  posts: Markdown["data"]["matter"][];
};

export async function getStaticProps(): Promise<
  GetStaticPropsResult<ErrorProps | Props>
> {
  const markdowns = await readMarkdowns("posts", true);
  if (markdowns instanceof globalThis.Error)
    return { props: { title: markdowns.message, statusCode: 500 } };
  const matters = markdowns.map((markdown) => markdown.data.matter);
  return {
    props: { posts: matters },
  };
}

export default function Page(props: ErrorProps | Props) {
  if ("statusCode" in props) return <Error {...props} />;
  return <Template {...props} />;
}
