import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import useConsumers from "lib/use-consumers";
import usePortalCategories from "lib/use-portal-categories";
import { pagesPath } from "lib/$path";
import Fallback from "components/Fallback";

type Props = {
  className?: string;
};

function Footer({ className }: Props) {
  const { data: consumers, error: consumersError } = useConsumers();
  const { data: portalCategories, error: portalCategoriesError } =
    usePortalCategories();
  return (
    <footer className={clsx("bg-gray-50 py-6", className)}>
      <div className="max-w-5xl xl:max-w-7xl mx-auto px-4 flex flex-col xl:justify-center sm:flex-row flex-wrap gap-8 mb-6">
        <div className="w-full xl:w-auto">
          <Link href={pagesPath.$url()} className="inline-block px-2">
            <Image
              src="/logo.svg"
              width={69}
              height={27}
              alt="トップページに戻る"
            />
          </Link>
        </div>
        <section>
          <h2 className="text-gray-700 text-xs font-bold mb-2">
            教員育成指標から探す
          </h2>
          <ul
            className="text-gray-700 text-sm leading-7"
            aria-busy={!consumers}
          >
            <Fallback
              data={consumers}
              error={consumersError}
              pending={[...Array(10)].map((_, index) => (
                <li
                  key={index}
                  className="animate-pulse bg-gray-300 w-64 h-4 my-3 rounded-full"
                  aria-hidden
                />
              ))}
            >
              {(data) =>
                data.map((consumer) => (
                  <li key={consumer.consumer_id}>
                    <Link
                      href={pagesPath.consumers
                        ._consumerId(consumer.consumer_id)
                        .$url()}
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
          <h2 className="text-gray-700 text-xs font-bold mb-2">
            カテゴリから探す
          </h2>
          <ul
            className="text-gray-700 text-sm leading-7"
            aria-busy={!portalCategories}
          >
            <Fallback
              data={portalCategories}
              error={portalCategoriesError}
              pending={[...Array(10)].map((_, index) => (
                <li
                  key={index}
                  className="animate-pulse bg-gray-300 w-48 h-4 my-3 rounded-full"
                  aria-hidden
                />
              ))}
            >
              {(data) =>
                data.map((portalCategory) => (
                  <li key={portalCategory.portal_category_id}>
                    <Link
                      href={pagesPath.portal_categories
                        ._portalCategoryId(portalCategory.portal_category_id)
                        .$url({ query: {} })}
                    >
                      {portalCategory.name}
                    </Link>
                  </li>
                ))
              }
            </Fallback>
          </ul>
        </section>
        <ul className="text-gray-700 text-sm leading-7 sm:columns-2 [&>li]:break-inside-avoid">
          <li>
            <Link href={pagesPath._slug("concept").$url()}>OKUTEPについて</Link>
          </li>
          <li>
            <Link href={pagesPath._slug("about_us").$url()}>
              私たちについて
            </Link>
          </li>
          <li>
            <Link href={pagesPath._slug("about_operator").$url()}>
              運営元について
            </Link>
          </li>
          <li>
            <Link href={pagesPath._slug("privacy_policy").$url()}>
              プライバシーポリシー
            </Link>
          </li>
          <li>
            <Link href={pagesPath._slug("disclaimer").$url()}>
              ご利用にあたって（免責事項）
            </Link>
          </li>
          {/* TODO: サイトマップを実装したら追加して
          <li>
            <a>サイトマップ</a>
          </li>
          */}
          <li>
            <Link href={pagesPath._slug("copyright").$url()}>
              教材の著作権について
            </Link>
          </li>
          <li>
            <Link href={pagesPath._slug("contact").$url()}>お問い合わせ</Link>
          </li>
        </ul>
      </div>
      <div className="flex justify-center text-gray-700 text-xs px-2">
        <p>Copyright (C) Osaka Kyoiku University. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
