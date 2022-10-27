import matter from "gray-matter";
import { micromark } from "micromark";
import { frontmatter, frontmatterHtml } from "micromark-extension-frontmatter";
import { gfm, gfmHtml } from "micromark-extension-gfm";
import { GetStaticPropsResult, GetStaticPathsResult } from "next";
import Error from "next/error";
import Template from "templates/Content";
import { readContents } from "lib/content";

type Context = {
  params: { slug: string };
};

type ErrorProps = {
  title: string;
  statusCode: number;
};

export type Props = {
  title: string;
  slug: string;
  content: string;
};

export async function getStaticProps({
  params: { slug },
}: Context): Promise<GetStaticPropsResult<ErrorProps | Props>> {
  const contents = await readContents();
  const frontmatters = contents.map((content) => matter(content));
  const index = frontmatters.findIndex(
    (frontmatter) => frontmatter.data.slug === slug
  );
  if (index === -1)
    return { props: { title: "Content Not Found", statusCode: 404 } };
  const content = micromark(contents[index], {
    extensions: [frontmatter(), gfm()],
    htmlExtensions: [frontmatterHtml(), gfmHtml()],
  });
  return {
    props: {
      title: frontmatters[index].data.title,
      slug: frontmatters[index].data.slug,
      content,
    },
  };
}

export async function getStaticPaths(): Promise<
  GetStaticPathsResult<Context["params"]>
> {
  const contents = await readContents();
  const frontmatters = contents.map((post) => matter(post));
  const paths = frontmatters.map((frontmatter) => ({
    params: { slug: frontmatter.data.slug },
  }));
  return { paths, fallback: false };
}

export default function Page(props: ErrorProps | Props) {
  if ("statusCode" in props) return <Error {...props} />;
  return <Template {...props} />;
}
