import { useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import Breadcrumbs from "components/Breadcrumbs";
import Container from "components/Container";
import KnowledgeBadgesItem from "components/KnowledgeBadgesItem";
import WisdomBadgesDialog from "components/WisdomBadgesDialog";
import { Props } from "pages/wisdom_badges/[wisdomBadgesId]";
import { pagesPath } from "lib/$path";
import useDialog from "lib/use-dialog";
import CriteriaVideo from "public/criteria-video.svg";
import CriteriaTest from "public/criteria-test.svg";
import CriteriaSurvey from "public/criteria-survey.svg";
import CriteriaLesson from "public/criteria-lesson.svg";
import { getImageUrl } from "lib/issuer";
import Category from "public/category.svg";

export default function WisdomBadges({
  wisdomBadges,
  knowledgeBadgesList,
}: Props) {
  const [isCopied, setIsCopied] = useState(false);
  const handleClickCopy = () => {
    navigator.clipboard.writeText(document.location.href);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };
  const { open, onOpen, onClose } = useDialog();
  const url = getImageUrl(wisdomBadges.issuer_url);

  return (
    <Container
      className="md:grid gap-6 grid-cols-[auto_1fr]"
      style={{
        gridTemplateAreas: "'breadcrumbs breadcrumbs' 'aside article'",
      }}
    >
      <Breadcrumbs
        className="mb-10 md:mb-6 [grid-area:breadcrumbs]"
        nodes={[
          { name: "トップ", href: pagesPath.$url() },
          {
            name: "コースを探す",
            href: pagesPath.discover.$url({ query: {} }),
          },
        ]}
        leaf={wisdomBadges.name}
      />
      <aside className="shrink-0 flex flex-col items-center [grid-area:aside] mb-6 md:mb-0 lg:mr-4">
        <Image
          className="shrink-0 w-7/12 max-w-[260px] md:w-[40vw] md:max-w-[280px] lg:max-w-[320px]"
          src={`/images/${wisdomBadges.image}`}
          width={320}
          height={320}
          alt=""
        />
      </aside>
      <article className="[grid-area:article]">
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
            {wisdomBadges.name}
          </h1>
          <ul className="flex items-center gap-4 mb-2">
            <li className="flex items-center gap-1 font-bold">
              {/* eslint-disable @next/next/no-img-element */}
              {/*
        NOTE: 事前に許可したホスト以外画像最適化の対象にできない
        See Also: https://nextjs.org/docs/messages/next-image-unconfigured-host
      */}
              {typeof url === "string" && (
                <img
                  className="rounded-xl bg-white object-contain p-1 size-[34px]"
                  src={url}
                  width={34}
                  height={34}
                  alt=""
                />
              )}
              {wisdomBadges.issuer_name}
            </li>
            <li className="flex items-center gap-1 text-sm font-bold">
              <Category className="text-base" />
              {wisdomBadges.portal_category_name}
            </li>
          </ul>
          <ul className="flex items-center gap-1 mb-4">
            <li className="text-gray-700 text-sm">
              <span className="mr-2">
                バッジ取得条件
                <span className="mx-1" aria-hidden>
                  :
                </span>
                {knowledgeBadgesList.length}
                スタンプ
              </span>
            </li>
            <li>
              <button className="jumpu-text-button text-sm" onClick={onOpen}>
                認定している教育委員会を見る
              </button>
            </li>
          </ul>
        </header>
        <WisdomBadgesDialog
          wisdomBadges={wisdomBadges}
          open={open}
          onClose={onClose}
        />
        <p className="text-gray-700 mb-2.5">{wisdomBadges.description}</p>
        <div className="flex justify-end mb-4">
          <button
            className="jumpu-button text-sm bg-gray-50 text-gray-600"
            onClick={handleClickCopy}
          >
            <Icon
              className="inline text-xl mr-2"
              icon="clarity:copy-to-clipboard-line"
            />
            <span>このURLをコピー</span>
            {isCopied && (
              <Icon
                className="inline text-xl text-success ml-2"
                icon="fa6-solid:check"
                role="status"
                aria-label="コピーしました"
              />
            )}
          </button>
        </div>
        <div className="flex justify-center mb-10">
          <a
            className="jumpu-button px-8 py-4 mx-auto text-center text-xl font-bold"
            href={wisdomBadges.alignments_targeturl}
            rel="noreferrer noopener"
          >
            このコースを受講してバッジを取得する
          </a>
        </div>
        <section className="relative py-6 border-2 border-gray-200">
          <svg
            viewBox="-1 -1 31 16"
            width={31}
            height={16}
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full"
          >
            <polyline
              className="fill-white stroke-gray-200"
              strokeWidth={2}
              points="0,15 15,0 30,15"
            />
          </svg>
          <header className="px-6 mb-6">
            <h2 className="text-sm text-gray-600">バッジの取得条件</h2>
            <p className="text-xl mb-2">
              以下の{knowledgeBadgesList.length}
              つの「スタンプ」をすべて取得してください
            </p>
          </header>
          <div className="flex pt-6 pb-6 mb-2 mx-6 px-6 rounded-xl bg-gray-100">
            <Icon
              icon="mdi:lightbulb-on-10"
              className="text-3xl -translate-x-1/4 -translate-y-1/4"
            />
            <div className="flex-1">
              <p className="text-sm mb-2">
                スタンプを取得するため以下のような種類のコンテンツがあります。
              </p>
              <ul className="text-xs flex flex-wrap gap-x-6 gap-y-2">
                <li className="inline-flex items-center gap-x-1">
                  <CriteriaVideo className="inline" />
                  ビデオ
                </li>
                <li className="inline-flex items-center gap-x-1">
                  <CriteriaTest className="inline" />
                  小テスト
                </li>
                <li className="inline-flex items-center gap-x-1">
                  <CriteriaSurvey className="inline" />
                  アンケート
                </li>
                <li className="inline-flex items-center gap-x-1">
                  <CriteriaLesson className="inline" />
                  レッスン
                </li>
              </ul>
            </div>
          </div>
          {knowledgeBadgesList.map((knowledgeBadges) => (
            <KnowledgeBadgesItem
              className="mb-4 px-6"
              key={knowledgeBadges.badges_id}
              knowledgeBadges={knowledgeBadges}
            />
          ))}
        </section>
      </article>
    </Container>
  );
}
