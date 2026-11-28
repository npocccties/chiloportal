import Link, { LinkProps } from "next/link";
import clsx from "clsx";
import { Sort, sortLabels } from "lib/sort";

type Props = {
  className?: string;
  /** いま使っている並び順（API の応答の sort） */
  current?: Sort;
  handleHref: (sort: Sort) => LinkProps["href"];
};

/** バッジ一覧の並び順を選ぶリンク */
function SortLinks({ className, current, handleHref }: Props) {
  return (
    <nav
      aria-label="並び順"
      className={clsx("flex items-center gap-1 text-sm", className)}
    >
      <span className="text-gray-500 mr-1">並び順</span>
      {(Object.keys(sortLabels) as Sort[]).map((sort) => (
        <Link
          key={sort}
          href={handleHref(sort)}
          aria-current={sort === current ? "true" : undefined}
          className={clsx(
            "px-3 py-1 rounded-full border",
            sort === current
              ? "border-gray-700 bg-gray-700 text-white pointer-events-none"
              : "border-gray-300 text-gray-700 hover:bg-gray-100",
          )}
        >
          {sortLabels[sort]}
        </Link>
      ))}
    </nav>
  );
}

export default SortLinks;
