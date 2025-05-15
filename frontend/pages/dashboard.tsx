import {
  groupByEarnable,
  isCurrentCourse,
  isEarnedBadge,
  sortByDescendingAccessDateTime,
  sortByDescendingImportDateTime,
} from "lib/badge-status-list";
import { NEXT_PUBLIC_SHIBBOLETH_SP_LOGIN_URL } from "lib/env";
import { chilowalletClient, getErrorProps } from "lib/client";
import { JWT_DEBUG_VALUE } from "lib/env";
import title from "lib/title";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import Error from "next/error";
import Head from "next/head";
import Template from "templates/Dashboard";
import { readMarkdowns, Markdown } from "lib/markdown";
import { Post } from "schemas";

export type Query = { tab?: "course" | "badge" };

export type Context = GetServerSidePropsContext & {
  query: Query;
};

export type BadgeStatus = Exclude<
  Awaited<
    ReturnType<typeof chilowalletClient.badge.status.list.$get>
  >["lms_badge_list"],
  undefined
>[number];

export type BadgeStatusList = BadgeStatus[];

export type ErrorCode = Awaited<
  ReturnType<typeof chilowalletClient.badge.status.list.$get>
>["error_code"];

type ErrorProps = {
  title: string;
  statusCode: number;
};

export type Props = {
  tab: "course" | "badge";
  currentCourses: BadgeStatusList;
  earnedBadges: BadgeStatusList;
  errorCode?: ErrorCode;
  posts: Markdown<Post>["data"]["matter"][];
};

export async function getServerSideProps({
  req,
  query: { tab = "course" },
}: Context): Promise<GetServerSidePropsResult<ErrorProps | Props>> {
  try {
    const markdowns = await readMarkdowns({ type: "post", sort: true });
    if (markdowns instanceof globalThis.Error)
      return { props: { title: markdowns.message, statusCode: 500 } };
    const matters = markdowns.map((markdown) => markdown.data.matter);
    const cookie = req.cookies.session_cookie ?? JWT_DEBUG_VALUE;
    if (!cookie)
      return {
        redirect: {
          destination: NEXT_PUBLIC_SHIBBOLETH_SP_LOGIN_URL,
          permanent: false,
        },
      };
    const response = await chilowalletClient.badge.status.list.$get({
      config: {
        headers: {
          Cookie: `session_cookie=${cookie}`,
        },
      },
    });
    const badgeStatusList: BadgeStatusList =
      // @ts-expect-error https://github.com/npocccties/chilowallet/issues/92
      response.user_badgestatuslist.lms_badge_list ?? [];
    // @ts-expect-error https://github.com/npocccties/chilowallet/issues/92
    const errorCode: ErrorCode = response.user_badgestatuslist.error_code;
    const currentCourses = groupByEarnable(
      badgeStatusList
        .filter(isCurrentCourse)
        .toSorted(sortByDescendingAccessDateTime),
    );
    const earnedBadges = badgeStatusList
      .filter(isEarnedBadge)
      .toSorted(sortByDescendingImportDateTime);
    return {
      props: {
        tab,
        currentCourses: [
          ...(currentCourses.earnable ?? []),
          ...(currentCourses.unearnable ?? []),
        ],
        earnedBadges,
        errorCode,
        posts: matters,
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
