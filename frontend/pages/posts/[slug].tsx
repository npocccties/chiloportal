import { GetStaticPropsResult, GetStaticPathsResult } from "next";
import Error from "next/error";
import Head from "next/head";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import Template from "templates/Post";
import { readMarkdowns, Markdown } from "lib/markdown";
import rehypeImageSize from "lib/rehype-image-size";
import title from "lib/title";

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
  const markdowns = await readMarkdowns("posts");
  if (markdowns instanceof globalThis.Error)
    return { props: { title: markdowns.message, statusCode: 500 } };
  const markdown = markdowns.find(
    (markdown) => markdown.data.matter.slug === slug
  );
  if (!markdown) return { props: { title: "Post Not Found", statusCode: 404 } };
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
  const markdowns = await readMarkdowns("posts");
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
  return (
    <>
      <Head>
        <title>{title(props.matter.title)}</title>
      </Head>
      <Template {...props} />
    </>
  );
}
