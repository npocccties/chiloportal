function usePagination(
  totalCount: number,
  start: number,
  end: number,
): {
  totalPages: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
  pages: (number | string)[];
} {
  const perPage = end - start + 1;
  const totalPages = Math.ceil(totalCount / perPage);
  const currentPage = Math.ceil(end / perPage);
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;
  const prevPage = 1 < currentPage ? currentPage - 1 : null;
  const pages =
    totalPages < 8
      ? Array.from({ length: Math.min(totalPages, 7) }, (_, index) => index + 1)
      : null;
  const head =
    currentPage < 5
      ? Array.from({ length: 5 }, (_, index) => index + 1)
      : [1, "…"];
  const middle =
    5 <= currentPage && currentPage <= totalPages - 4
      ? [currentPage - 1, currentPage, currentPage + 1]
      : [];
  const tail =
    totalPages - 4 < currentPage
      ? Array.from({ length: 5 }, (_, index) => totalPages - index).reverse()
      : ["…", totalPages];
  return {
    totalPages,
    currentPage,
    nextPage,
    prevPage,
    pages: pages ?? [...head, ...middle, ...tail],
  };
}

export default usePagination;
