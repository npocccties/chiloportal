import Breadcrumbs from "components/Breadcrumbs";
import Container from "components/Container";
import { Props } from "pages/discover";
import { pagesPath } from "lib/$path";

export default function Discover(props: Props & { children: React.ReactNode }) {
  return (
    <Container as="article">
      <Breadcrumbs
        className="mb-6"
        nodes={[{ name: "トップ", href: pagesPath.$url() }]}
        leaf="バッジを探す"
      />
      <h1 className="text-3xl font-bold">バッジを探す</h1>
      {props.children}
    </Container>
  );
}
