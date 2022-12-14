import { GetServerSidePropsResult } from "next";
import Error from "next/error";
import Head from "next/head";
import { client, getErrorProps } from "lib/client";
import { PortalCategory } from "api/@types";
import Template from "templates/PortalCategory";
import { NEXT_PUBLIC_API_MOCKING } from "lib/env";
import title from "lib/title";

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
}: Context): Promise<GetServerSidePropsResult<ErrorProps | Props>> {
  try {
    const pageNumber = Number(p);
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
        page_number: Number.isInteger(pageNumber) ? pageNumber : undefined,
      },
    });
    return {
      props: { portalCategory, wisdomBadgesList },
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
        <title>{title(props.portalCategory.name)}</title>
      </Head>
      <Template {...props} />
    </>
  );
}
