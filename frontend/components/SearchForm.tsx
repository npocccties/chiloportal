import clsx from "clsx";
import { useState, useId } from "react";
import { useRouter } from "next/router";
import { pagesPath } from "lib/$path";

type Props = {
  className?: string;
  size?: "small" | "medium" | "large";
  variant?: "dark" | "light";
};

function SearchForm({ className, size = "medium", variant = "dark" }: Props) {
  const [keyword, setKeyword] = useState("");
  const router = useRouter();
  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    router.push(pagesPath.search.$url({ query: { q: keyword } }));
  };
  const tooltipId = useId();
  return (
    <form
      className={clsx(
        "inline-flex gap-1 item-center relative",
        size === "small" && "text-sm",
        size === "large" && "text-lg",
        className,
      )}
      onSubmit={handleSubmit}
    >
      <input
        required
        className={clsx(
          "jumpu-input !rounded-full w-full !pr-rel20",
          variant === "dark" && "bg-black !text-white border-white",
        )}
        type="search"
        name="q"
        placeholder="キーワード"
        onInput={handleInput}
      />
      <button
        type="submit"
        className={clsx(
          "jumpu-outlined-button font-bold text-sm rounded-full absolute top-1/2 right-rel1 -translate-y-1/2 px-rel4 py-rel1",
          size === "small" && "right-rel1",
          size === "medium" && "right-rel2",
          size === "large" && "right-rel3",
          variant === "dark" &&
            "text-white bg-gray-800 border-gray-600 hover:bg-gray-700",
        )}
        aria-describedby={tooltipId}
      >
        検索
      </button>
    </form>
  );
}

export default SearchForm;
