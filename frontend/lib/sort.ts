/** バッジ一覧の並び順（API の sort） */
export type Sort = "newest" | "oldest";

/** ページの ?sort= を API に渡す値にする。指定がなければ、管理画面で設定した初期値（default）を使う */
export function parseSortQuery(value: unknown): Sort | "default" {
  return value === "newest" || value === "oldest" ? value : "default";
}

export const sortLabels: Record<Sort, string> = {
  newest: "新しい順",
  oldest: "古い順",
};
