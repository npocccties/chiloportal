import clsx from "clsx";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Props } from "pages";
import { pagesPath } from "lib/$path";
import useConsumers from "lib/use-consumers";
import usePortalCategories from "lib/use-portal-categories";
import useBadges from "lib/use-badges";
import Container from "components/Container";
import WisdomBadgesCard from "components/WisdomBadgesCard";
import PortalCategoryCard from "components/PortalCategoryCard";
import Fallback from "components/Fallback";

export default function Top({
  posts,
  recommendedWisdomBadgesIds,
  learningContents,
}: Props) {
  const { data: consumers, error: consumersError } = useConsumers();
  const { data: portalCategories, error: portalCategoriesError } =
    usePortalCategories();
  const { data: wisdomBadgesList, error: wisdomBadgesListError } = useBadges(
    "wisdom",
    recommendedWisdomBadgesIds
  );
  return (
    <>
      <Container className="max-w-5xl mt-8" as="article">
        <header className="mb-8">
          <Link
            href={pagesPath._slug("concept").$url()}
            className="flex gap-4 items-center px-6 py-3 rounded-xl border-2 border-primary-500 mb-4 hover:bg-primary-50"
          >
            <Icon className="text-primary-500 text-xl" icon="fa6-solid:bell" />
            <span className="text-sm text-primary-700">
              <span className="text-gray-700 mr-1">初めての方へ</span>
              学べるしくみ - OKUTEPのコンセプト
            </span>
          </Link>
          <p className="text-sm text-gray-700 leading-7 mb-2">
            OKUTEPは誰もが自由に学べるオープンな学びの場です。
            <br />
            デジタルバッジ（※）は，あなたの自己実現のために活用できるデジタル証明書となります。
            <br />
            OKUTEPで学び続けることで、あなたのウェルビーイングを高め、子ども達が夢や希望を持てる社会の実現を目指します。
          </p>
          <p className="text-xs text-gray-700 mb-4">
            （※）デジタルバッジの取得は、提携する教育委員会に所属する教員のみとなります。詳しくは
            <Link
              className="text-primary-700 hover:underline"
              href={pagesPath._slug("concept").$url()}
            >
              こちら
            </Link>
            をご覧下さい。
          </p>
          <Link
            className="inline-block flex gap-2 items-center text-xs text-primary-700 hover:underline"
            href={pagesPath._slug("concept").$url()}
          >
            <span className="text-primary-700 underline">OKUTEPとは</span>
            <Icon className="text-base" icon="fa6-solid:arrow-right" />
          </Link>
        </header>
        <section className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-xl text-gray-700 font-bold">
              OKUTEPからのおしらせ
            </h2>
            <Link
              href={pagesPath.posts.$url()}
              className="text-xs text-primary-700 underline"
            >
              一覧を見る
            </Link>
          </div>
          <div className="rounded-xl bg-gray-50 px-4 py-3">
            <ul className="list-disc pl-8 text-primary-700 max-h-36 overflow-y-scroll leading-7">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={pagesPath.posts._slug(post.slug).$url()}
                    className="underline"
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section className="mb-8">
          <p className="text-sm text-gray-700 mb-2">はじめての方におすすめ</p>
          <h2 className="text-xl text-gray-700 font-bold mb-4">
            少ない回数で獲得できる能力バッジ
          </h2>
          <p className="text-sm text-gray-700 mb-4">
            あなたが認められる能力バッジを獲得するために、いくつかの知識バッジを得なければなりません。少ない知識バッジで獲得できる能力バッジがあります。
          </p>
          <ul className="flex snap-x overflow-x-scroll pb-2 md:pb-0 px-4 md:px-0 -mx-4 md:mx-0 md:grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            <Fallback
              data={wisdomBadgesList}
              error={wisdomBadgesListError}
              pending={[...Array(3)].map((_, index) => (
                <li
                  key={index}
                  className="animate-pulse bg-gray-300 h-72 rounded-lg"
                />
              ))}
            >
              {(data) =>
                data.map((wisdomBadges) => (
                  <li key={wisdomBadges.badges_id}>
                    <WisdomBadgesCard
                      className="h-full w-[300px] md:w-auto snap-center"
                      wisdomBadges={wisdomBadges}
                    />
                  </li>
                ))
              }
            </Fallback>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-xl text-gray-700 font-bold mb-6">
            カテゴリから探せる能力バッジ
          </h2>
          <ul className="md:grid md:grid-cols-2 xl:grid-cols-3">
            <Fallback
              data={portalCategories}
              error={portalCategoriesError}
              pending={[...Array(3)].map((_, index) => (
                <li key={index} className="animate-pulse bg-gray-300 h-72" />
              ))}
            >
              {(data) =>
                data.map((portalCategory) => (
                  <li
                    key={portalCategory.portal_category_id}
                    className="border-b last:border-b-0 md:border-b-0 md:border-t md:border-r border-gray-300 md:[&:nth-child(2n)]:border-r-0 xl:[&:nth-child(2n)]:border-r xl:[&:nth-child(3n)]:border-r-0 md:[&:nth-child(-n+2)]:border-t-0 xl:[&:nth-child(-n+3)]:border-t-0"
                  >
                    <PortalCategoryCard
                      className="h-full"
                      portalCategory={portalCategory}
                    />
                  </li>
                ))
              }
            </Fallback>
          </ul>
        </section>
        <section className="jumpu-card p-6 mb-8">
          <h2 className="text-xl text-gray-700 font-bold mb-2">
            教員育成指標から探せる能力バッジ
          </h2>
          <p className="text-sm text-gray-700 mb-3">
            「教員育成指標」とは地域の教育委員会が教員に求められる資質や能力を、キャリア（経験年数）毎に明確にしたものです。
          </p>
          <ul
            className={clsx({
              ["list-disc pl-6 text-primary-700 md:columns-2 lg:columns-3"]:
                consumers,
            })}
            aria-busy={!consumers}
          >
            <Fallback
              data={consumers}
              error={consumersError}
              pending={
                <li
                  className="flex justify-center items-center h-24"
                  aria-hidden
                >
                  <div className="jumpu-spinner">
                    <svg viewBox="24 24 48 48">
                      <circle cx="48" cy="48" r="16" />
                    </svg>
                  </div>
                </li>
              }
            >
              {(data) =>
                data.map((consumer) => (
                  <li key={consumer.consumer_id} className="break-inside-avoid">
                    <Link
                      href={pagesPath.consumers
                        ._consumerId(consumer.consumer_id)
                        .$url()}
                      className="underline"
                    >
                      {consumer.name}の教員育成指標
                    </Link>
                  </li>
                ))
              }
            </Fallback>
          </ul>
        </section>
        <section>
          <h2 className="text-xl text-gray-700 font-bold mb-4">
            その他のコンテンツ
          </h2>
          <p className="text-gray-700 mb-4">
            バッジは取得できませんが、以下のコンテンツも提供しています。
          </p>
          <ul className="list-disc pl-8 text-primary-700 md:columns-2 lg:columns-3">
            {learningContents.map((learningContent, index) => (
              <li key={index} className="break-inside-avoid">
                <a
                  className="underline"
                  href={learningContent.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {learningContent.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </>
  );
}
