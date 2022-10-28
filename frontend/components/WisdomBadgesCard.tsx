import Link from "next/link";
import Image from "next/image";
import { BadgeDetail2 } from "api/@types";
import { pagesPath } from "lib/$path";
import { getImageUrl } from "lib/issuer";

type Props = {
  wisdomBadges: BadgeDetail2;
};

function WisdomBadgesCard({ wisdomBadges }: Props) {
  const url = getImageUrl(wisdomBadges.issuer_url);
  return (
    <Link
      href={pagesPath.wisdom_badges
        ._wisdomBadgesId(wisdomBadges.badges_id)
        .$url()}
      className="jumpu-card block"
    >
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
        <p className="text-sm flex gap-2">
          {/* eslint-disable @next/next/no-img-element */}
          {/*
            NOTE: 事前に許可したホスト以外画像最適化の対象にできない
            See Also: https://nextjs.org/docs/messages/next-image-unconfigured-host
          */}
          {typeof url === "string" && (
            <img src={url} width={20} height={20} alt="" />
          )}
          <span className="font-bold mr-1">{wisdomBadges.issuer_name}</span>
          <span className="text-gray-500">発行</span>
        </p>
      </section>
    </Link>
  );
}

export default WisdomBadgesCard;
