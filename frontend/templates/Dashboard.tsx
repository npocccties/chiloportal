import { Icon } from "@iconify/react";
import Breadcrumbs from "components/Breadcrumbs";
import Container from "components/Container";
import CurrentCourse from "components/CurrentCourse";
import EarnedBadge from "components/EarnedBadge";
import { pagesPath } from "lib/$path";
import {
  NEXT_PUBLIC_BADGE_ANALYSIS_URL,
  NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_CHILOWALLET_BASE_URL,
  NEXT_PUBLIC_SHIBBOLETH_SP_LOGIN_URL,
} from "lib/env";
import useUserAttributes from "lib/use-user-attributes";
import Link from "next/link";
import { Props } from "pages/dashboard";
import { useState } from "react";

function Empty() {
  return (
    <p className="jumpu-card pl-4 pr-6 py-3 bg-primary-50 mb-2 flex gap-3 items-center">
      <Icon className="inline text-2xl" icon="mdi:information-outline" />
      <span className="flex-1">
        あなたのダッシュボードでは、受講中のコースと取得したバッジが確認できます。
        <br />
        <Link
          className="underline"
          href={pagesPath.discover.$url({ query: {} })}
        >
          コースを探す
        </Link>
        から受講したいコースを探しましょう。
      </span>
    </p>
  );
}

function CurrentCourses(props: Pick<Props, "currentCourses">) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  if (props.currentCourses.length === 0) return <Empty />;
  const backUrl = new URL("/dashboard?tab=course", NEXT_PUBLIC_BASE_URL).href;
  const importUrl = new URL(
    `/badge/import?back_url=${encodeURIComponent(backUrl)}`,
    NEXT_PUBLIC_CHILOWALLET_BASE_URL,
  ).href;
  const badgeStatusList = [];
  for (const index of selected) {
    const item = props.currentCourses[index];
    if (!item) continue;
    badgeStatusList.push(item);
  }
  return (
    <form
      className="space-y-2"
      action={importUrl}
      method="POST"
      autoComplete="off"
    >
      {props.currentCourses.map((currentCourse, index) => (
        <CurrentCourse
          {...currentCourse}
          key={index}
          index={index}
          onChecked={(index) => setSelected((prev) => new Set(prev.add(index)))}
          onUnchecked={(index) =>
            setSelected((prev) => {
              const selected = new Set(prev);
              selected.delete(index);
              return selected;
            })
          }
        />
      ))}
      <input
        name="post_json"
        type="hidden"
        value={JSON.stringify({ badge_list: badgeStatusList })}
      />
      <div className="sticky bottom-0 p-2">
        <button
          className="jumpu-button text-lg font-bold w-full not-disabled:cursor-pointer"
          type="submit"
          disabled={selected.size === 0}
        >
          {selected.size > 1 && `${selected.size} 件の`}バッジを取得
        </button>
      </div>
    </form>
  );
}

function EarnedBadges(props: Pick<Props, "earnedBadges">) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  if (props.earnedBadges.length === 0) return <Empty />;
  const backUrl = new URL("/dashboard?tab=badge", NEXT_PUBLIC_BASE_URL).href;
  const submitUrl = new URL(
    `/submission?back_url=${encodeURIComponent(backUrl)}`,
    NEXT_PUBLIC_CHILOWALLET_BASE_URL,
  ).href;
  const badgeStatusList = [];
  for (const index of selected) {
    const item = props.earnedBadges[index];
    if (!item) continue;
    badgeStatusList.push(item);
  }
  return (
    <form
      className="space-y-2"
      action={submitUrl}
      method="POST"
      autoComplete="off"
    >
      {props.earnedBadges.map((earnedBadge, index) => (
        <EarnedBadge
          {...earnedBadge}
          key={index}
          index={index}
          onChecked={(index) => setSelected((prev) => new Set(prev.add(index)))}
          onUnchecked={(index) =>
            setSelected((prev) => {
              const selected = new Set(prev);
              selected.delete(index);
              return selected;
            })
          }
        />
      ))}
      <input
        name="post_json"
        type="hidden"
        value={JSON.stringify({ badge_list: badgeStatusList })}
      />
      <div className="sticky bottom-0 p-2">
        <button
          className="jumpu-button text-lg font-bold w-full not-disabled:cursor-pointer"
          type="submit"
          disabled={selected.size === 0}
        >
          {selected.size > 1 && `${selected.size} 件の`}バッジを提出
        </button>
      </div>
    </form>
  );
}

