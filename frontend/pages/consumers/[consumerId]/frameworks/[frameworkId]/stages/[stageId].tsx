import { GetServerSidePropsResult } from "next";
import Error from "next/error";
import Head from "next/head";
import { client, getErrorProps } from "lib/client";
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
import title from "lib/title";

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
  field: FieldDetail;
  wisdomBadgesListPerFields: {
    [fieldId: number]: (BadgeDetail1 | BadgeDetail2)[];
  };
};

export async function getServerSideProps({
  params: { consumerId, frameworkId, stageId },
}: Context): Promise<GetServerSidePropsResult<ErrorProps | Props>> {
  try {
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
      ? stages.find(() => true)
      : stages.find((stage) => stage.stage_id === Number(stageId));
    if (!stage) return { props: { title: "Stage Not Found", statusCode: 404 } };
    const field = await client.stage.field.list.$get({
      query: { stage_id: Number(stageId) },
    });
    const wisdomBadgesListPerFields = await Promise.all(
      field.field1.flatMap(({ field2 }) =>
        field2.flatMap(({ field3 }) =>
          field3.flatMap(({ field_id, wisdom_badges }) =>
            client.badges
              .$get({
                query: {
                  badges_type: "wisdom",
                  badges_ids: wisdom_badges.join(","),
                },
              })
              .then((result) => ({ [field_id]: result }))
          )
        )
      )
    ).then((result) => Object.assign({}, ...result));
    return {
      props: {
        consumer,
        framework,
        stages,
        stage,
        field,
        wisdomBadgesListPerFields,
      },
    };
  } catch (e) {
    return {
      props: await getErrorProps(e),
    };
  }
}

export default function Page(props: ErrorProps | Props) {
  if ("statusCode" in props) return <Error {...props} />;
  return (
    <>
      <Head>
        <title>{title(props.framework.name, props.stage.name)}</title>
      </Head>
      <Template {...props} />
    </>
  );
}
