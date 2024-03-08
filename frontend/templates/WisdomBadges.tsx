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
            name: "学びを探す",
            href: pagesPath.discover.$url({ query: {} }),
          },
        ]}
        leaf={wisdomBadges.name}
      />
      <aside className="flex-shrink-0 flex flex-col items-center gap-1 [grid-area:aside] mb-6 md:mb-0 lg:mr-4">
        <Image
          className="w-7/12 max-w-[260px] md:w-[40vw] md:max-w-[280px] lg:max-w-[320px] mb-2"
          src={`/images/${wisdomBadges.image}`}
          width={320}
          height={320}
          alt=""
        />
        <div className="text-gray-700 text-base">能力バッジ</div>
      </aside>
      <article className="[grid-area:article]">
        <header className="flex gap-8 items-center mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {wisdomBadges.name}
            </h1>
            <p className="font-bold mb-2">
              {wisdomBadges.issuer_name}
              <span className="text-gray-500 text-xs flex-shrink-0 ml-2">
                発行
              </span>
            </p>
            <p className="text-gray-700 text-sm mb-4">
              <span className="mr-2">
                全{knowledgeBadgesList.length}バッジ
                <span className="mx-1" aria-hidden>
                  ／
                </span>
                計
                {
                  knowledgeBadgesList.flatMap((knowledgeBadges) =>
                    "length" in knowledgeBadges.detail
                      ? knowledgeBadges.detail
                      : [],
                  ).length
                }
                研修
              </span>
            </p>
            <button className="jumpu-outlined-button text-sm " onClick={onOpen}>
              認定している教育委員会を見る
            </button>
            <WisdomBadgesDialog
              wisdomBadges={wisdomBadges}
              open={open}
              onClose={onClose}
            />
          </div>
        </header>
        <p className="text-gray-700 mb-8">{wisdomBadges.description}</p>
        <div className="flex justify-start mb-4">
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
        <a
          className="jumpu-button inline-flex items-center py-4 mx-auto text-center text-xl font-bold mb-8"
          href={wisdomBadges.alignments_targeturl}
          rel="noreferrer noopener"
        >
          この科目を受講してバッジを取得する
          <Icon className="inline ml-4" icon="fa6-solid:chevron-right" />
        </a>
        <section className="relative py-6 border-2 border-primary-300">
          <svg
            viewBox="-1 -1 31 16"
            width={31}
            height={16}
            className="absolute top-0 left-4 -translate-y-full"
          >
            <polyline
              className="fill-white stroke-primary-300"
              strokeWidth={2}
              points="0,15 15,0 30,15"
            />
          </svg>
          <header className="px-6 mb-6">
            <h2 className="font-bold mb-2 text-gray-600">バッジの取得条件</h2>
            <p className="text-2xl font-bold text-primary-700 mb-2">
              以下の{knowledgeBadgesList.length}
              つの「知識バッジ」をすべて習得してください
            </p>
          </header>
          <div className="flex pt-6 pb-6 mb-4 mx-6 px-6 rounded-xl bg-gray-800">
            <Icon
              icon="mdi:lightbulb-on-10"
              className="text-warning text-3xl -translate-x-1/4 -translate-y-1/4"
            />
            <div className="flex-1">
              <p className="text-sm mb-2 text-warning">
                知識バッジを取得するため以下のような種類のコンテンツがあります。
              </p>
              <ul className="text-xs flex flex-wrap gap-x-6 gap-y-2 text-warning">
                <li className="inline-flex items-center gap-x-1">
                  <CriteriaVideo className="inline fill-warning" />
                  ビデオ
                </li>
                <li className="inline-flex items-center gap-x-1">
                  <CriteriaTest className="inline fill-warning" />
                  小テスト
                </li>
                <li className="inline-flex items-center gap-x-1">
                  <CriteriaSurvey className="inline fill-warning" />
                  アンケート
                </li>
                <li className="inline-flex items-center gap-x-1">
                  <CriteriaLesson className="inline fill-warning" />
                  レッスン
                </li>
              </ul>
            </div>
          </div>
          {knowledgeBadgesList.map((knowledgeBadges) => (
            <KnowledgeBadgesItem
              className="mb-6 px-6"
              key={knowledgeBadges.badges_id}
              knowledgeBadges={knowledgeBadges}
            />
          ))}
        </section>
      </article>
    </Container>
  );
}
