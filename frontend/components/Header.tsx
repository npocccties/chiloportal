import { useId } from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import Popover from "components/Popover";
import SearchForm from "components/SearchForm";
import useConsumers from "lib/use-consumers";
import usePortalCategories from "lib/use-portal-categories";
import useDialog from "lib/use-dialog";
import clsx from "clsx";
import { pagesPath } from "lib/$path";
import contents from "lib/contents";
import { NEXT_PUBLIC_MOODLE_DASHBOARD_URL } from "lib/env";
import Fallback from "components/Fallback";
import Menu from "components/Menu";

type Props = {
  className?: string;
};

function Header({ className }: Props) {
  const { data: consumers, error: consumersError } = useConsumers();
  const { data: portalCategories, error: portalCategoriesError } =
    usePortalCategories();
  const { open, onOpen, onClose } = useDialog();
  const id = useId();
  return (
    <header className={clsx("bg-white", className)}>
      <div className="relative flex items-center gap-1 px-4 xl:px-16 py-4 mx-auto border-b border-gray-200">
        <button
          className="jumpu-icon-button group md:hidden"
          onClick={onOpen}
          aria-describedby={id}
        >
          <Icon className="text-xl text-primary-500" icon="fa6-solid:bars" />
          <span
            id={id}
            role="tooltip"
            className="![transform:translate(-50%,_150%)_scale(0)] group-hover:![transform:translate(-50%,_150%)_scale(1)]"
          >
            メニュー
          </span>
        </button>
        <Menu open={open} onClose={onClose} />
        <Link
          href={pagesPath.$url()}
          className="absolute md:static left-1/2 top-1/2 -translate-x-1/2 md:translate-x-0 -translate-y-1/2 md:translate-y-0 md:mr-4 xl:mr-12 shrink-0"
        >
          <Image
            src="/logo.svg"
            width={108}
            height={24}
            alt="トップページに戻る"
            className="md:ml-8 w-24 -translate-y-0.5"
          />
        </Link>
        <Popover className="hidden md:block font-bold" title="カテゴリから探す">
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
                        className="block w-max min-w-full px-4 py-3 rounded hover:text-white hover:bg-primary-700 dark:text-black font-normal"
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
        <Popover
          className="hidden md:block font-bold"
          title="教員育成指標から探す"
        >
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
                        className="block w-max min-w-full px-4 py-3 rounded hover:text-white hover:bg-primary-700 dark:text-black font-normal"
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
        <Popover className="hidden md:block font-bold" title="OKUTEPについて">
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
                    className="block w-max min-w-full px-4 py-3 rounded hover:text-white hover:bg-primary-700 dark:text-black font-normal"
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
          rel="noopener noreferrer"
        >
          ログイン
        </a>
      </div>
    </header>
  );
}

export default Header;
