import Link from "next/link";
import Image from "next/image";
import { Props } from "pages";
import { pagesPath } from "lib/$path";
import { Icon } from "@iconify/react";
import Markdown from "components/Markdown";

export default function Top({ source }: Props) {
  return (
    <article className="container px-6 text-center py-32">
      <style jsx global>
        {`
          body {
            background-image: url("/top-bg.png");
            background-size: cover;
            background-position: center;
          }
        `}
      </style>
      <h1 className="mb-14 md:mb-28 px-6 md:px-0">
        <Image
          className="inline-block w-[510px] md:w-[612px] h-auto"
          src="/logo.svg"
          width={128}
          height={32}
          alt="OZONE-edu"
        />
      </h1>
      <p className="text-xl md:text-5xl tracking-tight text-white font-bold mb-10">
        自ら学びつづけるすべての人々へ
      </p>
      <Link
        className="jumpu-button bg-white text-black text-base md:text-xl font-bold px-rel20 py-rel4 border-2 mb-10 relative"
        href={pagesPath.discover.$url({ query: {} })}
      >
        学びを探す
        <Icon
          icon="fa6-solid:chevron-right"
          className="text-base text-gray-500 absolute right-4 top-1/2 -translate-y-1/2"
        />
      </Link>
      <Link
        href={pagesPath.posts.$url()}
        className="block text-sm text-white underline underline-offset-4 mb-24"
      >
        オゾンからのお知らせ
      </Link>
      {source && <Markdown {...source} />}
    </article>
  );
}
