import { Icon } from "@iconify/react";
import { Props } from "pages/consumers/[consumerId]/frameworks/[frameworkId]/stages/[stageId]";
import Breadcrumbs from "components/Breadcrumbs";
import Container from "components/Container";
import StagesDialog from "components/StagesDialog";
import WisdomBadgesItem from "components/WisdomBadgesItem";
import FieldsIndex from "components/FieldsIndex";
import { pagesPath } from "lib/$path";
import { makeFieldId } from "lib/field";
import useDialog from "lib/use-dialog";

export default function Stage({
  consumer,
  framework,
  stages,
  stage,
  field,
  wisdomBadgesListPerFields3PerField1,
}: Props) {
  const { open, onOpen, onClose } = useDialog();
  return (
    <Container
      className="lg:max-w-6xl lg:grid gap-4 grid-cols-[1fr_20rem]"
      style={{
        gridTemplateAreas: "'breadcrumbs breadcrumbs' 'article aside'",
      }}
    >
      <Breadcrumbs
        className="mb-2 [grid-area:breadcrumbs]"
        nodes={[
          { name: "トップ", href: pagesPath.$url() },
          {
            name: `${consumer.name}の教員育成指標`,
            href: pagesPath.consumers._consumerId(consumer.consumer_id).$url(),
          },
        ]}
        leaf={stage.name}
      />
      <aside className="hidden lg:block [grid-area:aside]">
        <div className="mb-8">
          <p className="text-sm text-gray-600 mb-4">
            こちらの内容は{consumer.name}のサイトでも資料が公開されています
          </p>
          <a
            className="jumpu-outlined-button inline-flex items-center"
            href={framework.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="mr-2">
              {consumer.name}
              <span className="font-bold">教員育成指標のPDF</span>
            </span>
            <Icon className="inline" icon="fa-solid:external-link-alt" />
          </a>
        </div>
        <nav className="rounded-xl bg-gray-50 p-4 sticky top-[4rem]">
          <h2 className="text-sm text-gray-600 mb-4">
            このページの指標項目の目次
          </h2>
          <FieldsIndex
            className="max-h-[calc(100vh-10rem)] overflow-y-scroll"
            field={field}
          />
        </nav>
      </aside>
      <article className="[grid-area:article]">
        <h1 className="text-2xl mb-2">{framework.name}</h1>
        <p className="mb-4 lg:hidden">
          <a
            className="jumpu-outlined-button inline-flex items-center text-sm"
            href={framework.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="mr-2">教員育成指標のPDF</span>
            <Icon className="inline" icon="fa-solid:external-link-alt" />
          </a>
        </p>
        <p className="flex gap-4 items-center mb-8">
          <span className="text-lg">{stage.name}</span>
          <button className="jumpu-text-button" onClick={onOpen}>
            他の成長段階
          </button>
          <StagesDialog
            consumer={consumer}
            framework={framework}
            stages={stages}
            stage={stage}
            open={open}
            onClose={onClose}
          />
        </p>
        {field.field1.map(({ field1_name, field2 }, field1Index) => (
          <section key={field1Index}>
            <h2
              id={makeFieldId(field1_name, field1Index)}
              className="text-2xl mb-4 scroll-mt-16"
            >
              {field1_name}
            </h2>
            {field2.map(({ field2_name, field3 }, field2Index) => (
              <section key={field2Index}>
                <h3
                  id={makeFieldId(field2_name, field1Index, field2Index)}
                  className="text-lg pb-2 mb-4 border-b border-solid border-gray-300 scroll-mt-16"
                >
                  {field2_name}
                </h3>
                {field3.map(({ field_id, field3_name }, field3Index) => (
                  <section key={field_id}>
                    <h4
                      id={makeFieldId(
                        field3_name,
                        field1Index,
                        field2Index,
                        field3Index
                      )}
                      className="font-bold text-gray-700 mb-4 scroll-mt-16"
                    >
                      {field3_name}
                    </h4>
                    <ul>
                      {wisdomBadgesListPerFields3PerField1[field1Index][
                        field3Index
                      ].map((wisdomBadges) => (
                        <li className="mb-8" key={wisdomBadges.badges_id}>
                          <WisdomBadgesItem wisdomBadges={wisdomBadges} />
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </section>
            ))}
          </section>
        ))}
      </article>
    </Container>
  );
}
