import Link, { LinkProps } from "next/link";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import usePagination from "lib/use-pagination";

type Props = {
  className?: string;
  totalCount: number;
  start: number;
  end: number;
  handleHref: (page: number) => LinkProps["href"];
};

function Pagination({ className, totalCount, start, end, handleHref }: Props) {
  const { currentPage, nextPage, prevPage, pages } = usePagination(
    totalCount,
    start,
    end
  );
  return (
    <ul className={clsx("flex items-center gap-2", className)}>
      <li>
        {prevPage ? (
          <Link href={handleHref(prevPage)}>
            <a className="jumpu-icon-button">
              <Icon icon="fa6-solid:chevron-left" />
            </a>
          </Link>
        ) : (
          <span
            className="jumpu-icon-button hover:bg-transparent text-gray-300 hover:text-gray-300"
            aria-disabled
          >
            <Icon icon="fa6-solid:chevron-left" />
          </span>
        )}
      </li>
      {pages.map((page, index) =>
        "number" === typeof page ? (
          <li key={index}>
            <Link href={handleHref(page)}>
              <a
                className={clsx("jumpu-icon-button", {
                  ["bg-primary-100 hover:bg-primary-100 font-bold"]:
                    page === currentPage,
                })}
                aria-current={page === currentPage}
              >
                {page}
              </a>
            </Link>
          </li>
        ) : (
          <li key={index} aria-hidden>
            …
          </li>
        )
      )}
      <li>
        {nextPage ? (
          <Link href={handleHref(nextPage)}>
            <a className="jumpu-icon-button">
              <Icon icon="fa6-solid:chevron-right" />
            </a>
          </Link>
        ) : (
          <span
            className="jumpu-icon-button hover:bg-transparent text-gray-300 hover:text-gray-300"
            aria-disabled
          >
            <Icon icon="fa6-solid:chevron-right" />
          </span>
        )}
      </li>
    </ul>
  );
}

export default Pagination;