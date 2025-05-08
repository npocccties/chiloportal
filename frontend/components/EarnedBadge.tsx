import { BadgeStatus } from "pages/dashboard";
import { useRef } from "react";
import { NEXT_PUBLIC_CHILOWALLET_BASE_URL } from "lib/env";

type Props = BadgeStatus & {
  index: number;
  onChecked?(index: number): void;
  onUnchecked?(index: number): void;
};

function EarnedBadge(props: Props) {
  const badge = JSON.parse(props.badge_json ?? "{}") as {
    "@context"?: "https://w3id.org/openbadges/v2";
    "@language"?: string;
    alignments?: Array<{ targetName: string; targetUrl: string }>;
    criteria?: {
      id?: string;
      narrative?: string;
    };
    description?: string;
    id?: string;
    image?:
      | string
      | {
          author?: string;
          id?: string;
        };
    issuer?: {
      "@context"?: "https://w3id.org/openbadges/v2";
      email?: string;
      id?: string;
      name?: string;
      type?: "Issuer";
      url?: string;
    };
    name?: string;
    type?: "BadgeClass";
    version?: "1.0-wisdom";
  };
  const ref = useRef<HTMLInputElement>(null);
  const handleClick = () => ref.current?.click();
  const isExpired = props.badge_expired_at
    ? Date.parse(props.badge_expired_at) < Date.now()
    : false;
  const imageUrl: string | undefined =
    typeof badge.image === "string" ? badge.image : badge.image?.id;
  const submissionDenied = isExpired || !props.badge_json;
  return (
    <div
      className={
        "jumpu-card pl-4 pr-6 py-4 flex items-center gap-4 has-checked:bg-primary-50 relative"
      }
      onClick={handleClick}
    >
      <input
        type="checkbox"
        value={props.index}
        className="jumpu-input disabled:bg-gray-200"
        ref={ref}
        onChange={(e) => {
          if (e.currentTarget.checked) {
            props.onChecked?.(props.index);
          } else {
            props.onUnchecked?.(props.index);
          }
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
        disabled={submissionDenied}
      />
      {/* eslint-disable @next/next/no-img-element */}
      <img
        className="size-24"
        alt=""
        src={imageUrl ?? "/badge-placeholder.svg"}
      />
      <section className="h-31 space-y-1">
        <h3 className="text-lg font-semibold line-clamp-2">
          <a
            className="hover:underline underline-offset-4"
            href={
              new URL(
                `/credential/detail/${props.badge_vc_id}`,
                NEXT_PUBLIC_CHILOWALLET_BASE_URL,
              ).href
            }
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {badge.name ?? props.badge_name}
          </a>
        </h3>
        <p className="prose prose-sm max-w-none line-clamp-2">
          {badge.description}
        </p>
      </section>
      <div className="flex gap-1 h-6.5 absolute bottom-1 right-1">
        {isExpired && (
          <p className="jumpu-filled-tag bg-danger text-white">有効期限切れ</p>
        )}
        {props.submitted && (
          <p className="jumpu-filled-tag bg-success text-white">提出済み</p>
        )}
      </div>
    </div>
  );
}

export default EarnedBadge;
