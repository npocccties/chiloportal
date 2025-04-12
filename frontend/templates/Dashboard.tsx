import { Props } from "pages/dashboard";
import Breadcrumbs from "components/Breadcrumbs";
import Container from "components/Container";
import { pagesPath } from "lib/$path";

function Dashboard({ tab: _ }: Props) {
  return (
    <Container>
      <Breadcrumbs
        className="mb-6"
        nodes={[{ name: "トップ", href: pagesPath.$url() }]}
        leaf="ダッシュボード"
      />
      <h1 className="text-3xl font-bold hidden md:block mb-8 border-b border-gray-300 pb-2">
        ダッシュボード
      </h1>
    </Container>
  );
}

export default Dashboard;
