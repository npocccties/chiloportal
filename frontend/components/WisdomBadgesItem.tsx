import Link from "next/link";
import Image from "next/image";
import { BadgeDetail1, BadgeDetail2 } from "api/@types";
import { pagesPath } from "lib/$path";
import BadgeMarks from "components/BadgeMarks";

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
      {wisdomBadges.display_image ? (
        // 管理画面で設定した表示用の画像（/media/。再ビルドなしで変わるので、画像の最適化は通さない）
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={wisdomBadges.display_image}
          width={100}
          height={100}
          className="size-[92px] md:size-[100px] object-contain"
          alt=""
        />
      ) : (
        <Image
          src={`/images/${wisdomBadges.image}`}
          width={100}
          height={100}
          className="size-[92px] md:size-[100px]"
          alt=""
        />
      )}
      <div>
        <h3 className="text-base md:text-lg font-bold mb-1">
          {wisdomBadges.name}
          <BadgeMarks
            className="ml-2"
            isNew={wisdomBadges.is_new}
            labels={wisdomBadges.labels}
          />
        </h3>
        <p className="text-xs text-gray-500 flex gap-x-3 gap-y-1 flex-wrap items-center">
          {"knowledge_badges_list" in wisdomBadges.detail && (
            <span>
              スタンプ{wisdomBadges.detail.knowledge_badges_list.length}
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
