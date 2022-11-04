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
      className={clsx("block bg-white", className)}
    >
      <div className="relative">
        <Image
          className="block mx-auto pt-8 pb-4"
          src={`/images/${portalCategory.image_url_path}`}
          alt=""
          width={180}
          height={180}
        />
        <p className="absolute top-4 right-4 text-sm text-center text-white font-bold bg-primary-700 rounded-full px-4 py-px">
          {portalCategory.badges_count}
        </p>
      </div>
      <section className="px-4 pt-2 pb-8">
        <h3 className="flex justify-center items-center text-2xl text-gray-700 text-center mb-4">
          {portalCategory.name}
        </h3>
        <p className="text-sm text-gray-500 mb-2">
          {portalCategory.description}
        </p>
        <p className="text-xs text-gray-500">
          能力バッジ（{portalCategory.badges_count}）
        </p>
      </section>
    </Link>
  );
}

export default PortalCategoryCard;
