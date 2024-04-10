import Breadcrumbs from "components/Breadcrumbs";
import Container from "components/Container";
import Markdown from "components/Markdown";
import { pagesPath } from "lib/$path";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { Post as PostSchema } from "schemas";
import { Issuer } from "api/@types";

type Props = {
  issuer?: Issuer;
  source: MDXRemoteSerializeResult;
  matter: PostSchema;
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
            : { name: "お知らせ", href: pagesPath.posts.$url() },
        ]}
        leaf={matter.title}
      />
      <header className="prose max-w-none mb-6">
        <h1>{matter.title}</h1>
      </header>
      <article className="prose max-w-none">
        <Markdown {...source} />
      </article>
    </Container>
  );
}

export default Post;
