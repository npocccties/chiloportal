import Link from "next/link";
import { Icon } from "@iconify/react";
import { pagesPath } from "lib/$path";
import { Props } from "pages/issuers/[issuerId]";
import Container from "components/Container";
import Breadcrumbs from "components/Breadcrumbs";
import Image from "next/image";
import { getImageUrl } from "lib/issuer";

export default function Issuer({
  issuer,
  posts,
  backgroundImage,
  learningContents,
}: Props) {
  const url = getImageUrl(issuer.url);
  return (
    <>
      <Breadcrumbs
        className="max-w-4xl mx-auto my-4 px-4 xl:px-0"
        nodes={[{ name: "ホーム", href: pagesPath.$url() }]}
        leaf={issuer.name}
      />
      <div className="relative h-72 w-full">
        <Image
          src={backgroundImage ?? "/issuer-background-image-placeholder.png"}
          alt=""
          fill
        />
      </div>
      <Container className="relative">
        <header className="flex items-end gap-4 -mt-[7.5rem] mb-4">
          {/* eslint-disable @next/next/no-img-element */}
          {/*
        NOTE: 事前に許可したホスト以外画像最適化の対象にできない
        See Also: https://nextjs.org/docs/messages/next-image-unconfigured-host
      */}
          {typeof url === "string" && (
            <img
              className="rounded-xl"
              src={url}
              width={160}
              height={160}
              alt=""
            />
          )}
          <h1 className="text-2xl font-bold pb-6">{issuer.name}</h1>
        </header>
        <div
          className="grid gap-x-10 gap-y-6"
          style={{
            gridTemplate: `
        "posts badges"
        "learningContents ."
        `,
          }}
        >
          <section style={{ gridArea: "posts" }}>
            <h2 className="flex gap-4 items-center text-xl font-bold border-b-4 border-black pb-2">
              <span className="inline-flex bg-black rounded-xl p-3">
                <Icon className="text-white" icon="ion:newspaper-outline" />
              </span>
              {issuer.name}からのおしらせ
            </h2>
            <ul className="my-4 space-y-4">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    className="flex items-center justify-between gap-4 border-l-4 border-gray-100 pl-4 text-sm hover:bg-gray-50 py-1 pr-1 [&>span:first-child]:hover:underline"
                    href={pagesPath.issuers
                      ._issuerId(issuer.issuer_id)
                      .posts._slug(post.slug)
                      .$url()}
                  >
                    <span>{post.title}</span>
                    <span className="p-2 text-xs text-primary-950 bg-gray-100 rounded">
                      {post.datePublished}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <section style={{ gridArea: "learningContents" }}>
            <h2 className="flex gap-4 items-center text-xl font-bold border-b-4 border-black pb-2">
              <span className="inline-flex bg-black rounded-xl p-3">
                <Icon className="text-white" icon="ion:folder-open-outline" />
              </span>
              {issuer.name}のコンテンツ
            </h2>
            <ul className="my-4 space-y-4">
              {learningContents.map((learningContent, index) => (
                <li key={index}>
                  <Link
                    className="flex flex-col gap-4 border-l-4 border-primary-100 pl-4 text-sm hover:bg-gray-50 py-1 [&>span:first-child]:hover:underline"
                    href={learningContent.url}
                    target="_blank"
                  >
                    <span className="text-base font-bold text-gray-700">
                      {learningContent.name}
                    </span>
                    <span className="text-gray-800">
                      {learningContent.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <section style={{ gridArea: "badges" }}>
            <h2 className="flex gap-4 items-center text-xl font-bold border-b-4 border-black pb-2">
              <span className="inline-flex bg-black rounded-xl p-3">
                <Image src="/fig-badge.svg" alt="" width={20} height={20} />
              </span>
              {issuer.name}の能力バッジ
            </h2>
            {/* TODO: 能力バッジに関する要約を表示して */}
          </section>
        </div>
      </Container>
    </>
  );
}
