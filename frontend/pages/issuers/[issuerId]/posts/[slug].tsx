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
import { Issuer } from "api/@types";
import { client } from "lib/client";
import { NEXT_PUBLIC_API_MOCKING } from "lib/env";

type Context = {
  params: { issuerId: string; slug: string };
};

type ErrorProps = {
  title: string;
  statusCode: number;
};

export type Props = {
  issuer: Issuer;
  source: MDXRemoteSerializeResult;
  matter: Markdown<Post>["data"]["matter"];
};

export async function getStaticProps({
  params: { issuerId, slug },
}: Context): Promise<GetStaticPropsResult<ErrorProps | Props>> {
  const markdowns = await readMarkdowns({
    type: "post",
    sort: false,
    issuerId: Number(issuerId),
  });

  if (markdowns instanceof globalThis.Error)
    return { props: { title: markdowns.message, statusCode: 500 } };
  const markdown = markdowns.find(
    (markdown) => markdown.data.matter.slug === slug,
  );
  if (!markdown) return { props: { title: "Post Not Found", statusCode: 404 } };
  const source = await serialize(markdown.value.toString(), {
    mdxOptions: {
      // @ts-expect-error Pluggable型がJSDocとTSで不一致
      // See https://github.com/orgs/rehypejs/discussions/63
      rehypePlugins: [rehypeImageSize],
      remarkPlugins: [remarkGfm],
      format: "md",
    },
  });
  const issuers = await client.issuer.list.$get().catch(() => []);
  let issuer: Issuer | undefined;
  if (NEXT_PUBLIC_API_MOCKING) {
    if (!issuers[0])
      return { props: { title: "Issuer Not Found", statusCode: 404 } };
    issuer = {
      ...issuers[0],
      issuer_id: Number(issuerId),
    } satisfies Issuer;
  } else {
    issuer = issuers.find((issuer) => issuer.issuer_id === Number(issuerId));
    if (!issuer)
      return { props: { title: "Issuer Not Found", statusCode: 404 } };
  }
  return {
    props: {
      issuer,
      source,
      matter: markdown.data.matter,
    },
  };
}

export async function getStaticPaths(): Promise<
  GetStaticPathsResult<Context["params"]>
> {
  const markdowns = await readMarkdowns({
    type: "post",
    sort: false,
    allIssuer: true,
  });
  if (markdowns instanceof globalThis.Error)
    return { paths: [], fallback: false };
  const paths = markdowns
    .filter((markdown) => Number.isFinite(markdown.data.matter.issuerId))
    .map((markdown) => ({
      params: {
        issuerId: String(markdown.data.matter.issuerId),
        slug: markdown.data.matter.slug,
      },
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
