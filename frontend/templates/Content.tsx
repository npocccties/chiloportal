import Image from "next/image";
import { MDXRemote } from "next-mdx-remote";
import { Props } from "pages/[slug]";
import Breadcrumbs from "components/Breadcrumbs";
import Container from "components/Container";
import { pagesPath } from "lib/$path";

const components = {
  img: (props: any) => <Image alt="" {...props} />,
};

function Content({ source, matter }: Props) {
  return (
    <Container>
      <Breadcrumbs
        className="mb-6"
        nodes={[{ name: "トップ", href: pagesPath.$url() }]}
        leaf={matter.title}
      />
      <aside className="mb-6">
        <h1 className="text-2xl text-gray-700 mb-4">{matter.title}</h1>
      </aside>
      <article className="prose">
        <MDXRemote {...source} components={components} />
      </article>
    </Container>
  );
}

export default Content;
