import { Props } from "pages/search";
import Breadcrumbs from "components/Breadcrumbs";
import Container from "components/Container";
import Pagination from "components/Pagination";
import SearchForm from "components/SearchForm";
import WisdomBadgesItem from "components/WisdomBadgesItem";
import { pagesPath } from "lib/$path";

export default function Search({ keyword, wisdomBadgesList }: Props) {
  const handleHref = (page: number) =>
    pagesPath.search.$url({
      query: { q: keyword, p: String(page) },
    });
  return (
    <Container as="article">
      <Breadcrumbs
        className="mb-6"
        nodes={[{ name: "トップ", href: pagesPath.$url() }]}
        leaf="検索結果"
      />
      <header className="mb-12">
        <h1 className="text-2xl text-gray-700 mb-4">検索結果「{keyword}」</h1>
        <p className="mb-8">
          「{keyword}」に関連する能力バッジが{wisdomBadgesList.total_count}
          件あります
        </p>
        <SearchForm />
      </header>
      <ul>
        {wisdomBadgesList.badges.map((wisdomBadges) => (
          <li className="mb-8" key={wisdomBadges.badges_id}>
            <WisdomBadgesItem wisdomBadges={wisdomBadges} />
          </li>
        ))}
      </ul>
      <Pagination
        totalCount={wisdomBadgesList.total_count}
        start={wisdomBadgesList.start}
        end={wisdomBadgesList.end}
        handleHref={handleHref}
      />
    </Container>
  );
}
