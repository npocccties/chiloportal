import Link from "next/link";
import Image from "next/image";
import { BadgeDetail2 } from "api/@types";
import { pagesPath } from "lib/$path";
import { getImageUrl } from "lib/issuer";

type Props = {
  wisdomBadges: BadgeDetail2;
};

function WisdomBadgesItem({ wisdomBadges }: Props) {
  const url = getImageUrl(wisdomBadges.issuer_url);
  return (
    <Link
      href={pagesPath.wisdom_badges
        ._wisdomBadgesId(wisdomBadges.badges_id)
        .$url()}
      className="jumpu-card rounded-xl p-4 md:p-6 lg:p-8 h-full flex items-center gap-4 shadow-2xl transition hover:ring-2 ring-primary-400"
    >
      <div className="flex-shrink-0 flex flex-col items-center gap-1">
        <Image
          src={`/images/${wisdomBadges.image}`}
          width={80}
          height={80}
          alt=""
          className="w-24 md:w-32"
        />
        <div className="text-xs text-gray-700 mt-2">能力バッジ</div>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2">{wisdomBadges.name}</h3>
        <p className="text-sm flex gap-2 items-center mb-2">
          {/* eslint-disable @next/next/no-img-element */}
          {/*
            NOTE: 事前に許可したホスト以外画像最適化の対象にできない
            See Also: https://nextjs.org/docs/messages/next-image-unconfigured-host
          */}
          {typeof url === "string" && (
            <img className="h-fit" src={url} width={20} height={20} alt="" />
          )}
          <span className="font-bold mr-1">{wisdomBadges.issuer_name}</span>
          <span className="text-gray-500 flex-shrink-0 text-xs">発行</span>
        </p>
        <p className="text-sm text-gray-600 mb-2 line-clamp-3">
          {wisdomBadges.description}
        </p>
        {"knowledge_badges_list" in wisdomBadges.detail && (
          <div className="jumpu-tag bg-gray-50 text-gray-700 border-gray-300 hover:border-none">
            知識バッジ{wisdomBadges.detail.knowledge_badges_list.length}
            つで獲得
          </div>
        )}
      </div>
    </Link>
  );
}

export default WisdomBadgesItem;
