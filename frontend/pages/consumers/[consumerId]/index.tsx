import { GetServerSidePropsResult } from "next";
import Error from "next/error";
import Head from "next/head";
import { client, getErrorProps } from "lib/node-client";
import { Consumer, Framework, Stage } from "api/@types";
import Template from "templates/Frameworks";
import title from "lib/title";

export type Context = {
  params: { consumerId: string };
};

type ErrorProps = {
  title: string;
  statusCode: number;
};

export type Props = {
  consumer: Consumer;
  frameworks: Framework[];
  stagesPerFrameworks: Stage[][];
};

export async function getServerSideProps({
  params: { consumerId },
}: Context): Promise<GetServerSidePropsResult<ErrorProps | Props>> {
  try {
    const consumer = await client.consumer.$get({
      query: { consumer_id: Number(consumerId) },
    });
    const frameworks = await client.consumer.framework.list.$get({
      query: { consumer_id: Number(consumerId) },
    });
    const stagesPerFrameworks = await Promise.all(
      frameworks.map(({ framework_id }) =>
        client.framework.stage.list.$get({ query: { framework_id } }),
      ),
    );
    return {
      props: { consumer, frameworks, stagesPerFrameworks },
    };
  } catch (e) {
    return { props: await getErrorProps(e) };
  }
}

export default function Page(props: ErrorProps | Props) {
  if ("statusCode" in props) return <Error {...props} />;
  return (
    <>
      <Head>
        <title>{title(`${props.consumer.name}の教員育成指標`)}</title>
      </Head>
      <Template {...props} />
    </>
  );
}
