import Link from "next/link";
import { Props } from "pages";
import { pagesPath } from "lib/$path";
import IssuerCard from "components/IssuerCard";

export default function Top({ issuers }: Props) {
  return (
    <article className="text-center max-w-2l px-2 mx-auto py-32">
      {/* TODO: ロゴを配置して */}
      <h1 className="text-3xl font-bold mb-4">
        教員生涯学習プラットフォーム 「オゾン」
      </h1>
      <p className="font-serif font-bold text-lg mb-12">
        Teachers&apos; Life-Long Education Platform OZONE
      </p>
      {/* TODO: キャッチコピーを確定したものに差し替えて */}
      <p className="text-sm font-bold mx-auto max-w-xl text-left mb-12">
        3つのO 「Open​」「Online」「Opportunity​」
        オゾン層は地球を守る重要な役割を果たしており、これを教育の文脈においては、生徒や教育コミュニティを守り、育て、支えるシンボルとして捉えるこ
      </p>
      {/* TODO: バッジをさがす画面への動線を用意して */}
      <Link
        href={pagesPath.posts.$url()}
        className="block text-sm font-bold text-primary-700 hover:underline mb-12"
      >
        オゾンからのお知らせ
      </Link>
      <ul className="flex gap-2 flex-wrap justify-center max-w-5xl mx-auto">
        {issuers.map((issuer) => (
          <li key={issuer.issuer_id}>
            <IssuerCard issuer={issuer} />
          </li>
        ))}
      </ul>
    </article>
  );
}
