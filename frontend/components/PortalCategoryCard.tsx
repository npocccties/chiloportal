import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import { PortalCategory } from "api/@types";
import { pagesPath } from "lib/$path";

type Props = {
  className?: string;
  portalCategory: PortalCategory;
};

function PortalCategoryCard({ portalCategory, className }: Props) {
  return (
    <Link
      href={pagesPath.portal_categories
        ._portalCategoryId(portalCategory.portal_category_id)
        .$url({ query: {} })}
      className={clsx("flex bg-white p-6 gap-x-6", className)}
    >
      <div className="">
        <Image
          className="block mx-auto w-16"
          src={`/images/${portalCategory.image_url_path}`}
          alt=""
          width={180}
          height={180}
        />
      </div>
      <section className="flex-1">
        <h3 className="text-xl text-gray-700 font-bold mb-2">
          {portalCategory.name}
        </h3>
        <p className="text-sm text-gray-800 mb-4">
          {portalCategory.description}
        </p>

        <p className="jumpu-tag text-xs rounded-full px-4 py-1 inline-flex gap-1 items-center">
          <span>能力バッジ</span>
          <span className="font-bold">{portalCategory.badges_count}</span>
          <span>個</span>
        </p>
      </section>
    </Link>
  );
}

export default PortalCategoryCard;
