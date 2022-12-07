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
      className="max-w-6xl md:grid gap-8 grid-cols-[auto_1fr]"
      style={{
        gridTemplateAreas: "'breadcrumbs breadcrumbs' 'aside article'",
      }}
    >
      <Breadcrumbs
        className="mb-6 [grid-area:breadcrumbs]"
        nodes={[
          { name: "トップ", href: pagesPath.$url() },
          {
            name: wisdomBadges.portal_category_name,
            href: pagesPath.portal_categories
              ._portalCategoryId(wisdomBadges.portal_category_id)
              .$url({ query: {} }),
          },
        ]}
        leaf={wisdomBadges.name}
      />
      <aside className="flex-shrink-0 flex flex-col items-center gap-1 [grid-area:aside] mb-6 md:mb-0">
        <Image
          className="max-w-[214px] md:w-[20vw] md:max-w-[152px] lg:max-w-[320px] mb-2"
          src={`/images/${wisdomBadges.image}`}
          width={320}
          height={320}
          alt=""
        />
        <div className="jumpu-tag cursor-auto bg-white text-base border border-gray-300">
          能力バッジ
        </div>
      </aside>
      <article className="[grid-area:article]">
        <header className="flex gap-8 items-center mb-6">
          <div>
            <h1 className="text-4xl text-gray-700 mb-2">{wisdomBadges.name}</h1>
            <p className="font-bold mb-2">{wisdomBadges.issuer_name}</p>
            <p className="text-gray-700 text-sm">
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
                      : []
                  ).length
                }
                研修
              </span>
            </p>
            <button
              className="jumpu-text-button text-sm -ml-4"
              onClick={onOpen}
            >
              認定している教育委員会の教員育成指標を見る
            </button>
            <WisdomBadgesDialog
              wisdomBadges={wisdomBadges}
              open={open}
              onClose={onClose}
            />
          </div>
        </header>
        <p className="text-gray-700 mb-8">{wisdomBadges.description}</p>
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
                className="inline text-xl text-success  ml-2"
                icon="fa6-solid:check"
                role="status"
                aria-label="コピーしました"
              />
            )}
          </button>
        </div>
        <a
          className="jumpu-button py-4 w-full text-center font-bold mb-8"
          href={wisdomBadges.alignments_targeturl}
          target="_blank"
          rel="noreferrer noopener"
        >
          この科目を受講してバッジを取得する
        </a>
        <section className="relative p-6 border border-2 border-primary-300">
          <svg
            viewBox="-1 -1 31 16"
            width={31}
            height={16}
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full"
          >
            <polyline
              className="fill-white stroke-primary-300"
              strokeWidth={2}
              points="0,15 15,0 30,15"
            />
          </svg>
          <h2 className="text-sm text-gray-600">バッジの取得条件</h2>
          <p className="text-lg text-primary-700 mb-2">
            以下の{knowledgeBadgesList.length}
            つの「知識バッジ」をすべて習得してください
          </p>
          <div className="flex p-4 pt-6 pl-6 rounded-xl bg-primary-50 mb-4">
            <Icon
              icon="mdi:lightbulb-on-10"
              className="text-primary-700 text-3xl -translate-x-1/4 -translate-y-1/4"
            />
            <div className="flex-1">
              <p className="text-sm text-primary-700 mb-2">
                知識バッジを取得するため以下のような種類のコンテンツがあります。
              </p>
              <ul className="text-xs text-primary-700">
                <li className="inline-flex items-center mr-3">
                  <CriteriaVideo className="inline fill-primary-700 mr-1" />
                  ビデオ
                </li>
                <li className="inline-flex items-center mr-3">
                  <CriteriaTest className="inline fill-primary-700 mr-1" />
                  小テスト
                </li>
                <li className="inline-flex items-center mr-3">
                  <CriteriaSurvey className="inline fill-primary-700 mr-1" />
                  アンケート
                </li>
                <li className="inline-flex items-center">
                  <CriteriaLesson className="inline fill-primary-700 mr-1" />
                  レッスン
                </li>
              </ul>
            </div>
          </div>
          {knowledgeBadgesList.map((knowledgeBadges) => (
            <KnowledgeBadgesItem
              className="mb-6"
              key={knowledgeBadges.badges_id}
              knowledgeBadges={knowledgeBadges}
            />
          ))}
        </section>
      </article>
    </Container>
  );
}
