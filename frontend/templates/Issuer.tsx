import { Props } from "pages/issuers/[issuerId]";
import Container from "components/Container";

export default function Issuer({ posts, learningContents }: Props) {
  return (
    <Container className="prose">
      <h2>おしらせ</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>{post.title}</li>
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
