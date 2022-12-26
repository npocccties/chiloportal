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
    <Container as="article">
      <Breadcrumbs
        className="mb-6"
        nodes={[{ name: "トップ", href: pagesPath.$url() }]}
        leaf={portalCategory.name}
      />
      <header className="flex gap-8 items-center mb-16">
        <Image
          src={`/images/${portalCategory.image_url_path}`}
          width={200}
          height={200}
          alt=""
        />
        <div>
          <h1 className="text-4xl text-gray-600 mb-2">{portalCategory.name}</h1>
          <p className="font-bold text-gray-600 mb-4">
            {portalCategory.badges_count}つの能力バッジがあります
          </p>
          <p className="text-gray-500">{portalCategory.description}</p>
        </div>
      </header>
      <ul>
        {wisdomBadgesList.badges.map((wisdomBadges) => (
          <li className="mb-8" key={wisdomBadges.badges_id}>
            <WisdomBadgesItem wisdomBadges={wisdomBadges} />
          </li>
        ))}
      </ul>
      <Pagination
        totalCount={wisdomBadgesList.total_count}
        start={wisdomBadgesList.start}
        end={wisdomBadgesList.end}
        handleHref={handleHref}
      />
    </Container>
  );
}
