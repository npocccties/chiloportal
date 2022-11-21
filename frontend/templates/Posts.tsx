import { Props } from "pages/posts";
import Breadcrumbs from "components/Breadcrumbs";
import Container from "components/Container";
import Link from "components/Link";
import { pagesPath } from "lib/$path";

function Posts({ posts }: Props) {
  return (
    <Container as="article">
      <Breadcrumbs
        className="mb-6"
        nodes={[{ name: "トップ", href: pagesPath.$url() }]}
        leaf="OKUTEPからのおしらせ"
      />
      <h1 className="text-2xl text-gray-700 mb-4">OKUTEPからのおしらせ</h1>
      <ul className="list-disc pl-8 text-gray-700">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={pagesPath.posts._slug(post.slug).$url()}
              className="underline"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}

export default Posts;
