import clsx from "clsx";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/future/image";
import { Props } from "pages";
import { pagesPath } from "lib/$path";
import useConsumers from "lib/use-consumers";
import usePortalCategories from "lib/use-portal-categories";

export default function Top({
  posts,
  recommendedWisdomBadgesList,
  learningContents,
}: Props) {
  const { data: consumers } = useConsumers();
  const { data: _ } = usePortalCategories();
  const [keyword, setKeyword] = useState("");
  const router = useRouter();
  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    router.push(pagesPath.search.$url({ query: { q: keyword } }));
  };
  return (
    <>
      <header className="relative mb-16 h-96 overflow-hidden">
        <div className="absolute z-10 top-1/4 left-1/2 -translate-x-1/2">
          <p className="mb-6 text-white font-bold text-3xl sm:text-4xl whitespace-nowrap">
            このポータルが与える価値、
            <br />
            ミッションとは
          </p>
          <form>
            <input
              className="jumpu-input mr-2"
              type="search"
              name="q"
              placeholder="学びたいキーワード"
              onInput={handleInput}
            />
            <button
              className="jumpu-button"
              type="submit"
              onClick={handleClick}
            >
              検索
            </button>
          </form>
        </div>
        <Image src="/top.png" alt="" fill style={{ objectFit: "cover" }} />
      </header>
      <article className="max-w-4xl mx-auto mb-16 px-4">
        <section className="mb-6">
          <div className="flex items-center mb-4">
            <h2 className="flex-1 text-2xl text-gray-700">
              OKUTEPからのおしらせ
            </h2>
            <Link href={pagesPath.posts.$url()}>
              <a className="underline">一覧を見る</a>
            </Link>
          </div>
          <div className="jumpu-card px-4 py-6">
            <ul className="list-disc pl-8 text-gray-700">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link href={pagesPath.posts._slug(post.slug).$url()}>
                    <a className="underline">{post.title}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section className="mb-6">
          <p className="mb-2">はじめての方におすすめ</p>
          <h2 className="text-2xl text-gray-700 mb-2">
            少ない回数で能力バッジを獲得しましょう
          </h2>
          <p className="mb-4">
            あなたが認められる能力バッジを獲得するために、いくつかの知識バッジを得なければなりません。少ない知識バッジで獲得できる能力バッジがあります。
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl text-gray-700 mb-2">
            カテゴリから能力バッジを探しましょう
          </h2>
        </section>
        <section className="jumpu-card px-4 py-6 mb-6">
          <h2 className="text-2xl text-gray-700 mb-4">育成指標から探す</h2>
          <ul
            className={clsx({
              ["list-disc pl-8 text-gray-700 md:columns-2 lg:columns-3"]:
                consumers,
            })}
            aria-busy={!consumers}
          >
            {consumers ? (
              consumers.map((consumer) => (
                <li key={consumer.consumer_id} className="break-inside-avoid">
                  <Link
                    href={pagesPath.consumers
                      ._consumerId(consumer.consumer_id)
                      .$url()}
                  >
                    <a className="underline">{consumer.name}の育成指標</a>
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
      </article>
    </>
  );
}
