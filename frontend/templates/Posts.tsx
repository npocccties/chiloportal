import { Icon } from "@iconify/react";
import { Props } from "pages/posts";
import Breadcrumbs from "components/Breadcrumbs";
import Container from "components/Container";
import PostLink from "components/PostLink";
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
            <PostLink
              post={post}
              href={pagesPath.posts._slug(post.slug).$url()}
            />
          </li>
        ))}
      </ul>
    </Container>
  );
}

export default Posts;
