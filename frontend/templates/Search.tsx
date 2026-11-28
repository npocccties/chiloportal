import { Props } from "pages/search";
import Breadcrumbs from "components/Breadcrumbs";
import Container from "components/Container";
import Pagination from "components/Pagination";
import SearchForm from "components/SearchForm";
import WisdomBadgesItem from "components/WisdomBadgesItem";
import { pagesPath } from "lib/$path";
import SortLinks from "components/SortLinks";
import { Sort } from "lib/sort";

export default function Search({ keyword, wisdomBadgesList }: Props) {
  const currentSort = wisdomBadgesList?.sort;
  const handleHref = (page: number) =>
    pagesPath.search.$url({
      query: { q: keyword, p: String(page), sort: currentSort },
    });
  const handleSortHref = (sort: Sort) =>
    pagesPath.search.$url({ query: { q: keyword, sort } });
  return (
    <Container as="article">
      <Breadcrumbs
        className="mb-6"
        nodes={[{ name: "トップ", href: pagesPath.$url() }]}
        leaf="キーワード検索"
      />
      <header className="mb-6">
        <h1 className="text-2xl text-gray-700 mb-4">キーワード検索</h1>
        {keyword && wisdomBadgesList && (
          <p className="mb-6">
            「{keyword}」に関連するバッジが{wisdomBadgesList.total_count}
            件あります
          </p>
        )}
        <SearchForm
          className="min-w-full md:min-w-[75%]"
          size="large"
          variant="light"
        />
      </header>
      {wisdomBadgesList && (
        <>
          <SortLinks
            className="mb-6"
            current={currentSort}
            handleHref={handleSortHref}
          />
          <ul className="mb-10">
            {wisdomBadgesList.badges.map((wisdomBadges) => (
              <li key={wisdomBadges.badges_id}>
                <WisdomBadgesItem wisdomBadges={wisdomBadges} />
              </li>
            ))}
          </ul>
          <Pagination
            className="justify-center"
            totalCount={wisdomBadgesList.total_count}
            start={wisdomBadgesList.start}
            end={wisdomBadgesList.end}
            handleHref={handleHref}
          />
        </>
      )}
    </Container>
  );
}
