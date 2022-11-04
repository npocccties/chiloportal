import clsx from "clsx";
import { useState } from "react";
import { useRouter } from "next/router";
import { pagesPath } from "lib/$path";

type Props = {
  className?: string;
  size?: "small" | "medium" | "large";
};

function SearchForm({ className, size = "medium" }: Props) {
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
    <form className={clsx("inline-flex gap-1 itemc-center", className)}>
      <input
        className={clsx(
          "jumpu-input flex-1 mr-2",
          { ["text-sm"]: size === "small" },
          { ["text-lg"]: size === "large" }
        )}
        type="search"
        name="q"
        placeholder="学びたいキーワード"
        onInput={handleInput}
      />
      <button
        className={clsx(
          "jumpu-button",
          { ["text-sm"]: size === "small" },
          { ["text-lg"]: size === "large" }
        )}
        type="submit"
        onClick={handleClick}
      >
        検索
      </button>
    </form>
  );
}

export default SearchForm;
