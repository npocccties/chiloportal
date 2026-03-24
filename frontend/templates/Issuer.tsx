import Link from "next/link";
import { Icon } from "@iconify/react";
import { pagesPath } from "lib/$path";
import { Props } from "pages/issuers/[issuerId]";
import Container from "components/Container";
import Breadcrumbs from "components/Breadcrumbs";
import Image from "next/image";
import LearningContents from "components/LearningContents";
import PostLink from "components/PostLink";
import { getImageUrl } from "lib/issuer";

export default function Issuer({
  issuerBadgesCount,
  portalCategories,
  portalCategoryBadgesCounts,
  issuer,
  posts,
  backgroundImage,
  learningContents,
}: Props) {
  const url = getImageUrl(issuer.url);
  return (
    <>
      <Breadcrumbs
        className="max-w-4xl mx-auto my-6 px-6 xl:px-0"
        nodes={[{ name: "ホーム", href: pagesPath.$url() }]}
        leaf={issuer.name}
      />
      <div className="relative h-72 w-full">
        <Image
          className="object-cover"
          src={backgroundImage ?? "/issuer-background-image-placeholder.png"}
          alt=""
          fill
        />
      </div>
      <Container className="relative">
        <header className="flex items-end gap-4 -mt-16 md:-mt-[7.5rem] mb-6 md:mb-10">
          {/* eslint-disable @next/next/no-img-element */}
          {/*
        NOTE: 事前に許可したホスト以外画像最適化の対象にできない
        See Also: https://nextjs.org/docs/messages/next-image-unconfigured-host
      */}
          {typeof url === "string" && (
            <img
              className="rounded-xl bg-white object-contain size-20 p-2 md:size-40 md:p-4"
              src={url}
              width={160}
              height={160}
              alt=""
            />
          )}
          <h1 className="text-xl md:text-3xl font-bold pb-0 md:pb-2 md:pl-4">
            {issuer.name}
          </h1>
        </header>
        <div
          className="md:grid gap-x-10 gap-y-6 grid-cols-2"
          style={{
            gridTemplateAreas: `
        "posts badges"
        "learningContents badges"
        `,
          }}
        >
          <section style={{ gridArea: "badges" }} className="mb-6 md:mb-0">
            <h2 className="flex gap-4 items-center text-base md:text-xl font-bold border-b-4 border-black pb-2 mb-4">
              <span className="inline-flex bg-black rounded-xl p-3">
                <Image src="/fig-badge.svg" alt="" width={20} height={20} />
              </span>
              {issuer.name}のコース
            </h2>
            <div className="jumpu-card px-8 py-6 mb-4">
              <p className="text-sm mb-6">
                {issuer.name}は現在、
                <br />
                <span className="text-6xl leading-snug font-bold">
                  {issuerBadgesCount}
                </span>
                <br />
                個のバッジを発行しています。
              </p>
              <h3 className="flex items-center gap-2 -ml-1 text-base text-gray-900 font-bold mb-3">
                <Image src="/category.svg" alt="" width={20} height={24} />
                カテゴリ
              </h3>
              <ul className="list-disc pl-1 text-sm text-gray-700 inline-flex flex-wrap gap-2 mb-6">
                {portalCategories.map((portalCateogry, index) => (
                  <li key={portalCateogry.portal_category_id} className="ml-3">
                    {portalCateogry.name}（{portalCategoryBadgesCounts[index]}
                    個）
                  </li>
                ))}
              </ul>
              <div className="flex justify-center">
                <Link
                  href={pagesPath.discover.$url({
                    query: {
                      by: "issuer",
                      issuer_id: String(issuer.issuer_id),
                    },
                  })}
                  className="jumpu-button font-bold"
                >
                  {issuer.name}のコース一覧を見る
                </Link>
              </div>
            </div>
          </section>
          <section style={{ gridArea: "posts" }} className="mb-6 md:mb-0">
            <h2 className="flex gap-4 items-center text-base md:text-xl font-bold border-b-4 border-black pb-2 mb-4">
              <span className="inline-flex bg-black rounded-xl p-3">
                <Icon className="text-white" icon="ion:newspaper-outline" />
              </span>
              {issuer.name}からのおしらせ
            </h2>
            <ul className="space-y-4">
              {posts.map((post) => (
                <li key={post.slug}>
                  <PostLink
                    post={post}
                    href={pagesPath.issuers
                      ._issuerId(issuer.issuer_id)
                      .posts._slug(post.slug)
                      .$url()}
                  />
                </li>
              ))}
            </ul>
          </section>
          <section style={{ gridArea: "learningContents" }}>
            <h2 className="flex gap-4 items-center text-base md:text-xl font-bold border-b-4 border-black pb-2 mb-4">
              <span className="inline-flex bg-black rounded-xl p-3">
                <Icon className="text-white" icon="ion:folder-open-outline" />
              </span>
              {issuer.name}のコンテンツ
            </h2>
            <LearningContents learningContents={learningContents} />
          </section>
        </div>
      </Container>
    </>
  );
}
