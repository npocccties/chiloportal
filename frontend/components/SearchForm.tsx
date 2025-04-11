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
          "jumpu-input !rounded-full w-full !pr-[5em]",
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
          "jumpu-outlined-button font-bold text-sm rounded-full absolute top-1/2 right-[0.25em] -translate-y-1/2 px-[1em] py-[0.25em]",
          size === "small" && "right-[0.25em]",
          size === "medium" && "right-[0.5em]",
          size === "large" && "right-[0.75em]",
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
