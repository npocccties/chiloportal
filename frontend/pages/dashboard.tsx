import { GetServerSidePropsResult, GetServerSidePropsContext } from "next";
import Error from "next/error";
import Head from "next/head";
import { chilowalletClient, getErrorProps } from "lib/client";
import Template from "templates/Dashboard";
import title from "lib/title";
import { JWT_DEBUG_VALUE } from "lib/env";

export type Query = { tab?: "course" | "badge" };

export type Context = GetServerSidePropsContext & {
  query: Query;
};

export type BadgeStatusList = Exclude<
  Awaited<
    ReturnType<typeof chilowalletClient.badge.status.list.$get>
  >["lms_badge_list"],
  undefined
>;

type ErrorProps = {
  title: string;
  statusCode: number;
};

export type Props = {
  tab: "course" | "badge";
  badgeStatusList: BadgeStatusList;
};

export async function getServerSideProps({
  req,
  query: { tab = "course" },
}: Context): Promise<GetServerSidePropsResult<ErrorProps | Props>> {
  try {
    const badgeStatusList = await chilowalletClient.badge.status.list.$get({
      config: {
        headers: {
          Cookie: `session_cookie=${req.cookies.session_cookie ?? JWT_DEBUG_VALUE}`,
        },
      },
    });
    return {
      props: {
        tab,
        badgeStatusList:
          // @ts-expect-error https://github.com/npocccties/chilowallet/issues/92
          badgeStatusList.user_badgestatuslist.lms_badge_list ?? [],
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
        <title>{title("ダッシュボード")}</title>
        <meta property="og:title" content={title("ダッシュボード")} />
      </Head>
      <Template {...props} />
    </>
  );
}
