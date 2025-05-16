import { describe, test, expect } from "vitest";
import {
  isCurrentCourse,
  isEarnedBadge,
  isEarnableBadge,
  sortByDescendingAccessDateTime,
  sortByDescendingImportDateTime,
} from "./badge-status-list";
import { BadgeStatusList, BadgeStatus } from "pages/dashboard";

const base: BadgeStatus = {
  enrolled: false,
  issued: false,
  imported: false,
  submitted: false,
  lms_id: 0,
  lms_name: "LMS",
};

describe("受講中のコースの判定", () => {
  test("受講中かつ未インポートのとき該当", () => {
    const status: BadgeStatus = {
      ...base,
      enrolled: true,
    };
    const result = isCurrentCourse(status);
    expect(result).toEqual(true);
  });
  test("受講中かつインポート済みのとき非該当", () => {
    const status: BadgeStatus = {
      ...base,
      enrolled: true,
      imported: true,
    };
    const result = isCurrentCourse(status);
    expect(result).toEqual(false);
  });
  test("未受講かつ未インポートのとき非該当", () => {
    const status: BadgeStatus = base;
    const result = isCurrentCourse(status);
    expect(result).toEqual(false);
  });
});

describe("取得済みのバッジの判定", () => {
  test("受講中かつ未インポートのとき該当", () => {
    const status: BadgeStatus = {
      ...base,
      imported: true,
    };
    const result = isEarnedBadge(status);
    expect(result).toEqual(true);
  });
  test("未インポートのとき非該当", () => {
    const status: BadgeStatus = base;
    const result = isEarnedBadge(status);
    expect(result).toEqual(false);
  });
});

describe("取得可能なバッジの判定", () => {
  test("発行済みかつ未インポートのとき該当", () => {
    const status: BadgeStatus = {
      ...base,
      issued: true,
    };
    const result = isEarnableBadge(status);
    expect(result).toEqual(true);
  });
  test("発行済みかつインポート済みのとき非該当", () => {
    const status: BadgeStatus = {
      ...base,
      issued: true,
      imported: true,
    };
    const result = isEarnableBadge(status);
    expect(result).toEqual(false);
  });
  test("未発行かつ未インポートのとき非該当", () => {
    const status: BadgeStatus = base;
    const result = isEarnableBadge(status);
    expect(result).toEqual(false);
  });
});

test("最終アクセス日時降順に並べ替え", () => {
  const badgeStatusList: BadgeStatusList = [
    { ...base, accessed_at: "2025-05-01T00:00:01.000Z" },
    { ...base, accessed_at: "2025-05-01T00:00:03.000Z" },
    { ...base, accessed_at: "2025-05-01T00:00:02.000Z" },
  ];
  const result = badgeStatusList.toSorted(sortByDescendingAccessDateTime);
  expect(result).toEqual([
    { ...base, accessed_at: "2025-05-01T00:00:03.000Z" },
    { ...base, accessed_at: "2025-05-01T00:00:02.000Z" },
    { ...base, accessed_at: "2025-05-01T00:00:01.000Z" },
  ]);
});

test("インポート日時降順に並べ替え", () => {
  const badgeStatusList: BadgeStatusList = [
    { ...base, imported_at: "2025-05-01T00:00:01.000Z" },
    { ...base, imported_at: "2025-05-01T00:00:03.000Z" },
    { ...base, imported_at: "2025-05-01T00:00:02.000Z" },
  ];
  const result = badgeStatusList.toSorted(sortByDescendingImportDateTime);
  expect(result).toEqual([
    { ...base, imported_at: "2025-05-01T00:00:03.000Z" },
    { ...base, imported_at: "2025-05-01T00:00:02.000Z" },
    { ...base, imported_at: "2025-05-01T00:00:01.000Z" },
  ]);
});
