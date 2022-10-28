import Link from "next/link";
import Image from "next/future/image";
import { PortalCategory } from "api/@types";
import { pagesPath } from "lib/$path";

type Props = {
  portalCategory: PortalCategory;
};

function PortalCategoryCard({ portalCategory }: Props) {
  return (
    (<Link
      href={pagesPath.portal_categories
        ._portalCategoryId(portalCategory.portal_category_id)
        .$url({ query: {} })}
      className="jumpu-card block">

      <div className="relative h-48 overflow-hidden">
        <Image
          src={`/images/${portalCategory.image_url_path}`}
          alt=""
          fill
          style={{ objectFit: "cover" }}
        />
        <Image
          className="absolute top-2 left-2"
          width={52}
          height={53}
          src="/badge-placeholder.png"
          alt=""
        />
        <p className="text-lg absolute top-5 left-[0.375rem] text-center font-bold w-14">
          {portalCategory.badges_count}
        </p>
      </div>
      <section className="px-4 pt-2 pb-4">
        <h3 className="flex justify-center items-center text-2xl line-clamp-2 text-center mb-2">
          {portalCategory.name}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-3 mb-2">
          {portalCategory.description}
        </p>
        <p className="text-xs text-gray-400">
          能力バッジ（{portalCategory.badges_count}）
        </p>
      </section>

    </Link>)
  );
}

export default PortalCategoryCard;
