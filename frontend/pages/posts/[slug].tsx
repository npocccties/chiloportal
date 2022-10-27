import { micromark } from "micromark";
import { frontmatter, frontmatterHtml } from "micromark-extension-frontmatter";
import { gfm, gfmHtml } from "micromark-extension-gfm";
import { GetStaticPropsResult, GetStaticPathsResult } from "next";
import Error from "next/error";
import Template from "templates/Post";
import { readMarkdowns } from "lib/markdown";

type Context = {
  params: { slug: string };
};

type ErrorProps = {
  title: string;
  statusCode: number;
};

export type Props = {
  title: string;
  content: string;
};

export async function getStaticProps({
  params: { slug },
}: Context): Promise<GetStaticPropsResult<ErrorProps | Props>> {
  const markdowns = await readMarkdowns("posts");
  if (markdowns instanceof globalThis.Error)
    return { props: { title: markdowns.message, statusCode: 500 } };
  const markdown = markdowns.find((markdown) => markdown.slug === slug);
  if (!markdown) return { props: { title: "Post Not Found", statusCode: 404 } };
  const content = micromark(markdown.body, {
    extensions: [frontmatter(), gfm()],
    htmlExtensions: [frontmatterHtml(), gfmHtml()],
  });
  return {
    props: {
      title: markdown.title,
      content,
    },
  };
}

export async function getStaticPaths(): Promise<
  GetStaticPathsResult<Context["params"]>
> {
  const markdowns = await readMarkdowns("posts");
  const paths =
    "map" in markdowns
      ? markdowns.map(({ slug }) => ({
          params: { slug },
        }))
      : [];
  return { paths, fallback: false };
}

export default function Page(props: ErrorProps | Props) {
  if ("statusCode" in props) return <Error {...props} />;
  return <Template {...props} />;
}
