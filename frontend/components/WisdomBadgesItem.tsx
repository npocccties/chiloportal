import Link from "next/link";
import Image from "next/image";
import { BadgeDetail1, BadgeDetail2 } from "api/@types";
import { pagesPath } from "lib/$path";

type Props = {
  wisdomBadges: BadgeDetail1 | BadgeDetail2;
};

const isBadgeDetail1 = (
  wisdomBadges: BadgeDetail1 | BadgeDetail2,
): wisdomBadges is BadgeDetail1 => "portal_category_name" in wisdomBadges;

function WisdomBadgesItem({ wisdomBadges }: Props) {
  return (
    <Link
      href={pagesPath.wisdom_badges
        ._wisdomBadgesId(wisdomBadges.badges_id)
        .$url()}
      className="p-1.5 pr-2 flex items-center gap-4 text-gray-700 hover:text-black"
    >
      <Image
        src={`/images/${wisdomBadges.image}`}
        width={64}
        height={64}
        alt=""
      />
      <div>
        <h3 className="text-base font-bold mb-1">{wisdomBadges.name}</h3>
        <p className="text-xs text-gray-500 flex gap-x-3 gap-y-1 flex-wrap items-center">
          {"knowledge_badges_list" in wisdomBadges.detail && (
            <span>
              知識バッジ{wisdomBadges.detail.knowledge_badges_list.length}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Image src="/issuer.svg" alt="" width={8} height={8} />
            {wisdomBadges.issuer_name}
          </span>
          {isBadgeDetail1(wisdomBadges) && (
            <>
              <span className="inline-flex items-center gap-1">
                <Image src="/category.svg" alt="" width={8} height={8} />
                {wisdomBadges?.portal_category_name}
              </span>
            </>
          )}
        </p>
      </div>
    </Link>
  );
}

export default WisdomBadgesItem;
