import Image from "next/image";
import { MDXRemote } from "next-mdx-remote";
import { Props } from "pages/posts/[slug]";
import Breadcrumbs from "components/Breadcrumbs";
import Container from "components/Container";
import { pagesPath } from "lib/$path";

const components = {
  img: (props: any) => <Image alt="" {...props} />,
};

function Post({ source, matter }: Props) {
  return (
    <Container>
      <Breadcrumbs
        className="mb-6"
        nodes={[
          { name: "トップ", href: pagesPath.$url() },
          { name: "OKUTEPからのおしらせ", href: pagesPath.posts.$url() },
        ]}
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

export default Post;
