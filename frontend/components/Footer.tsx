import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import useConsumers from "lib/use-consumers";
import usePortalCategories from "lib/use-portal-categories";
import { pagesPath } from "lib/$path";

type Props = {
  className?: string;
};

function Footer({ className }: Props) {
  const { data: consumers, error: consumersError } = useConsumers();
  const { data: portalCategories, error: portalCategoriesError } =
    usePortalCategories();
  return (
    <footer className={clsx("bg-gray-50 py-6", className)}>
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 flex flex-col sm:flex-row flex-wrap gap-6 mb-6">
        <div className="w-full xl:w-auto">
          <Link href={pagesPath.$url()} className="inline-block px-2">

            <Image src="/logo.png" width={142} height={44} alt="" />

          </Link>
        </div>
        <section>
          <h2 className="text-gray-400 text-xs mb-2">育成指標から探す</h2>
          <ul className="text-gray-700 leading-7" aria-busy={!consumers}>
            {!consumersError && consumers
              ? consumers.map((consumer) => (
                  <li key={consumer.consumer_id}>
                    <Link
                      href={pagesPath.consumers
                        ._consumerId(consumer.consumer_id)
                        .$url()}
                    >
                      {consumer.name}の育成指標
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
          <ul className="text-gray-700 leading-7" aria-busy={!portalCategories}>
            {!portalCategoriesError && portalCategories
              ? portalCategories.map((portalCategory) => (
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
              : [...Array(10)].map((_, index) => (
                  <li
                    key={index}
                    className="animate-pulse bg-gray-300 w-48 h-4 my-3 rounded-full"
                    aria-hidden
                  />
                ))}
          </ul>
        </section>
        <ul className="text-gray-700 leading-7 sm:columns-2 [&>li]:break-inside-avoid">
          <li>
            <Link href={pagesPath._slug("concept").$url()}>
              コンセプト
            </Link>
          </li>
          <li>
            <Link href={pagesPath._slug("disclaimer").$url()}>
              ご利用にあたって（免責事項）
            </Link>
          </li>
          <li>
            <Link href={pagesPath._slug("privacy_policy").$url()}>
              プライバシーポリシー
            </Link>
          </li>
          <li>
            <Link href={pagesPath._slug("about_site").$url()}>
              このサイトについて
            </Link>
          </li>
          <li>
            <a>サイトマップ</a>
          </li>
          <li>
            <Link href={pagesPath._slug("about_site").$url()}>
              私たちについて
            </Link>
          </li>
          <li>
            <Link href={pagesPath._slug("contact").$url()}>
              お問い合わせ
            </Link>
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
