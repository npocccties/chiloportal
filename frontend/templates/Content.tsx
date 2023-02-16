import Image from "next/image";
import { MDXRemote } from "next-mdx-remote";
import { Props } from "pages/[slug]";
import Breadcrumbs from "components/Breadcrumbs";
import Container from "components/Container";
import { pagesPath } from "lib/$path";

const components = {
  img: (props: any) => {
    try {
      new URL(props.src);
      /* eslint-disable @next/next/no-img-element */
      /*
        NOTE: 事前に許可したホスト以外画像最適化の対象にできない
        See Also: https://nextjs.org/docs/messages/next-image-unconfigured-host
      */
      return <img alt="" {...props} />;
    } catch (_) {
      return <Image alt="" {...props} />;
    }
  },
};

function Content({ source, matter }: Props) {
  return (
    <Container className="max-w-2xl mb-16">
      <Breadcrumbs
        className="mb-6"
        nodes={[{ name: "トップ", href: pagesPath.$url() }]}
        leaf={matter.title}
      />
      <header className="prose max-w-none mb-6">
        <h1 className="mb-4">{matter.title}</h1>
      </header>
      <article className="prose max-w-none">
        <MDXRemote {...source} components={components} />
      </article>
    </Container>
  );
}

export default Content;
