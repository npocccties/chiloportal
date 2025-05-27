import { BadgeStatus } from "pages/dashboard";
import { useRef } from "react";
import { NEXT_PUBLIC_CHILOWALLET_BASE_URL, NEXT_PUBLIC_BASE_URL } from "lib/env";
import { useDebouncedCallback } from "use-debounce";

type Props = BadgeStatus & {
  index: number;
  onChecked?(index: number): void;
  onUnchecked?(index: number): void;
};

const messages = {
  expired:
    "コースで発行されたバッジの有効期限を過ぎているため、バッジを提出することはできません。",
  unbadged:
    "バッジのデータが不足しているため、バッジを提出することはできません。",
} as const;

type BadgeJson = {
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

type BadgeErrorJson = {
  error: string;
  errorcode: string;
  stacktrace: unknown;
  debuginfo: unknown;
  reproductionlink: unknown;
};

type ParsedBadgeJson = BadgeJson | BadgeErrorJson | null;

/** badge_json プロパティ値のパース */
const parseBadgeJson = (badge_json?: string): ParsedBadgeJson =>
  JSON.parse(badge_json ?? "null") as ParsedBadgeJson;

/** badge_json プロパティをパースした値のバリデーション */
function validateBadgeJson(badge: ParsedBadgeJson): badge is BadgeJson {
  if (badge === null) return false;
  if ("error" in badge) return false;
  return true;
}

/** badge_json プロパティをパースした値の正規化 */
function normalizeBadgeJson(
  badge: BadgeJson | BadgeErrorJson | null,
): BadgeJson {
  const valid = validateBadgeJson(badge);
  if (!valid) return {};
  return badge;
}

function EarnedBadge(props: Props) {
  const parsedBadgeJson = parseBadgeJson(props.badge_json);
  const isValidBadgeJson = validateBadgeJson(parsedBadgeJson);
  const isExpired = props.badge_expired_at
    ? Date.parse(props.badge_expired_at) < Date.now()
    : false;
  const submittable = !isExpired && isValidBadgeJson;
  const badge = normalizeBadgeJson(parsedBadgeJson);
  const imageUrl: string | undefined =
    typeof badge.image === "string" ? badge.image : badge.image?.id;
  const ref = useRef<HTMLInputElement>(null);
  const backUrl = new URL("/dashboard?tab=badge", NEXT_PUBLIC_BASE_URL).href;
  const clearValidity = useDebouncedCallback(() => {
    ref.current?.setCustomValidity("");
  }, 3_000);
  const showValidity = () => {
    if (!ref.current || ref.current?.ariaDisabled === "false") return;
    const message =
      (isExpired && messages.expired) ||
      (!isValidBadgeJson && messages.unbadged) ||
      "";
    ref.current.setCustomValidity(message);
    ref.current.reportValidity();
    ref.current.checked = false;
    clearValidity();
  };
  const handleClick = () => {
    ref.current?.click();
    showValidity();
  };
  return (
    <div
      className={
        "jumpu-card pl-4 pr-6 py-4 flex items-center gap-4 has-checked:bg-primary-50 relative"
      }
      onClick={handleClick}
      onBlur={clearValidity}
    >
      <input
        type="checkbox"
        value={props.index}
        className="jumpu-input aria-disabled:bg-gray-200 aria-disabled:ring-0 aria-disabled:outline-none"
        tabIndex={submittable ? 0 : -1}
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
          showValidity();
        }}
        aria-disabled={!submittable}
      />
      {/* eslint-disable @next/next/no-img-element */}
      <img
        className="size-24"
        alt=""
        src={imageUrl ?? "/badge-placeholder.svg"}
      />
      <section className="h-20 my-2 space-y-1 max-w-96">
        <h3 className="text-lg font-semibold line-clamp-2">
          <a
            className="hover:underline underline-offset-4"
            href={
              new URL(
                `/credential/detail/${props.badge_vc_id}?back_url=${encodeURIComponent(backUrl)}`,
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
        <div className="flex gap-1 h-6.5">
          {isExpired && (
            <p className="jumpu-filled-tag bg-danger text-white">
              バッジ有効期限切れ
            </p>
          )}
          {props.submitted && (
            <p className="jumpu-filled-tag bg-success text-white">提出済み</p>
          )}
        </div>
      </section>
      <p className="prose propse-sm text-sm max-w-none line-clamp-1 absolute top-1 left-40">
        {props.lms_name}
      </p>
    </div>
  );
}

export default EarnedBadge;
