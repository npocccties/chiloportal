import { GetServerSidePropsResult } from "next";
import type { ServerResponse } from "node:http";
import Error from "next/error";
import Head from "next/head";
import { client, getErrorProps } from "lib/client";
import title from "lib/title";
import { BadgeDetail1, BadgeDetail2 } from "api/@types";
import Template from "templates/WisdomBadges";

export type Context = {
  params: { wisdomBadgesId: string };
  res: ServerResponse;
};

type ErrorProps = {
  title: string;
  statusCode: number;
};

export type Props = {
  wisdomBadges: BadgeDetail1;
  knowledgeBadgesList: BadgeDetail2[];
};

export async function getServerSideProps({
  params: { wisdomBadgesId },
  res,
}: Context): Promise<GetServerSidePropsResult<ErrorProps | Props>> {
  try {
    const [wisdomBadges] = await client.badges.$get({
      query: {
        badges_ids: wisdomBadgesId,
        badges_type: "wisdom" as const,
        published_only: true,
      },
    });
    if (!("portal_category_id" in wisdomBadges))
      return {
        props: {
          title: "wisdomBadges missing portalCategory",
          statusCode: 404,
        },
      };
    if (!("knowledge_badges_list" in wisdomBadges.detail))
      return { props: { title: "KnowledgeBadges Not Found", statusCode: 404 } };
    const knowledgeBadgesList = await client.badges.$get({
      query: {
        badges_ids: wisdomBadges.detail.knowledge_badges_list.join(","),
        badges_type: "knowledge",
        published_only: true,
      },
    });
    return {
      props: { wisdomBadges, knowledgeBadgesList },
    };
  } catch (e) {
    const errorProps = await getErrorProps(e);
    // ポータル非表示のバッジは、URL を直接開いても中身を出さない（API が 404 を返す）
    if (errorProps.statusCode === 404) {
      res.statusCode = 404;
      return { props: { ...errorProps, title: "バッジが見つかりません" } };
    }
    return { props: errorProps };
  }
}

export default function Page(props: ErrorProps | Props) {
  if ("statusCode" in props) return <Error {...props} />;
  return (
    <>
      <Head>
        <title>{title(props.wisdomBadges.name)}</title>
        <meta property="og:title" content={title(props.wisdomBadges.name)} />
      </Head>
      <Template {...props} />
    </>
  );
}
