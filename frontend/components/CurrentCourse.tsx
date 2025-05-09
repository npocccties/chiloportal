import DOMPurify from "isomorphic-dompurify";
import { BadgeStatus } from "pages/dashboard";
import { useRef } from "react";

type Props = BadgeStatus & {
  index: number;
  onChecked?(index: number): void;
  onUnchecked?(index: number): void;
};

const messages = {
  expired:
    "コースで発行されたバッジの有効期限を過ぎているため、バッジを獲得することはできません。",
  unissued:
    "コースでバッジが発行されていないため、バッジを獲得することはできません。",
} as const;

function CurrentCourse(props: Props) {
  const isExpired = props.badge_expired_at
    ? Date.parse(props.badge_expired_at) < Date.now()
    : false;
  const earnable = !isExpired && props.issued;
  const ref = useRef<HTMLInputElement>(null);
  const showInvalidity = () => {
    if (!ref.current || ref.current?.ariaDisabled === "false") return;
    const message =
      (isExpired && messages.expired) ||
      (!props.issued && messages.unissued) ||
      "";
    ref.current.setCustomValidity(message);
    ref.current.reportValidity();
    ref.current.checked = false;
  };
  const handleClick = () => {
    ref.current?.click();
    showInvalidity();
  };
  const handleBlur = () => {
    ref.current?.setCustomValidity("");
  };
  return (
    <div
      className={
        "jumpu-card pl-4 pr-6 py-4 flex items-center gap-4 has-checked:bg-primary-50 relative"
      }
      onClick={handleClick}
      onBlur={handleBlur}
    >
      <input
        type="checkbox"
        value={props.index}
        className="jumpu-input aria-disabled:bg-gray-200 aria-disabled:ring-0 aria-disabled:outline-none"
        tabIndex={earnable ? 0 : -1}
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
          showInvalidity();
        }}
        aria-disabled={!earnable}
      />
      <section className="space-y-1">
        <h3 className="text-lg font-semibold line-clamp-1">
          <a
            className="hover:underline underline-offset-4"
            href={
              new URL(`/course/view.php?id=${props.course_id}`, props.lms_url)
                .href
            }
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {props.course_name}
          </a>
        </h3>
        <div
          className="prose prose-sm text-sm max-w-none [&>p]:first:line-clamp-3 h-30"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(props.course_description ?? ""),
          }}
        />
      </section>
      <div className="flex gap-1 h-6.5 absolute bottom-1 right-1">
        {isExpired && (
          <p className="jumpu-filled-tag bg-danger text-white">有効期限切れ</p>
        )}
        {earnable && (
          <p className="jumpu-filled-tag bg-success text-white">獲得可能</p>
        )}
      </div>
    </div>
  );
}

export default CurrentCourse;
