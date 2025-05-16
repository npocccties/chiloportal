import { BadgeStatus, BadgeStatusList } from "pages/dashboard";
import groupBy from "just-group-by";

/** 受講中のコースの判定
 *
 * 受講中かつ未インポートを受講中のコースとみなします
 **/
export function isCurrentCourse(status: BadgeStatus): boolean {
  return status.enrolled && !status.imported;
}

/**
 * 取得済みのバッジの判定
 *
 * インポート済みを取得済みのバッジとみなします
 **/
export function isEarnedBadge(status: BadgeStatus): boolean {
  return status.imported;
}

/**
 * 取得可能なバッジの判定
 *
 * バッジ発行済みかつ未インポートを取得可能なバッジとみなします
 **/
export function isEarnableBadge(status: BadgeStatus): boolean {
  return status.issued && !status.imported;
}

/**
 * 取得可能か否かによるグループ化
 */
export function groupByEarnable(statusList: BadgeStatusList): {
  earnable?: BadgeStatusList;
  unearnable?: BadgeStatusList;
} {
  return groupBy(statusList, (status) =>
    isEarnableBadge(status) ? "earnable" : "unearnable",
  );
}

/**
 * エポックミリ秒への変換
 * @param iso8601 ISO 8601 形式
 * @description 値が undefined のとき、0 を返します。
 * @returns エポックミリ秒
 */
export function toEpochMillis(iso8601?: string): number {
  if (!iso8601) return 0;
  return Date.parse(iso8601);
}

/** 最終アクセス日時降順にする比較関数 */
export function sortByDescendingAccessDateTime(
  a: BadgeStatus,
  b: BadgeStatus,
): number {
  const aMillis = toEpochMillis(a.accessed_at);
  const bMillis = toEpochMillis(b.accessed_at);
  if (aMillis > bMillis) return -1;
  if (aMillis < bMillis) return 1;
  return 0;
}

/** インポート日時降順にする比較関数 */
export function sortByDescendingImportDateTime(
  a: BadgeStatus,
  b: BadgeStatus,
): number {
  const aMillis = toEpochMillis(a.imported_at);
  const bMillis = toEpochMillis(b.imported_at);
  if (aMillis > bMillis) return -1;
  if (aMillis < bMillis) return 1;
  return 0;
}
