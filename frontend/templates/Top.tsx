import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
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
  const alt =
    "科目を選び、バッジを獲得することで社会的評価や自信の証明が得られ、あなたと子供達と社会のウェルビーイングへとつながります。この関係性は、学習成果の活用と主体的な学びの循環によって形成されます";
  return (
    <>
      <article className="mt-8">
        <header className="mb-8">
          <Link
            href={pagesPath._slug("concept").$url()}
            className="flex gap-4 items-center px-6 py-3 rounded-xl border-2 border-primary-500 mb-6 md:mb-12 hover:bg-primary-50 max-w-4xl mx-auto my-8"
          >
            <Icon className="text-primary-500 text-xl" icon="fa6-solid:bell" />
            <span className="text-sm text-primary-700">
              <span className="text-gray-700 mr-1">初めての方へ</span>
              学べるしくみ - OKUTEPのコンセプト
            </span>
          </Link>
          <h1 className="hidden md:block mb-6 text-primary-700 text-[2rem] text-center font-bold">
            <span className="text-4xl underline underline-offset-0 decoration-[#a6a63a]/20 decoration-8">
              自ら学び続けるすべての人々のために
            </span>
            <br />
            デジタルバッジであなたの学習成果を活用
          </h1>
          <Image
            className="hidden md:block mx-auto"
            src="/top-md.png"
            width={946}
            height={341}
            alt={alt}
          />
          <Image
            className="md:hidden mx-auto"
            src="/top.png"
            width={640}
            height={282}
            alt={alt}
          />
        </header>
        <section className="px-6 py-4 mb-8 rounded-xl border border-primary-200 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            OKUTEPは誰もが自由に学べるオープンな学びの場です。
          </h2>
          <p className="text-sm text-gray-700 leading-6 mb-3">
            デジタルバッジ（※）は，あなたの自己実現のために活用できるデジタル証明書となります。OKUTEPで学び続けることで、あなたのウェルビーイングを高め、子ども達が夢や希望を持てる社会の実現を目指します。
          </p>
          <p className="text-xs text-gray-700">
            （※）デジタルバッジの取得は、提携する教育委員会に所属する教員のみとなります。詳しくは
            <Link
              className="text-primary-700 hover:underline"
              href={pagesPath._slug("concept").$url()}
            >
              こちら
            </Link>
            をご覧下さい。
          </p>
        </section>
        <section className="mb-8 px-4 max-w-4xl mx-auto">
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
        <section className="py-8 bg-gray-200 bg-opacity-30 overflow-hidden before:block before:absolute before:w-4/12 before:top-0 before:h-full before:-skew-x-12 before:-right-16 before:bg-primary-700 relative before:-z-10">
          <div className="max-w-4xl m-auto mb-4 relative px-4">
            <p className=" text-gray-700 mb-2 font-bold">
              はじめての方におすすめ
            </p>
            <h2 className="text-3xl text-gray-700 font-bold mb-4">
              試しに受講してみる
            </h2>
            <p className="font-bold text-gray-700 mb-4">
              あなたが認められる能力バッジを獲得するために、いくつかの知識バッジを得なければなりません。
              <br />
              少ない知識バッジで獲得できる能力バッジがあります。
            </p>

            <Link
              className="text-primary-700 text-xs hover:underline whitespace-nowrap font-bold"
              href={pagesPath._slug("about_badges").$url()}
            >
              <Icon
                className="text-base inline mr-1"
                icon="fa6-regular:circle-question"
              />
              能力バッジとは？
            </Link>
          </div>
          <ul className="flex overflow-x-scroll px-4 py-4 gap-4 w-screen xl:mx-auto xl:justify-center ">
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
                  <li key={wisdomBadges.badges_id} className="xl:flex-1">
                    <WisdomBadgesCard
                      className="h-full w-[400px] md:w-[500px] xl:w-auto shadow-lg transition hover:ring-2 ring-primary-400"
                      wisdomBadges={wisdomBadges}
                    />
                  </li>
                ))
              }
            </Fallback>
          </ul>
        </section>
        <section className="pb-8 bg-gray-50">
          <header className="max-w-7xl mx-auto py-8 px-8 xl:px-4">
            <h2 className="text-3xl text-gray-700 font-bold mb-4 flex flex-wrap items-center gap-2">
              カテゴリから探せる能力バッジ
            </h2>
            <p className="font-bold text-gray-700 mb-4">
              学術的な観点をもとにして各自治体の教員育成指標も参考にしながら、オンライン学習で習得できる内容を「カテゴリ」として整理しました。
            </p>
            <Link
              className="text-primary-700 text-xs hover:underline whitespace-nowrap font-bold"
              href={pagesPath._slug("about_badges").$url()}
            >
              <Icon
                className="text-base inline mr-1"
                icon="fa6-regular:circle-question"
              />
              能力バッジとは？
            </Link>
          </header>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto gap-2 lg:gap-4 px-4 lg:px-4">
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
                    className="rounded-xl overflow-hidden shadow-lg transition hover:ring-2 ring-primary-400"
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
        <section className="bg-[url('/fig-search-index.svg')] bg-cyan-50 bg-[40%_100%]  bg-no-repeat bg-[length:1800px_180px]">
          <div className="max-w-7xl mx-auto pt-16 pb-40 md:pb-56 lg:pb-56 px-16 text-gray-700 ">
            <header className="mb-6">
              <h2 className="text-3xl font-bold mb-6">
                教員育成指標から探せる能力バッジ
              </h2>
              <p className="font-bold mb-4">
                「教員育成指標」とは地域の教育委員会が教員に求められる資質や能力を、キャリア（経験年数）毎に明確にしたものです。
              </p>
              <Link
                className="text-xs hover:underline whitespace-nowrap font-bold text-primary-700"
                href={pagesPath._slug("about_badges").$url()}
              >
                <Icon
                  className="text-base inline mr-1"
                  icon="fa6-regular:circle-question"
                />
                能力バッジとは？
              </Link>
            </header>
            <ul
              className={clsx({
                ["list-disc pl-6 md:columns-2 lg:columns-3"]: consumers,
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
                    <li
                      key={consumer.consumer_id}
                      className="break-inside-avoid mb-2"
                    >
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
          </div>
        </section>
        <section className="pb-16 bg-gray-50">
          <header className="p-12 max-w-6xl mx-auto">
            <h2 className="text-3xl text-gray-700 font-bold mb-4">
              その他のコンテンツ
            </h2>
            <p className="text-gray-700 font-bold">
              バッジは取得できませんが、以下のコンテンツも提供しています。
            </p>
          </header>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 px-12 max-w-6xl mx-auto">
            {learningContents.map((learningContent, index) => (
              <li
                key={index}
                className="rounded-xl bg-white overflow-hidden shadow-lg transition hover:ring-2 ring-primary-400"
              >
                <a
                  className="flex flex-col items-center justify-center px-6 py-4 "
                  href={learningContent.url}
                  rel="noopener noreferrer"
                >
                  <h3 className="text-xl mb-1">{learningContent.name}</h3>
                  {learningContent.type === "private" && (
                    <p className="text-center text-sm">（受講者限定教材）</p>
                  )}
                  <p className="mt-3 text-sm">{learningContent.description}</p>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </>
  );
}
