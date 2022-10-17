import { Props } from "pages/posts/[slug]";
import Breadcrumbs from "components/Breadcrumbs";
import { pagesPath } from "lib/$path";

function Post({ title, content }: Props) {
  return (
    <div className="max-w-4xl mx-auto my-16 px-4 min-h-[33vh]">
      <Breadcrumbs
        className="mb-6"
        nodes={[
          { name: "トップ", href: pagesPath.$url() },
          { name: "OKUTEPからのおしらせ", href: pagesPath.posts.$url() },
        ]}
        leaf={title}
      />
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
