import { GetStaticPropsResult } from "next";
import { BadgeDetail1 } from "api/@types";
import Template from "templates/Top";

export type Props = {
  articles: { title: string; slug: string }[];
  recommendedWisdomBadgesList: BadgeDetail1[];
  learningContents: { name: string; url: string }[];
};

export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
  return {
    props: {
      articles: [],
      recommendedWisdomBadgesList: [],
      learningContents: [],
    },
  };
}

export default Template;
