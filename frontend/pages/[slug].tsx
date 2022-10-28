import { GetStaticPropsResult, GetStaticPathsResult } from "next";
import Error from "next/error";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import Template from "templates/Content";
import { readMarkdowns, Markdown } from "lib/markdown";
import rehypeImageSize from "lib/rehype-image-size";

type Context = {
  params: { slug: string };
};

type ErrorProps = {
  title: string;
  statusCode: number;
};

export type Props = {
  source: MDXRemoteSerializeResult;
  matter: Markdown["data"]["matter"];
};

export async function getStaticProps({
  params: { slug },
}: Context): Promise<GetStaticPropsResult<ErrorProps | Props>> {
  const markdowns = await readMarkdowns("contents");
  if (markdowns instanceof globalThis.Error)
    return { props: { title: markdowns.message, statusCode: 500 } };
  const markdown = markdowns.find(
    (markdown) => markdown.data.matter.slug === slug
  );
  if (!markdown)
    return { props: { title: "Content Not Found", statusCode: 404 } };
  const source = await serialize(markdown.value.toString(), {
    mdxOptions: {
      rehypePlugins: [rehypeImageSize],
      remarkPlugins: [remarkGfm],
    },
  });
  return {
    props: {
      source,
      matter: markdown.data.matter,
    },
  };
}

export async function getStaticPaths(): Promise<
  GetStaticPathsResult<Context["params"]>
> {
  const markdowns = await readMarkdowns("contents");
  const paths =
    "map" in markdowns
      ? markdowns.map(
          ({
            data: {
              matter: { slug },
            },
          }) => ({
            params: { slug },
          })
        )
      : [];
  return { paths, fallback: false };
}

export default function Page(props: ErrorProps | Props) {
  if ("statusCode" in props) return <Error {...props} />;
  return <Template {...props} />;
}
