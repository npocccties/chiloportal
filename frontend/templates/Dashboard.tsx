import Breadcrumbs from "components/Breadcrumbs";
import Container from "components/Container";
import CurrentCourse from "components/CurrentCourse";
import EarnedBadge from "components/EarnedBadge";
import { pagesPath } from "lib/$path";
import Link from "next/link";
import { Props } from "pages/dashboard";
import { useState } from "react";
import {
  NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_CHILOWALLET_BASE_URL,
} from "lib/env";

function CurrentCourses(props: Pick<Props, "currentCourses">) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
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
          className="jumpu-button text-lg font-bold w-full"
          type="submit"
          disabled={selected.size === 0}
        >
          {selected.size > 1 && `${selected.size} 件の`}バッジを獲得
        </button>
      </div>
    </form>
  );
}

function EarnedBadges(props: Pick<Props, "earnedBadges">) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const backUrl = new URL("/dashboard?tab=course", NEXT_PUBLIC_BASE_URL).href;
  const submitUrl = new URL(
    `/badge/submission?back_url=${encodeURIComponent(backUrl)}`,
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
          className="jumpu-button text-lg font-bold w-full"
          type="submit"
          disabled={selected.size === 0}
        >
          {selected.size > 1 && `${selected.size} 件の`}バッジを提出
        </button>
      </div>
    </form>
  );
}

function Dashboard({
  tab,
  currentCourses,
  earnedBadges,
  errorCode: _errorCode,
}: Props) {
  return (
    <Container>
      <Breadcrumbs
        className="mb-6"
        nodes={[{ name: "トップ", href: pagesPath.$url() }]}
        leaf="ダッシュボード"
      />
      <h1 className="text-3xl font-bold mb-8 border-b border-gray-300 pb-2">
        ダッシュボード
      </h1>
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
              獲得したバッジ
            </Link>
          </li>
        </ul>
      </nav>
      <article className="h-[66svh] overflow-y-auto py-1">
        {tab === "course" && <CurrentCourses currentCourses={currentCourses} />}
        {tab === "badge" && <EarnedBadges earnedBadges={earnedBadges} />}
      </article>
    </Container>
  );
}

export default Dashboard;
