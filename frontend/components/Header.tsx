import { useId } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import Image from "next/future/image";
import Popover from "components/Popover";
import useConsumers from "lib/use-consumers";
import usePortalCategories from "lib/use-portal-categories";
import clsx from "clsx";
import { pagesPath } from "lib/$path";
import { NEXT_PUBLIC_MOODLE_DASHBOARD_URL } from "lib/env";

type Props = {
  className?: string;
};

const contents = [
  {
    title: "コンセプト",
    slug: "concept",
  },
  {
    title: "私たちについて",
    slug: "about_us",
  },
  {
    title: "プライバシーポリシー",
    slug: "privacy_policy",
  },
  {
    title: "ご利用にあたって（免責事項）",
    slug: "disclaimer",
  },
  {
    title: "お問い合わせ",
    slug: "contact",
  },
] as const;

function Header({ className }: Props) {
  const { data: consumers, error: consumersError } = useConsumers();
  const { data: portalCategories, error: portalCategoriesError } =
    usePortalCategories();
  const id = useId();
  return (
    <header
      className={clsx("flex items-center gap-2 px-8 py-2 bg-white", className)}
    >
      <Link href={pagesPath.$url()}>
        <a className="px-2 mr-4">
          <Image src="/logo.png" width={142} height={44} alt="" />
        </a>
      </Link>
      <Popover className="hidden lg:block" title="育成指標から探す">
        {({ close }) => (
          <ul
            role="menu"
            className="jumpu-card overflow-y-scroll max-h-[80vh]"
            aria-busy={!consumers}
            onClick={() => close()}
          >
            {!consumersError && consumers ? (
              consumers.map((consumer) => (
                <li key={consumer.consumer_id} role="menuitem">
                  <Link
                    href={pagesPath.consumers
                      ._consumerId(consumer.consumer_id)
                      .$url()}
                  >
                    <a className="block px-3 py-2 hover:bg-primary-50">
                      {consumer.name}の育成指標
                    </a>
                  </Link>
                </li>
              ))
            ) : (
              <li
                className="flex justify-center items-center w-48 h-72"
                aria-hidden
              >
                <div className="jumpu-spinner">
                  <svg viewBox="24 24 48 48">
                    <circle cx="48" cy="48" r="16" />
                  </svg>
                </div>
              </li>
            )}
          </ul>
        )}
      </Popover>
      <Popover className="hidden lg:block" title="カテゴリから探す">
        {({ close }) => (
          <ul
            role="menu"
            className="jumpu-card overflow-y-scroll max-h-[80vh]"
            aria-busy={!portalCategories}
            onClick={() => close()}
          >
            {!portalCategoriesError && portalCategories ? (
              portalCategories.map((portalCategory) => (
                <li key={portalCategory.portal_category_id} role="menuitem">
                  <Link
                    href={pagesPath.portal_categories
                      ._portalCategoryId(portalCategory.portal_category_id)
                      .$url({ query: {} })}
                  >
                    <a className="block px-3 py-2 hover:bg-primary-50">
                      {portalCategory.name}
                    </a>
                  </Link>
                </li>
              ))
            ) : (
              <li
                className="flex justify-center items-center w-48 h-72"
                aria-hidden
              >
                <div className="jumpu-spinner">
                  <svg viewBox="24 24 48 48">
                    <circle cx="48" cy="48" r="16" />
                  </svg>
                </div>
              </li>
            )}
          </ul>
        )}
      </Popover>
      <Popover className="hidden lg:block" title="OKUTEPについて">
        {({ close }) => (
          <ul
            role="menu"
            className="jumpu-card overflow-y-scroll max-h-[80vh]"
            onClick={() => close()}
          >
            {contents.map((content) => (
              <li key={content.slug} role="menuitem">
                <Link href={pagesPath._slug(content.slug).$url()}>
                  <a className="block px-3 py-2 hover:bg-primary-50">
                    {content.title}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Popover>
      <div className="flex-1" />
      <Link href={pagesPath.search.$url({ query: {} })}>
        <a
          aria-describedby={id}
          className="jumpu-icon-button group text-2xl w-10 h-10 mr-4"
        >
          <Icon className="text-gray-700" icon="charm:search" />
          <span
            id={id}
            className="![transform:translate(-50%,_200%)_scale(0)] group-hover:![transform:translate(-50%,_200%)_scale(1)]"
            role="tooltip"
          >
            検索
          </span>
        </a>
      </Link>
      <a
        className="hidden lg:inline text-primary-700 hover:underline"
        href={NEXT_PUBLIC_MOODLE_DASHBOARD_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        Moodleダッシュボード
      </a>
    </header>
  );
}

export default Header;
