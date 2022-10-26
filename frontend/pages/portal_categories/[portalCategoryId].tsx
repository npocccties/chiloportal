import Error from "next/error";
import { client } from "lib/client";
import { PortalCategory } from "api/@types";
import Template from "templates/PortalCategory";
import { NEXT_PUBLIC_API_MOCKING } from "lib/env";

export type Query = { p?: string };

export type Context = {
  params: { portalCategoryId: string };
  query: Query;
};

type ErrorProps = {
  title: string;
  statusCode: number;
};

export type Props = {
  portalCategory: PortalCategory;
  wisdomBadgesList: Awaited<
    ReturnType<typeof client.portalCategory.badges.list.$get>
  >;
};

export async function getServerSideProps({
  params: { portalCategoryId },
  query: { p },
}: Context): Promise<{ props: ErrorProps | Props }> {
  const portalCategories = await client.portalCategory.list.$get();
  const portalCategory = NEXT_PUBLIC_API_MOCKING
    ? (await import("mocks/faker")).portalCategory()
    : portalCategories.find(
        (portalCategory) =>
          portalCategory.portal_category_id === Number(portalCategoryId)
      );
  if (!portalCategory)
    return { props: { title: "PortalCategory Not Found", statusCode: 404 } };
  const wisdomBadgesList = await client.portalCategory.badges.list.$get({
    query: {
      portal_category_id: portalCategory.portal_category_id,
      page_number: Number(p),
    },
  });
  return {
    props: { portalCategory, wisdomBadgesList },
  };
}

export default function Page(props: ErrorProps | Props) {
  if ("statusCode" in props)
    return <Error title={props.title} statusCode={props.statusCode} />;
  return <Template {...props} />;
}