function Content({
  tab,
  currentCourses,
  earnedBadges,
}: Omit<Props, "errorCode" | "posts">) {
  const { data, isLoading } = useUserAttributes();
  if (!data && !isLoading)
    return (
      <p className="jumpu-card pl-4 pr-6 py-3 bg-primary-50 mb-2 flex gap-3 items-center">
        <Icon className="inline text-2xl" icon="mdi:information-outline" />
        <span className="flex-1">
          あなたのダッシュボードでは、受講中のコースと取得したバッジが確認できます。
          <br />
          <a className="underline" href={NEXT_PUBLIC_SHIBBOLETH_SP_LOGIN_URL}>
            ログイン
          </a>
          してください。
        </span>
      </p>
    );
  if (tab === "course")
    return <CurrentCourses currentCourses={currentCourses} />;
  return <EarnedBadges earnedBadges={earnedBadges} />;
}

function Dashboard({
  tab,
  currentCourses,
  earnedBadges,
  errorCode,
  posts,
}: Props) {
  const { data } = useUserAttributes();
  return (
    <Container
      className="md:grid gap-x-10"
      style={{
        gridTemplateAreas: `
        "breadcrumbs breadcrumbs"
        "h1 h1"
        "content side"
    `,
      }}
    >
      <Breadcrumbs
        className="mb-6 [grid-area:breadcrumbs]"
        nodes={[{ name: "トップ", href: pagesPath.$url() }]}
        leaf="あなたのダッシュボード"
      />
      <h1 className="[grid-area:h1] text-3xl font-bold mb-8 border-b border-gray-300 pb-2">
        {data && `${data.displayName} さんの`}ダッシュボード
      </h1>
      <div className="[grid-area:content]">
        <nav className="jumpu-boxed-tabs mb-4">
          {/* TODO: jumpu-boxed-tabs が navigation role に対応したら追従して */}
          <ul role="tablist">
            <li role="tab" aria-selected={tab === "course"}>
              <Link
                href={pagesPath.dashboard.$url({
                  query: {
                    tab: "course",
                  },
                })}
              >
                受講中のコース
              </Link>
            </li>
            <li role="tab" aria-selected={tab === "badge"}>
              <Link
                href={pagesPath.dashboard.$url({
                  query: {
                    tab: "badge",
                  },
                })}
              >
                取得したバッジ
              </Link>
            </li>
          </ul>
        </nav>
        <article className="max-h-[60svh] overflow-y-auto py-1 mb-6 md:mb-0">
          {errorCode && (
            <p className="jumpu-card pl-4 pr-6 py-3 bg-primary-50 mb-2 flex gap-3 items-center">
              <Icon
                className="inline text-2xl"
                icon="mdi:information-outline"
              />
              <span className="flex-1">
                {`一部のデータが取得できませんでした。（エラーコード：${errorCode}）`}
              </span>
            </p>
          )}
          <Content
            tab={tab}
            currentCourses={currentCourses}
            earnedBadges={earnedBadges}
          />
        </article>
      </div>
      <aside className="[grid-area:side] space-y-6 md:w-[33svw] md:max-w-100">
        <section>
          <h2 className="text-xl font-bold hover:underline underline-offset-4 mb-1">
            <Link href={pagesPath.posts.$url()}>お知らせ</Link>
          </h2>
          <div className="overflow-y-auto max-h-28">
            <ul className="list-disc ml-8 space-y-1 text-gray-700 underline">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={pagesPath.posts._slug(post.slug).$url()}
                    className="line-clamp-2"
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-1">マニュアル</h2>
          <ul className="list-disc ml-8 space-y-1 text-gray-700 underline">
            <li>
              <a href="https://help.o3edu.jp/lllp" target="_blank">
                OZONE_EDUマニュアル
              </a>
            </li>
            <li>
              <a href="https://help.o3edu.jp/wallet" target="_blank">
                バッジウォレットマニュアル
              </a>
            </li>
          </ul>
        </section>
        <a
          href={NEXT_PUBLIC_BADGE_ANALYSIS_URL}
          target="_blank"
          className="text-xl font-bold mb-1 hover:underline underline-offset-4"
        >
          バッジ分析
        </a>
      </aside>
    </Container>
  );
}

export default Dashboard;
