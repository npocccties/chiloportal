import clsx from "clsx";
import Image from "next/image";
import { BadgeDetail2 } from "api/@types";
import { getImagePath } from "lib/criteria";

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
        <ol className="text-xs text-gray-700">
          {"length" in knowledgeBadges.detail &&
            knowledgeBadges.detail.map((criteria) => (
              <li
                key={criteria.criteria_id}
                className="flex items-center gap-2 mb-2"
              >
                <Image
                  src={getImagePath(criteria.type)}
                  width={16}
                  height={16}
                  alt={criteria.type}
                />
                <span>{criteria.name}</span>
              </li>
            ))}
        </ol>
      </div>
    </section>
  );
}

export default KnowledgeBadgesItem;
