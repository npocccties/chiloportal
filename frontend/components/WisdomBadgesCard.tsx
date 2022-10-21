import Link from "next/link";
import Image from "next/future/image";
import { BadgeDetail2 } from "api/@types";
import { pagesPath } from "lib/$path";

type Props = {
  wisdomBadges: BadgeDetail2;
};

function WisdomBadgesCard({ wisdomBadges }: Props) {
  return (
    <Link
      href={pagesPath.wisdom_badges
        ._wisdomBadgesId(wisdomBadges.badges_id)
        .$url()}
    >
      <a className="jumpu-card block">
        <div className="relative h-16 bg-gradient-to-r from-orange-300 to-orange-400 mb-6">
          <Image
            className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2"
            src={`/images/${wisdomBadges.image}`}
            width={80}
            height={80}
            alt=""
          />
        </div>
        <section className="px-4 pb-4">
          <div className="jumpu-tag mb-2">能力バッジ</div>
          <h3 className="text-xl mb-2 line-clamp-2">{wisdomBadges.name}</h3>
          {"knowledge_badges_list" in wisdomBadges.detail && (
            <div className="jumpu-tag mb-2">
              知識バッジ{wisdomBadges.detail.knowledge_badges_list.length}
              つで獲得
            </div>
          )}
          <p className="text-sm text-gray-600 mb-2 line-clamp-5">
            {wisdomBadges.description}
          </p>
          <p className="text-sm">
            <span className="font-bold mr-1">{wisdomBadges.issuer_name}</span>
            <span className="text-gray-500">発行</span>
          </p>
        </section>
      </a>
    </Link>
  );
}

export default WisdomBadgesCard;
