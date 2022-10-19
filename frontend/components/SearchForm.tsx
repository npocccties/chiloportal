import { useState } from "react";
import { useRouter } from "next/router";
import { pagesPath } from "lib/$path";

type Props = {
  className?: string;
};

function SearchForm({ className }: Props) {
  const [keyword, setKeyword] = useState("");
  const router = useRouter();
  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    router.push(pagesPath.search.$url({ query: { q: keyword } }));
  };
  return (
    <form className={className}>
      <input
        className="jumpu-input mr-2"
        type="search"
        name="q"
        placeholder="学びたいキーワード"
        onInput={handleInput}
      />
      <button className="jumpu-button" type="submit" onClick={handleClick}>
        検索
      </button>
    </form>
  );
}

export default SearchForm;
