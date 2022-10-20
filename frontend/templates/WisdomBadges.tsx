import { useState } from "react";
import Image from "next/future/image";
import { Icon } from "@iconify/react";
import Breadcrumbs from "components/Breadcrumbs";
import Container from "components/Container";
import KnowledgeBadgesItem from "components/KnowledgeBadgesItem";
import WisdomBadgesDialog from "components/WisdomBadgesDialog";
import { Props } from "pages/wisdom_badges/[wisdomBadgesId]";
import { pagesPath } from "lib/$path";
import useDialog from "lib/use-dialog";

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
    <Container className="max-w-6xl" as="article">
      <Breadcrumbs
        className="mb-6"
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
      <header className="flex gap-8 items-center mb-6">
        <div className="flex-shrink-0 flex flex-col items-center gap-1">
          <Image
            className="rounded-2xl"
            src={`/images/${wisdomBadges.image}`}
            width={100}
            height={100}
            alt=""
          />
          <div className="jumpu-tag">能力バッジ</div>
        </div>
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
          <button className="jumpu-text-button text-sm -ml-4" onClick={onOpen}>
            認定している教育委員会の育成指標を見る
          </button>
          <WisdomBadgesDialog
            wisdomBadges={wisdomBadges}
            open={open}
            onClose={onClose}
          />
        </div>
      </header>
      <p className="text-gray-700 mb-12">{wisdomBadges.description}</p>
      <div className="flex items-center gap-4 flex-wrap mb-12">
        <section className="flex items-center gap-4 flex-wrap px-4 py-3 rounded-xl bg-rose-50">
          <h2 className="text-sm text-gray-600">バッジの取得条件</h2>
          <p className="text-gray-700">
            以下の{knowledgeBadgesList.length}
            つの「知識バッジ」をすべて習得してください
          </p>
          {/* TODO: コースの URL を設定して */}
          <a className="jumpu-button" target="_blank" rel="noreferrer noopener">
            コースに進んでバッジを取得する
          </a>
        </section>
        <button
          className="jumpu-button text-sm bg-gray-100 text-gray-600"
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
      {knowledgeBadgesList.map((knowledgeBadges) => (
        <KnowledgeBadgesItem
          className="mb-6"
          key={knowledgeBadges.badges_id}
          knowledgeBadges={knowledgeBadges}
        />
      ))}
    </Container>
  );
}
