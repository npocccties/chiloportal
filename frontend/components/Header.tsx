import Link from "next/link";
import Image from "next/image";
import Popover from "components/Popover";
import SearchForm from "components/SearchForm";
import useConsumers from "lib/use-consumers";
import usePortalCategories from "lib/use-portal-categories";
import clsx from "clsx";
import { pagesPath } from "lib/$path";
import contents from "lib/contents";
import { NEXT_PUBLIC_MOODLE_DASHBOARD_URL } from "lib/env";
import Fallback from "components/Fallback";

type Props = {
  className?: string;
};

function Header({ className }: Props) {
  const { data: consumers, error: consumersError } = useConsumers();
  const { data: portalCategories, error: portalCategoriesError } =
    usePortalCategories();
  return (
    <header className={clsx("bg-white", className)}>
      <div className="relative flex items-center gap-1 px-4 py-2 mx-auto max-w-6xl">
        <Link
          href={pagesPath.$url()}
          className="px-2 absolute md:static left-1/2 top-1/2 -translate-x-1/2 md:translate-x-0 -translate-y-1/2 md:translate-y-0 md:mr-4 shrink-0"
        >
          <Image
            src="/logo.svg"
            width={69}
            height={27}
            alt="トップページに戻る"
          />
        </Link>
        <Popover className="hidden md:block" title="カテゴリから探す">
          {({ close }) => (
            <ul
              role="menu"
              className="jumpu-card p-2 text-sm overflow-y-scroll max-h-[80vh]"
              aria-busy={!portalCategories}
              onClick={() => close()}
            >
              <Fallback
                data={portalCategories}
                error={portalCategoriesError}
                pending={
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
                }
              >
                {(data) =>
                  data.map((portalCategory) => (
                    <li key={portalCategory.portal_category_id} role="menuitem">
                      <Link
                        href={pagesPath.portal_categories
                          ._portalCategoryId(portalCategory.portal_category_id)
                          .$url({ query: {} })}
                        className="block w-max min-w-full px-4 py-3 rounded hover:text-white hover:bg-primary-700"
                      >
                        {portalCategory.name}
                      </Link>
                    </li>
                  ))
                }
              </Fallback>
            </ul>
          )}
        </Popover>
        <Popover className="hidden md:block" title="教員育成指標から探す">
          {({ close }) => (
            <ul
              role="menu"
              className="jumpu-card p-2 text-sm overflow-y-scroll max-h-[80vh]"
              aria-busy={!consumers}
              onClick={() => close()}
            >
              <Fallback
                data={consumers}
                error={consumersError}
                pending={
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
                }
              >
                {(data) =>
                  data.map((consumer) => (
                    <li key={consumer.consumer_id} role="menuitem">
                      <Link
                        href={pagesPath.consumers
                          ._consumerId(consumer.consumer_id)
                          .$url()}
                        className="block w-max min-w-full px-4 py-3 rounded hover:text-white hover:bg-primary-700"
                      >
                        {consumer.name}の教員育成指標
                      </Link>
                    </li>
                  ))
                }
              </Fallback>
            </ul>
          )}
        </Popover>
        <Popover className="hidden md:block" title="OKUTEPについて">
          {({ close }) => (
            <ul
              role="menu"
              className="jumpu-card p-2 text-sm overflow-y-scroll max-h-[80vh]"
              onClick={() => close()}
            >
              {contents.map((content) => (
                <li key={content.slug} role="menuitem">
                  <Link
                    href={pagesPath._slug(content.slug).$url()}
                    className="block w-max min-w-full px-4 py-3 rounded hover:text-white hover:bg-primary-700"
                  >
                    {content.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Popover>
        <div className="flex-1" />
        <SearchForm className="hidden xl:block mr-4" size="small" />
        <a
          className="jumpu-text-button text-primary-700 text-sm overflow-hidden whitespace-nowrap text-ellipsis shrink"
          href={NEXT_PUBLIC_MOODLE_DASHBOARD_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          ログイン
        </a>
      </div>
    </header>
  );
}

export default Header;
