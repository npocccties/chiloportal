import Error from "next/error";
import { client } from "lib/client";
import {
  Consumer,
  Framework,
  Stage,
  FieldDetail,
  BadgeDetail1,
  BadgeDetail2,
} from "api/@types";
import Template from "templates/Stage";
import { NEXT_PUBLIC_API_MOCKING } from "lib/env";
import { stage as fakeStage } from "mocks/faker";

export type Context = {
  params: { consumerId: string; frameworkId: string; stageId: string };
};

type ErrorProps = {
  title: string;
  statusCode: number;
};

export type Props = {
  consumer: Consumer;
  framework: Framework;
  stages: Stage[];
  stage: Stage;
  fields: FieldDetail[];
  wisdomBadgesListPerFields: (BadgeDetail1 | BadgeDetail2)[][];
};

export async function getServerSideProps({
  params: { consumerId, frameworkId, stageId },
}: Context): Promise<{ props: ErrorProps | Props }> {
  const consumer = await client.consumer.$get({
    query: { consumer_id: Number(consumerId) },
  });
  const framework = await client.framework.$get({
    query: { framework_id: Number(frameworkId) },
  });
  const stages = await client.framework.stage.list.$get({
    query: { framework_id: Number(frameworkId) },
  });
  const stage = NEXT_PUBLIC_API_MOCKING
    ? fakeStage()
    : stages.find((stage) => stage.stage_id === Number(stageId));
  if (!stage) return { props: { title: "Stage Not Found", statusCode: 404 } };
  const fields = await client.stage.field.list.$get({
    query: { stage_id: Number(stageId) },
  });
  const wisdomBadgesListPerFields = await Promise.all(
    fields.flatMap(({ field1 }) =>
      field1.flatMap(({ field2 }) =>
        field2.flatMap(({ field3 }) =>
          field3.flatMap(({ wisdom_badges }) =>
            client.badges.$get({
              query: {
                badges_type: "wisdom",
                badges_ids: wisdom_badges.join(","),
              },
            })
          )
        )
      )
    )
  );
  return {
    props: {
      consumer,
      framework,
      stages,
      stage,
      fields,
      wisdomBadgesListPerFields,
    },
  };
}

export default function Page(props: ErrorProps | Props) {
  if ("statusCode" in props)
    return <Error title={props.title} statusCode={props.statusCode} />;
  return <Template {...props} />;
}
