import Image from "next/future/image";
import Breadcrumbs from "components/Breadcrumbs";
import Container from "components/Container";
import WisdomBadgesItem from "components/WisdomBadgesItem";
import { Props } from "pages/portal_categories/[portalCategoryId]";
import { pagesPath } from "lib/$path";

export default function PortalCategory({
  portalCategory,
  wisdomBadgesList,
}: Props) {
  return (
    <Container>
      <Breadcrumbs
        className="mb-6"
        nodes={[{ name: "トップ", href: pagesPath.$url() }]}
        leaf={portalCategory.name}
      />
      <header className="flex gap-8 items-center mb-16">
        <Image
          className="rounded-2xl"
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
      <article>
        <ul>
          {wisdomBadgesList.badges.map((wisdomBadges) => (
            <li className="mb-8" key={wisdomBadges.badges_id}>
              <WisdomBadgesItem wisdomBadges={wisdomBadges} />
            </li>
          ))}
        </ul>
      </article>
    </Container>
  );
}
