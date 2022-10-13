import clsx from "clsx";
import Link from "next/link";
import Image from "next/future/image";
import useConsumers from "lib/use-consumers";
import usePortalCategories from "lib/use-portal-categories";
import { pagesPath } from "lib/$path";

type Props = {
  className?: string;
};

function Footer({ className }: Props) {
  const { data: consumers } = useConsumers();
  const { data: portalCategories } = usePortalCategories();
  return (
    <footer className={clsx("bg-gray-50 py-6", className)}>
      <div className="max-w-6xl mx-auto px-4 flex flex-wrap gap-6 mb-6">
        <div className="w-full xl:w-auto">
          <Link href={pagesPath.$url()}>
            <a className="inline-block px-2">
              <Image src="/logo.png" width={142} height={44} alt="" />
            </a>
          </Link>
        </div>
        <section>
          <h2 className="text-gray-400 text-xs mb-2">育成指標から探す</h2>
          <ul
            className="text-gray-700 leading-7 w-full sm:w-auto"
            aria-busy={!consumers}
          >
            {consumers
              ? consumers.map((consumer) => (
                  <li key={consumer.consumer_id}>
                    <Link
                      href={pagesPath.consumers
                        ._consumerId(consumer.consumer_id)
                        .$url()}
                    >
                      <a>{consumer.name}の育成指標</a>
                    </Link>
                  </li>
                ))
              : [...Array(10)].map((_, index) => (
                  <li
                    key={index}
                    className="animate-pulse bg-gray-300 w-64 h-4 my-3 rounded-full"
                    aria-hidden
                  />
                ))}
          </ul>
        </section>
        <section>
          <h2 className="text-gray-400 text-xs mb-2">カテゴリから探す</h2>
          <ul
            className="text-gray-700 leading-7 w-full sm:w-auto"
            aria-busy={!portalCategories}
          >
            {portalCategories
              ? portalCategories.map((portalCategory) => (
                  <li key={portalCategory.portal_category_id}>
                    <Link
                      href={pagesPath.portal_categories
                        ._portalCategoryId(portalCategory.portal_category_id)
                        .$url({ query: {} })}
                    >
                      <a>{portalCategory.name}</a>
                    </Link>
                  </li>
                ))
              : [...Array(10)].map((_, index) => (
                  <li
                    key={index}
                    className="animate-pulse bg-gray-300 w-48 h-4 my-3 rounded-full"
                    aria-hidden
                  />
                ))}
          </ul>
        </section>
        <ul className="text-gray-700 leading-7 sm:columns-2 w-full sm:w-auto [&>li]:break-inside-avoid">
          {/* TODO: 各画面のルーティングを実装して */}
          <li>
            <a>コンセプト</a>
          </li>
          <li>
            <a>免責事項</a>
          </li>
          <li>
            <a>プライバシーポリシー</a>
          </li>
          <li>
            <a>このサイトについて</a>
          </li>
          <li>
            <a>サイトマップ</a>
          </li>
          <li>
            <a>運営元情報</a>
          </li>
          <li>
            <a>お問い合わせ</a>
          </li>
        </ul>
      </div>
      <div className="flex justify-center text-gray-400 text-xs px-2">
        <p>Copyright CCC-TIES 2022</p>
      </div>
    </footer>
  );
}

export default Footer;
