import { Props } from "pages/consumers/[consumerId]";
import Breadcrumbs from "components/Breadcrumbs";
import Container from "components/Container";
import StagesTable from "components/StagesTable";
import { pagesPath } from "lib/$path";

export default function Frameworks({
  consumer,
  frameworks,
  stagesPerFrameworks,
}: Props) {
  const title = `${consumer.name}の教員育成指標`;
  return (
    <Container as="article" className="mb-16">
      <Breadcrumbs
        className="mb-6"
        nodes={[{ name: "トップ", href: pagesPath.$url() }]}
        leaf={title}
      />
      <h1 className="text-3xl md:text-4xl font-bold my-8">{title}</h1>
      {frameworks.map((framework, frameworkIndex) => {
        const stages = stagesPerFrameworks[frameworkIndex];
        return (
          <section key={framework.framework_id} className="mb-8 xl:mb-12">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              {framework.name}
            </h2>
            <StagesTable
              className="w-full max-w-[40rem]"
              consumer={consumer}
              framework={framework}
              stages={stages}
            />
          </section>
        );
      })}
    </Container>
  );
}
