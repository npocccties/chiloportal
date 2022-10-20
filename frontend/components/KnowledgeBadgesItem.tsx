import clsx from "clsx";
import Image from "next/future/image";
import { BadgeDetail2 } from "api/@types";

type Props = {
  className?: string;
  knowledgeBadges: BadgeDetail2;
};

function KnowledgeBadgesItem({ className, knowledgeBadges }: Props) {
  return (
    <section className={clsx("flex items-center gap-4", className)}>
      <div className="flex-shrink-0 flex flex-col items-center gap-1">
        <Image
          src={`/images/${knowledgeBadges.image}`}
          width={80}
          height={80}
          alt=""
        />
        <div className="jumpu-tag">知識バッジ</div>
      </div>
      <div>
        <h3 className="text-lg text-gray-700 mb-2">{knowledgeBadges.name}</h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {knowledgeBadges.description}
        </p>
        {/* TODO: クライテリアの種類を表す画像を表示して */}
        <ol className="pl-4 list-decimal text-xs text-gray-700">
          {"length" in knowledgeBadges.detail &&
            knowledgeBadges.detail.map((criteria) => (
              <li key={criteria.criteria_id}>{criteria.name}</li>
            ))}
        </ol>
      </div>
    </section>
  );
}

export default KnowledgeBadgesItem;
