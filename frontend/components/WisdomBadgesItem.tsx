import Link from "next/link";
import Image from "next/future/image";
import { BadgeDetail2 } from "api/@types";
import { pagesPath } from "lib/$path";

type Props = {
  wisdomBadges: BadgeDetail2;
};

function WisdomBadgesItem({ wisdomBadges }: Props) {
  return (
    <Link
      href={pagesPath.wisdom_badges
        ._wisdomBadgesId(wisdomBadges.badges_id)
        .$url()}
    >
      <a className="flex gap-4">
        <div className="flex-shrink-0 flex flex-col items-center gap-1">
          <Image
            src={`/images/${wisdomBadges.image}`}
            width={80}
            height={80}
            alt=""
          />
          <div className="jumpu-tag">能力バッジ</div>
        </div>
        <div>
          <h3 className="text-lg">{wisdomBadges.name}</h3>
          <p className="text-sm mb-2">
            <span className="font-bold mr-1">{wisdomBadges.issuer_name}</span>
            <span className="text-gray-500">発行</span>
          </p>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {wisdomBadges.description}
          </p>
          {"knowledge_badges_list" in wisdomBadges.detail && (
            <div className="jumpu-tag">
              知識バッジ{wisdomBadges.detail.knowledge_badges_list.length}
              つで獲得
            </div>
          )}
        </div>
      </a>
    </Link>
  );
}

export default WisdomBadgesItem;
