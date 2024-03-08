import { GetStaticPropsResult } from "next";
import Error from "next/error";
import Head from "next/head";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import Template from "templates/Top";
import title from "lib/title";
import { readMarkdowns } from "lib/markdown";
import rehypeImageSize from "lib/rehype-image-size";

type ErrorProps = {
  title: string;
  statusCode: number;
};

export type Props = {
  source: MDXRemoteSerializeResult | null;
};

export async function getStaticProps(): Promise<
  GetStaticPropsResult<ErrorProps | Props>
> {
  const customs = await readMarkdowns({ type: "custom", sort: false });
  if (customs instanceof globalThis.Error) {
    return { props: { title: customs.message, statusCode: 500 } };
  }
  const [custom] = customs;
  if (!custom) {
    return { props: { source: null } };
  }
  const source = await serialize(custom.value.toString(), {
    mdxOptions: {
      // @ts-expect-error Pluggable型がJSDocとTSで不一致
      // See https://github.com/orgs/rehypejs/discussions/63
      rehypePlugins: [rehypeImageSize],
      remarkPlugins: [remarkGfm],
    },
  });
  return { props: { source } };
}

export default function Page(props: ErrorProps | Props) {
  if ("statusCode" in props) return <Error {...props} />;
  return (
    <>
      <Head>
        <title>{title()}</title>
        <meta property="og:title" content={title()} />
      </Head>
      <Template {...props} />
    </>
  );
}
