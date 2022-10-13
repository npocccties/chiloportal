import Link from "next/link";
import { Props } from "pages/posts";
import { pagesPath } from "lib/$path";

function Posts({ posts }: Props) {
  return (
    <article className="max-w-4xl mx-auto my-16 px-4 min-h-[33vh]">
      <h1 className="text-2xl text-gray-700 mb-4">OKUTEPからのおしらせ</h1>
      <ul className="list-disc pl-8 text-gray-700">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={pagesPath.posts._slug(post.slug).$url()}>
              <a className="underline">{post.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default Posts;
