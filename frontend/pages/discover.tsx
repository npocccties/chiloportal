import { GetServerSidePropsResult } from "next";
import Error from "next/error";
import Head from "next/head";
import { client, getErrorProps } from "lib/client";
import Template from "templates/Discover";
import Nav from "components/DiscoverNav";
import MobileNav from "components/DiscoverDialog";
import title from "lib/title";
import {
  BadgeDetail1,
  BadgeDetail2,
  Issuer,
  PortalCategory,
  Consumer,
  Framework,
  Stage,
  FieldDetail,
  Field3d,
} from "api/@types";
import parsePageQuery from "lib/parse-page-query";
import { NEXT_PUBLIC_API_MOCKING } from "lib/env";

type AllBadgesQuery = {
  by?: "all";
  p?: string;
};
type IssuerBadgesQuery = {
  by: "issuer";
  issuer_id: string;
  p?: string;
};
type CategoryBadgesQuery = {
  by: "category";
  portal_category_id: string;
  p?: string;
};
type FrameworkBadgesQuery = {
  by: "framework";
  consumer_id: string;
  framework_id: string;
  stage_id?: string;
};
export type Query =
  | AllBadgesQuery
  | IssuerBadgesQuery
  | CategoryBadgesQuery
  | FrameworkBadgesQuery;
export type Context = {
  query: Query;
};

type ErrorProps = {
  title: string;
  statusCode: number;
};

export type AllBadges = {
  type: "all";
  badges: Awaited<ReturnType<typeof client.badges.list.$get>>;
};
export type IssuerBadges = {
  type: "issuer";
  issuer: Issuer;
  badges: Awaited<ReturnType<typeof client.badges.list.$get>>;
};
export type CategoryBadges = {
  type: "category";
  portalCategory: PortalCategory;
  badges: Awaited<ReturnType<typeof client.badges.list.$get>>;
};
export type FrameworkBadges = {
  type: "framework";
  consumer: Consumer;
  framework: Framework;
  stages: Stage[];
  stage: Stage;
  field: FieldDetail;
  badges: Record<Field3d["field_id"], (BadgeDetail1 | BadgeDetail2)[]>;
};
export type Nav = {
  issuers: Issuer[];
  portalCategories: PortalCategory[];
  consumers: Consumer[];
  frameworks: Record<Consumer["consumer_id"], Framework[]>;
};
export type Props = (
  | AllBadges
  | IssuerBadges
  | CategoryBadges
  | FrameworkBadges
) &
  Nav;

export async function getServerSideProps({
  query,
}: Context): Promise<GetServerSidePropsResult<ErrorProps | Props>> {
  try {
    const issuers = await client.issuer.list.$get();
    const portalCategories = await client.portalCategory.list.$get();
    const consumers = await client.consumer.list.$get();
    const frameworks = await Promise.all(
      consumers.map(({ consumer_id }) =>
        client.consumer.framework.list
          .$get({ query: { consumer_id: Number(consumer_id) } })
          .then((result) => [consumer_id, result] as const),
      ),
    ).then((result) => Object.fromEntries(result));
    if (query.by === "issuer") {
      const pageNumber = parsePageQuery(query.p);
      const issuer = NEXT_PUBLIC_API_MOCKING
        ? issuers[0]
        : issuers.find(
            ({ issuer_id }) => issuer_id === Number(query.issuer_id),
          );
      if (!issuer)
        return { props: { title: "Issuer Not Found", statusCode: 404 } };
      const badges = await client.badges.list.$get({
        query: { issuer_id: Number(query.issuer_id), page_number: pageNumber },
      });
      return {
        props: {
          type: "issuer",
          badges,
          issuers,
          portalCategories,
          consumers,
          frameworks,
          issuer,
        },
      };
    }
    if (query.by === "category") {
      const pageNumber = parsePageQuery(query.p);
      const portalCategory = NEXT_PUBLIC_API_MOCKING
        ? portalCategories[0]
        : portalCategories.find(
            ({ portal_category_id }) =>
              portal_category_id === Number(query.portal_category_id),
          );
      if (!portalCategory)
        return { props: { title: "Category Not Found", statusCode: 404 } };
      const badges = await client.badges.list.$get({
        query: {
          portal_category_id: Number(query.portal_category_id),
          page_number: pageNumber,
        },
      });
      return {
        props: {
          type: "category",
          badges,
          issuers,
          portalCategories,
          consumers,
          frameworks,
          portalCategory,
        },
      };
    }
    if (query.by === "framework") {
      const consumer = await client.consumer.$get({
        query: { consumer_id: Number(query.consumer_id) },
      });
      const framework = await client.framework.$get({
        query: { framework_id: Number(query.framework_id) },
      });
      const stages = await client.framework.stage.list.$get({
        query: { framework_id: Number(query.framework_id) },
      });
      const stage =
        !NEXT_PUBLIC_API_MOCKING && query.stage_id
          ? stages.find((stage) => stage.stage_id === Number(query.stage_id))
          : stages[0];
      if (!stage)
        return { props: { title: "Stage Not Found", statusCode: 404 } };
      const field = await client.stage.field.list.$get({
        query: { stage_id: Number(stage.stage_id) },
      });
      const badges = await Promise.all(
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
                .then((result) => [field_id, result] as const),
            ),
          ),
        ),
      ).then((result) => Object.fromEntries(result));
      return {
        props: {
          type: "framework",
          badges,
          issuers,
          portalCategories,
          consumers,
          frameworks,
          consumer,
          framework,
          stages,
          stage,
          field,
        },
      };
    }
    const pageNumber = parsePageQuery(query.p);
    const badges = await client.badges.list.$get({
      query: { page_number: pageNumber },
    });
    return {
      props: {
        type: "all",
        badges,
        issuers,
        portalCategories,
        consumers,
        frameworks,
      },
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
        <title>{title("学びを探す")}</title>
        <meta property="og:title" content={title("学びを探す")} />
      </Head>
      <Template {...props}>
        <Nav {...props} className="hidden md:block" />
        <MobileNav {...props} className="md:hidden mb-4" />
      </Template>
    </>
  );
}
