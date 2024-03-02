import Image from "next/image";
import { MDXRemote } from "next-mdx-remote";
import Breadcrumbs from "components/Breadcrumbs";
import Container from "components/Container";
import { pagesPath } from "lib/$path";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { Post as PostSchema } from "schemas";
import { Markdown } from "lib/markdown";
import { Issuer } from "api/@types";

type Props = {
  issuer?: Issuer;
  source: MDXRemoteSerializeResult;
  matter: Markdown<PostSchema>["data"]["matter"];
};

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

function Post({ issuer, source, matter }: Props) {
  return (
    <Container className="max-w-4xl">
      <Breadcrumbs
        className="mb-6"
        nodes={[
          { name: "トップ", href: pagesPath.$url() },
          issuer
            ? {
                name: issuer.name,
                href: pagesPath.issuers._issuerId(issuer.issuer_id).$url(),
              }
            : { name: "OKUTEPからのおしらせ", href: pagesPath.posts.$url() },
        ]}
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

export default Post;
