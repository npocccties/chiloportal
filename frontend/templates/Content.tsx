import { Props } from "pages/[slug]";
import Breadcrumbs from "components/Breadcrumbs";
import Container from "components/Container";
import Markdown from "components/Markdown";
import { pagesPath } from "lib/$path";

function Content({ source, matter }: Props) {
  return (
    <Container className="max-w-4xl">
      <Breadcrumbs
        className="mb-6"
        nodes={[{ name: "トップ", href: pagesPath.$url() }]}
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

export default Content;
