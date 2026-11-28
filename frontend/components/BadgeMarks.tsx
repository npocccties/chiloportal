import clsx from "clsx";
import { Label } from "api/@types";

type Props = {
  className?: string;
  isNew?: boolean;
  labels?: Label[];
};

// 白い文字との色の差（コントラスト）が十分にとれる濃さにする
const labelColors: Record<Label["color"], string> = {
  gray: "bg-gray-600",
  blue: "bg-blue-700",
  green: "bg-green-700",
  orange: "bg-orange-700",
  red: "bg-red-700",
  purple: "bg-purple-700",
};

/** バッジ名の横に出す NEW とラベル */
function BadgeMarks({ className, isNew, labels = [] }: Props) {
  if (!isNew && labels.length === 0) return null;
  return (
    <span
      className={clsx("inline-flex flex-wrap gap-1 align-middle", className)}
    >
      {isNew && (
        <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white bg-red-600">
          NEW
        </span>
      )}
      {labels.map((label) => (
        <span
          key={label.name}
          className={clsx(
            "px-2 py-0.5 rounded-full text-xs font-bold text-white",
            labelColors[label.color] ?? labelColors.gray,
          )}
        >
          {label.name}
        </span>
      ))}
    </span>
  );
}

export default BadgeMarks;
