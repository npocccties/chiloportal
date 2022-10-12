import { client } from "lib/client";
import { Consumer, PortalCategory, BadgeDetail1 } from "api/@types";
import Template from "templates/Top";

export type Props = {
  articles: { title: string; slug: string }[];
  recommendedWisdomBadgesList: BadgeDetail1[];
  learningContents: { name: string; url: string }[];
  consumers: Consumer[];
  portalCategories: PortalCategory[];
};

export async function getServerSideProps(): Promise<{
  props: Props;
}> {
  const consumers = await client.consumer.list.$get();
  const portalCategories = await client.portalCategory.list.$get();
  return {
    props: {
      articles: [],
      recommendedWisdomBadgesList: [],
      learningContents: [],
      consumers,
      portalCategories,
    },
  };
}

export default Template;
