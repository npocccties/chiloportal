import clsx from "clsx";
import { Icon } from "@iconify/react";
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
          "jumpu-input !rounded-full w-full !pr-rel11",
          variant === "dark" && "bg-black !text-white border-white",
        )}
        type="search"
        name="q"
        placeholder="学びたいキーワード"
        onInput={handleInput}
      />
      <button
        type="submit"
        className={clsx(
          "jumpu-icon-button rounded-full group absolute top-1/2 right-rel1 -translate-y-1/2",
          size === "small" && "right-rel1",
          size === "medium" && "right-rel2",
          size === "large" && "right-rel3",
          variant === "dark" && "hover:bg-gray-700",
        )}
        aria-describedby={tooltipId}
      >
        <Icon
          className={clsx(
            variant === "dark" && "text-white",
            variant === "light" && "text-dark",
          )}
          icon="fa-solid:search"
        />
        <span
          id={tooltipId}
          role="tooltip"
          className="-translate-x-1/2 !translate-y-[150%] group-hover:-translate-x-1/2 group-hover:translate-y-[150%]"
        >
          検索
        </span>
      </button>
    </form>
  );
}

export default SearchForm;
