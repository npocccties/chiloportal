import Image from "next/image";
import { MDXRemote } from "next-mdx-remote";
import { Props } from "pages/[slug]";
import Breadcrumbs from "components/Breadcrumbs";
import Container from "components/Container";
import { pagesPath } from "lib/$path";

const components = {
  img: (props: Pick<React.ImgHTMLAttributes<HTMLImageElement>, "src">) => {
    /* eslint-disable @next/next/no-img-element */
    if (!props.src) return <img alt="" src="" />;
    try {
      new URL(props.src);
      /*
        NOTE: 事前に許可したホスト以外画像最適化の対象にできない
        See Also: https://nextjs.org/docs/messages/next-image-unconfigured-host
      */
      return <img alt="" {...props} />;
    } catch (_) {
      return <Image alt="" {...props} src={props.src} />;
    }
  },
};

function Content({ source, matter }: Props) {
  return (
    <Container>
      <Breadcrumbs
        className="mb-6"
        nodes={[{ name: "トップ", href: pagesPath.$url() }]}
        leaf={matter.title}
      />
      <header className="prose max-w-none mb-6">
        <h1>{matter.title}</h1>
      </header>
      <article className="prose max-w-none">
        <MDXRemote {...source} components={components} />
      </article>
    </Container>
  );
}

export default Content;
