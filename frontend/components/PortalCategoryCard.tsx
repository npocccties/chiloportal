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
      className={clsx("flex flex-col bg-white", className)}
    >
      <section className="px-4 pt-6 pb-4 flex-1">
        <h3 className="flex justify-center items-center text-2xl text-gray-700 text-center font-bold mb-4">
          {portalCategory.name}
        </h3>
        <p className="text-sm text-gray-500">{portalCategory.description}</p>
      </section>
      <div className="relative pb-8">
        <Image
          className="block mx-auto pb-4"
          src={`/images/${portalCategory.image_url_path}`}
          alt=""
          width={180}
          height={180}
        />
        <p className="jumpu-tag absolute bottom-4 right-4 text-xs rounded-full px-4 py-1 flex gap-1 items-center">
          <span>能力バッジ</span>
          <span className="font-bold">{portalCategory.badges_count}</span>
          <span>個</span>
        </p>
      </div>
    </Link>
  );
}

export default PortalCategoryCard;
