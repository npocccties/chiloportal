import { Props } from "pages/[slug]";
import Breadcrumbs from "components/Breadcrumbs";
import Container from "components/Container";
import { pagesPath } from "lib/$path";

function Content({ title, content }: Props) {
  return (
    <Container>
      <Breadcrumbs
        className="mb-6"
        nodes={[{ name: "トップ", href: pagesPath.$url() }]}
        leaf={title}
      />
      <aside className="mb-6">
        <h1 className="text-2xl text-gray-700 mb-4">{title}</h1>
      </aside>
      <article
        className="prose"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </Container>
  );
}

export default Content;
