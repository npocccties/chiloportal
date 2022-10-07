import Error from "next/error";
import { client } from "lib/client";
import { BadgeDetail1, BadgeDetail2, Criteria } from "api/@types";
import Template from "templates/WisdomBadges";

export type Context = {
  params: { wisdomBadgesId: string };
};

type ErrorProps = {
  title: string;
  statusCode: number;
};

export type Props = {
  wisdomBadges: BadgeDetail1;
  knowledgeBadgesList: BadgeDetail2[];
  criteriasPerKnowledgeBadges: Criteria[][];
};

export async function getServerSideProps({
  params: { wisdomBadgesId },
}: Context): Promise<{ props: ErrorProps | Props }> {
  const {
    body: [wisdomBadges],
  } = await client.badges.get({
    query: {
      badges_ids: wisdomBadgesId,
      badges_type: "wisdom" as const,
    },
  });
  if (!("portal_category_id" in wisdomBadges))
    return {
      props: { title: "wisdomBadges missing portalCategory", statusCode: 404 },
    };
  if (!("knowledge_badges_list" in wisdomBadges.detail))
    return { props: { title: "KnowledgeBadges Not Found", statusCode: 404 } };
  const { body: knowledgeBadgesList } = await client.badges.get({
    query: {
      badges_ids: wisdomBadges.detail.knowledge_badges_list.join(","),
      badges_type: "knowledge",
    },
  });
  const criteriasPerKnowledgeBadges = await Promise.all(
    knowledgeBadgesList.map((knowledgeBadges) =>
      client.knowledgeBadges.criteria.list.get({
        query: { badges_id: knowledgeBadges.badges_id },
      })
    )
  ).then((value) => value.map((res) => res.body));
  return {
    props: { wisdomBadges, knowledgeBadgesList, criteriasPerKnowledgeBadges },
  };
}

export default function Page(props: ErrorProps | Props) {
  if ("statusCode" in props)
    return <Error title={props.title} statusCode={props.statusCode} />;
  return <Template {...props} />;
}
