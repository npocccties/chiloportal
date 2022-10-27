import Error from "next/error";
import { client } from "lib/client";
import { BadgeDetail1, BadgeDetail2 } from "api/@types";
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
};

export async function getServerSideProps({
  params: { wisdomBadgesId },
}: Context): Promise<{ props: ErrorProps | Props }> {
  const [wisdomBadges] = await client.badges.$get({
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
  const knowledgeBadgesList = await client.badges.$get({
    query: {
      badges_ids: wisdomBadges.detail.knowledge_badges_list.join(","),
      badges_type: "knowledge",
    },
  });
  return {
    props: { wisdomBadges, knowledgeBadgesList },
  };
}

export default function Page(props: ErrorProps | Props) {
  if ("statusCode" in props) return <Error {...props} />;
  return <Template {...props} />;
}
