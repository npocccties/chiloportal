import { GetStaticPropsResult, GetStaticPathsResult } from "next";
import Error from "next/error";
import Head from "next/head";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import Template from "templates/Post";
import { readMarkdowns, Markdown } from "lib/markdown";
import { Post } from "schemas";
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
  matter: Markdown<Post>["data"]["matter"];
};

export async function getStaticProps({
  params: { slug },
}: Context): Promise<GetStaticPropsResult<ErrorProps | Props>> {
  const markdowns = await readMarkdowns({ type: "post", sort: false });

  if (markdowns instanceof globalThis.Error)
    return { props: { title: markdowns.message, statusCode: 500 } };
  const markdown = markdowns.find(
    (markdown) => markdown.data.matter.slug === slug,
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
  const markdowns = await readMarkdowns({ type: "post", sort: false });
  if (markdowns instanceof globalThis.Error)
    return { paths: [], fallback: false };
  const paths = markdowns.map((markdown) => ({
    params: { slug: markdown.data.matter.slug },
  }));
  return { paths, fallback: false };
}

export default function Page(props: ErrorProps | Props) {
  if ("statusCode" in props) return <Error {...props} />;
  return (
    <>
      <Head>
        <title>{title(props.matter.title)}</title>
        <meta property="og:title" content={title(props.matter.title)} />
      </Head>
      <Template {...props} />
    </>
  );
}
