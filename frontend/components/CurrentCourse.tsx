import DOMPurify from "isomorphic-dompurify";
import { BadgeStatus } from "pages/dashboard";
import { useRef } from "react";

type Props = BadgeStatus & {
  index: number;
  onChecked?(index: number): void;
  onUnchecked?(index: number): void;
};

function CurrentCourse(props: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const handleClick = () => ref.current?.click();
  return (
    <div
      className={
        "jumpu-card pl-4 pr-6 py-4 flex items-center gap-4 has-checked:bg-primary-50"
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
      />
      <section>
        <h3 className="text-lg font-semibold mb-2 line-clamp-1">
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
          className="prose text-sm max-w-none [&>p]:first:line-clamp-3 h-30"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(props.course_description ?? ""),
          }}
        />
      </section>
    </div>
  );
}

export default CurrentCourse;
