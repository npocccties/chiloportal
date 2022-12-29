import Image from "next/image";
import Breadcrumbs from "components/Breadcrumbs";
import Container from "components/Container";
import Pagination from "components/Pagination";
import WisdomBadgesItem from "components/WisdomBadgesItem";
import { Props } from "pages/portal_categories/[portalCategoryId]";
import { pagesPath } from "lib/$path";

export default function PortalCategory({
  portalCategory,
  wisdomBadgesList,
}: Props) {
  const handleHref = (page: number) =>
    pagesPath.portal_categories
      ._portalCategoryId(portalCategory.portal_category_id)
      .$url({ query: { p: String(page) } });
  return (
    <>
      <Container as="article" className="min-h-0 px-8 lg:px-0 md:pb-0">
        <Breadcrumbs
          className="mb-6 xl:mb-12"
          nodes={[{ name: "トップ", href: pagesPath.$url() }]}
          leaf={portalCategory.name}
        />
        <header className="flex flex-col md:flex-row gap-4 md:gap-8 items-center md:py-8">
          <Image
            src={`/images/${portalCategory.image_url_path}`}
            width={200}
            height={200}
            alt=""
            className="w-5/12 sm:w-40 lg:w-52 flex-shrink-0"
          />
          <div>
            <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold text-gray-600 mb-2">
              {portalCategory.name}
            </h1>
            <p className="font-bold text-gray-600 xl:text-xl mb-4">
              {portalCategory.badges_count}個の能力バッジがあります
            </p>
            <p className="text-gray-500">{portalCategory.description}</p>
          </div>
        </header>
      </Container>
      <div className="bg-gray-100 shadow-inner">
        <ul className="grid md:grid-cols-2 gap-4 max-w-6xl mx-auto px-4 pt-4">
          {wisdomBadgesList.badges.map((wisdomBadges) => (
            <li className="" key={wisdomBadges.badges_id}>
              <WisdomBadgesItem wisdomBadges={wisdomBadges} />
            </li>
          ))}
        </ul>
        <Pagination
          totalCount={wisdomBadgesList.total_count}
          start={wisdomBadgesList.start}
          end={wisdomBadgesList.end}
          handleHref={handleHref}
          className="py-12 justify-center"
        />
      </div>
    </>
  );
}
