import clsx from "clsx";
import Image from "next/image";
import { BadgeDetail2 } from "api/@types";
import { pagesPath } from "lib/$path";
import { getImageUrl } from "lib/issuer";
import Link from "components/Link";

type Props = {
  className?: string;
  wisdomBadges: BadgeDetail2;
};

function WisdomBadgesCard({ wisdomBadges, className }: Props) {
  const url = getImageUrl(wisdomBadges.issuer_url);
  return (
    <Link
      href={pagesPath.wisdom_badges
        ._wisdomBadgesId(wisdomBadges.badges_id)
        .$url()}
      className={clsx("jumpu-card block hover:border-primary-700", className)}
    >
      <div className="flex flex-col items-center justify-center gap-2 pt-4">
        <Image
          src={`/images/${wisdomBadges.image}`}
          width={80}
          height={80}
          alt=""
        />
        <div className="jumpu-tag bg-white text-gray-700 border border-gray-300 mb-2">
          能力バッジ
        </div>
      </div>
      <section className="px-4 pb-4">
        <h3 className="text-xl text-gray-700 mb-2">{wisdomBadges.name}</h3>
        {"knowledge_badges_list" in wisdomBadges.detail && (
          <div className="jumpu-tag bg-gray-50 text-gray-700 border-none hover:border-none mb-2">
            知識バッジ{wisdomBadges.detail.knowledge_badges_list.length}
            つで獲得
          </div>
        )}
        <p className="text-sm flex gap-2 items-center">
          {/* eslint-disable @next/next/no-img-element */}
          {/*
            NOTE: 事前に許可したホスト以外画像最適化の対象にできない
            See Also: https://nextjs.org/docs/messages/next-image-unconfigured-host
          */}
          {typeof url === "string" && (
            <img className="h-fit" src={url} width={20} height={20} alt="" />
          )}
          <span className="font-bold mr-1">{wisdomBadges.issuer_name}</span>
          <span className="text-gray-500 flex-shrink-0">発行</span>
        </p>
      </section>
    </Link>
  );
}

export default WisdomBadgesCard;
