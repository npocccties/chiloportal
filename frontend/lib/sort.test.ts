import { describe, expect, test } from "vitest";
import { parseSortQuery } from "./sort";

describe("parseSortQuery", () => {
  test("新しい順・古い順はそのまま API に渡す", () => {
    expect(parseSortQuery("newest")).toBe("newest");
    expect(parseSortQuery("oldest")).toBe("oldest");
  });
  test("指定がない・知らない値・複数のときは、管理画面の初期値を使う", () => {
    expect(parseSortQuery(undefined)).toBe("default");
    expect(parseSortQuery("random")).toBe("default");
    expect(parseSortQuery(["newest", "oldest"])).toBe("default");
  });
});
