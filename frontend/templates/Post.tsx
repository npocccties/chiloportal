import { Props } from "pages/posts/[slug]";

function Post({ title, content }: Props) {
  return (
    <div className="max-w-4xl mx-auto my-16 px-4 min-h-[33vh]">
      <aside className="mb-6">
        <h1 className="text-2xl text-gray-700 mb-4">{title}</h1>
      </aside>
      <article
        className="prose"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}

export default Post;
