import Error from "next/error";
import { client } from "lib/client";
import { Consumer, Framework, Stage, Field, BadgeDetail2 } from "api/@types";
import Template from "templates/Stage";

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
  fields: Field[];
  wisdomBadgesMap: Map<number, BadgeDetail2[]>;
};

export async function getServerSideProps({
  params: { consumerId, frameworkId, stageId },
}: Context): Promise<{ props: ErrorProps | Props }> {
  const { body: consumer } = await client.consumer.get({
    query: { consumer_id: Number(consumerId) },
  });
  const { body: framework } = await client.framework.get({
    query: { framework_id: Number(frameworkId) },
  });
  const { body: stages } = await client.framework.stage.list.get({
    query: { framework_id: Number(frameworkId) },
  });
  const stage = stages.find((stage) => stage.stage_id === Number(stageId));
  if (!stage) return { props: { title: "Stage Not Found", statusCode: 404 } };
  const { body: fields } = await client.stage.field.list.get({
    query: { stage_id: Number(stageId) },
  });
  const wisdomBadgesMap = new Map<number, BadgeDetail2[]>();
  const fieldIds = fields.flatMap(({ field1 }) =>
    field1.flatMap(({ field2 }) =>
      field2.flatMap(({ field3 }) => field3.flatMap(({ field_id }) => field_id))
    )
  );
  for (const fieldId of fieldIds) {
    const { body: wisdomBadges } = await client.wisdomBadges.list.get({
      query: { field_id: fieldId, stage_id: Number(stageId) },
    });
    wisdomBadgesMap.set(fieldId, wisdomBadges.badges);
  }
  return {
    props: { consumer, framework, stages, stage, fields, wisdomBadgesMap },
  };
}

export default function Page(props: ErrorProps | Props) {
  if ("statusCode" in props)
    return <Error title={props.title} statusCode={props.statusCode} />;
  return <Template {...props} />;
}
