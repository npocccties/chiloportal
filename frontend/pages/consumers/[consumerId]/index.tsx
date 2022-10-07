import { client } from "lib/client";
import { Consumer, Framework, Stage } from "api/@types";
import Template from "templates/Frameworks";

export type Context = {
  params: { consumerId: string };
};

export type Props = {
  consumer: Consumer;
  frameworks: Framework[];
  stagesPerFrameworks: Stage[][];
};

export async function getServerSideProps({
  params: { consumerId },
}: Context): Promise<{
  props: Props;
}> {
  const { body: consumer } = await client.consumer.get({
    query: { consumer_id: Number(consumerId) },
  });
  const { body: frameworks } = await client.consumer.framework.list.get({
    query: { consumer_id: Number(consumerId) },
  });
  const stagesPerFrameworks = await Promise.all(
    frameworks.map(({ framework_id }) =>
      client.framework.stage.list.get({ query: { framework_id } })
    )
  ).then((value) => value.map((res) => res.body));
  return {
    props: { consumer, frameworks, stagesPerFrameworks },
  };
}

export default Template;
