import Link from "next/link";
import { Icon } from "@iconify/react";
import { Props } from "pages/posts";
import Breadcrumbs from "components/Breadcrumbs";
import Container from "components/Container";
import { pagesPath } from "lib/$path";

function Posts({ posts }: Props) {
  return (
    <Container as="article">
      <Breadcrumbs
        className="mb-6"
        nodes={[{ name: "トップ", href: pagesPath.$url() }]}
        leaf="お知らせ"
      />
      <h1 className="flex gap-4 items-center text-base md:text-xl font-bold border-b-4 border-black pb-2 mb-4">
        <span className="inline-flex bg-black rounded-xl p-3">
          <Icon className="text-white" icon="ion:newspaper-outline" />
        </span>
        お知らせ
      </h1>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              className="flex items-center justify-between gap-4 border-l-4 border-gray-100 pl-4 text-sm hover:bg-gray-50 py-1 pr-1 [&>span:first-child]:hover:underline"
              href={pagesPath.posts._slug(post.slug).$url()}
            >
              <span>{post.title}</span>
              <span className="p-2 text-xs text-primary-950 bg-gray-100 rounded">
                {post.datePublished}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}

export default Posts;
