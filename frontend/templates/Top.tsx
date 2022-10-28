import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import { Props } from "pages";
import { pagesPath } from "lib/$path";
import useConsumers from "lib/use-consumers";
import usePortalCategories from "lib/use-portal-categories";
import useBadges from "lib/use-badges";
import Container from "components/Container";
import WisdomBadgesCard from "components/WisdomBadgesCard";
import PortalCategoryCard from "components/PortalCategoryCard";
import SearchForm from "components/SearchForm";

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
      <header className="relative mb-16 h-96 overflow-hidden">
        <div className="absolute z-10 top-1/4 left-1/2 -translate-x-1/2">
          <p className="mb-8 text-white font-bold text-3xl sm:text-4xl whitespace-nowrap">
            このポータルが与える価値、
            <br />
            ミッションとは
          </p>
          <SearchForm />
        </div>
        <Image src="/top.png" alt="" fill style={{ objectFit: "cover" }} />
      </header>
      <Container as="article">
        <section className="mb-8">
          <div className="flex items-center mb-4">
            <h2 className="flex-1 text-2xl text-gray-700">
              OKUTEPからのおしらせ
            </h2>
            <Link href={pagesPath.posts.$url()} className="underline">
              一覧を見る
            </Link>
          </div>
          <div className="jumpu-card px-4 py-6">
            <ul className="list-disc pl-8 text-gray-700">
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
          <p className="mb-2">はじめての方におすすめ</p>
          <h2 className="text-2xl text-gray-700 mb-2">
            少ない回数で能力バッジを獲得しましょう
          </h2>
          <p className="mb-4">
            あなたが認められる能力バッジを獲得するために、いくつかの知識バッジを得なければなりません。少ない知識バッジで獲得できる能力バッジがあります。
          </p>
          <ul className="grid grid-cols-[repeat(auto-fill,275px)] gap-4">
            {!wisdomBadgesListError && wisdomBadgesList
              ? wisdomBadgesList.map((wisdomBadges) => (
                  <li key={wisdomBadges.badges_id}>
                    <WisdomBadgesCard wisdomBadges={wisdomBadges} />
                  </li>
                ))
              : [...Array(3)].map((_, index) => (
                  <li
                    key={index}
                    className="animate-pulse bg-gray-300 h-72 rounded-lg"
                  />
                ))}
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl text-gray-700 mb-6">
            カテゴリから能力バッジを探しましょう
          </h2>
          <ul className="grid grid-cols-[repeat(auto-fill,275px)] gap-4">
            {!portalCategoriesError && portalCategories
              ? portalCategories.map((portalCategory) => (
                  <li key={portalCategory.portal_category_id}>
                    <PortalCategoryCard portalCategory={portalCategory} />
                  </li>
                ))
              : [...Array(3)].map((_, index) => (
                  <li
                    key={index}
                    className="animate-pulse bg-gray-300 h-72 rounded-lg"
                  />
                ))}
          </ul>
        </section>
        <section className="jumpu-card px-4 py-6 mb-8">
          <h2 className="text-2xl text-gray-700 mb-4">育成指標から探す</h2>
          <ul
            className={clsx({
              ["list-disc pl-8 text-gray-700 md:columns-2 lg:columns-3"]:
                consumers,
            })}
            aria-busy={!consumers}
          >
            {!consumersError && consumers ? (
              consumers.map((consumer) => (
                <li key={consumer.consumer_id} className="break-inside-avoid">
                  <Link
                    href={pagesPath.consumers
                      ._consumerId(consumer.consumer_id)
                      .$url()}
                    className="underline"
                  >
                    {consumer.name}の育成指標
                  </Link>
                </li>
              ))
            ) : (
              <li className="flex justify-center items-center h-24" aria-hidden>
                <div className="jumpu-spinner">
                  <svg viewBox="24 24 48 48">
                    <circle cx="48" cy="48" r="16" />
                  </svg>
                </div>
              </li>
            )}
          </ul>
        </section>
        <section>
          <h2 className="text-2xl text-gray-700 mb-4">その他のコンテンツ</h2>
          <ul className="list-disc pl-8 text-gray-700 md:columns-2 lg:columns-3">
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
