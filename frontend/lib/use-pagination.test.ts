import { describe, test, expect } from "vitest";
import usePagination from "./use-pagination";

describe("全件29件のとき", () => {
  test("10件目まで表示するのは1ページ目", () => {
    const result = usePagination({ totalCount: 29, perPage: 10, end: 10 });
    expect(result).toEqual({
      currentPage: 1,
      prevPage: null,
      nextPage: 2,
      pages: [1, 2, 3],
      totalPages: 3,
    });
  });

  test("20件目まで表示するのは2ページ目", () => {
    const result = usePagination({ totalCount: 29, perPage: 10, end: 20 });
    expect(result).toEqual({
      currentPage: 2,
      prevPage: 1,
      nextPage: 3,
      pages: [1, 2, 3],
      totalPages: 3,
    });
  });

  test("29件目まで表示するのは3ページ目", () => {
    const result = usePagination({ totalCount: 29, perPage: 10, end: 29 });
    expect(result).toEqual({
      currentPage: 3,
      prevPage: 2,
      nextPage: null,
      pages: [1, 2, 3],
      totalPages: 3,
    });
  });
});
