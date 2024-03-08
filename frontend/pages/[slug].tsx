import { GetStaticPropsResult, GetStaticPathsResult } from "next";
import Error from "next/error";
import Head from "next/head";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import Template from "templates/Content";
import { readMarkdowns, Markdown } from "lib/markdown";
import { Page as MdPage, Menu } from "schemas";
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
  matter: Markdown<MdPage | Menu>["data"]["matter"];
};

export async function getStaticProps({
  params: { slug },
}: Context): Promise<GetStaticPropsResult<ErrorProps | Props>> {
  const [pages, menus] = await Promise.all([
    readMarkdowns({ type: "page", sort: false }),
    readMarkdowns({ type: "menu", sort: false }),
  ]);
  if (pages instanceof globalThis.Error)
    return { props: { title: pages.message, statusCode: 500 } };
  if (menus instanceof globalThis.Error)
    return { props: { title: menus.message, statusCode: 500 } };
  const markdown = [...pages, ...menus].find(
    (markdown) => markdown.data.matter.slug === slug,
  );
  if (!markdown)
    return { props: { title: "Content Not Found", statusCode: 404 } };
  const source = await serialize(markdown.value.toString(), {
    mdxOptions: {
      // @ts-expect-error Pluggable型がJSDocとTSで不一致
      // See https://github.com/orgs/rehypejs/discussions/63
      rehypePlugins: [rehypeImageSize],
      remarkPlugins: [remarkGfm],
      format: "md",
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
  const [pages, menus] = await Promise.all([
    readMarkdowns({ type: "page", sort: false }),
    readMarkdowns({ type: "menu", sort: false }),
  ]);
  if (pages instanceof globalThis.Error) return { paths: [], fallback: false };
  if (menus instanceof globalThis.Error) return { paths: [], fallback: false };
  const paths = [...pages, ...menus].map((markdown) => ({
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
      </Head>
      <Template {...props} />
    </>
  );
}
