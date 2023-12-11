import Link from "next/link";
import { pagesPath } from "lib/$path";
import { Props } from "pages/issuers/[issuerId]";
import Container from "components/Container";

export default function Issuer({ issuer, posts, learningContents }: Props) {
  return (
    <Container className="prose">
      <h2>おしらせ</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={pagesPath.issuers
                ._issuerId(issuer.issuer_id)
                .posts._slug(post.slug)
                .$url()}
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
      <h2>その他コンテンツ</h2>
      <ul>
        {learningContents.map((learningContent, index) => (
          <li key={index}>{learningContent.name}</li>
        ))}
      </ul>
    </Container>
  );
}
