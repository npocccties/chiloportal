import clsx from "clsx";
import { Icon } from "@iconify/react";
import { useState } from "react";
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
      <Icon
        className={clsx(
          "absolute top-1/2 left-rel4 -translate-y-1/2",
          variant === "dark" && "text-white",
          variant === "light" && "text-dark",
        )}
        icon="fa-solid:search"
      />
      <input
        required
        className={clsx(
          "jumpu-input !rounded-full w-full !pl-rel10 pr-2",
          variant === "dark" && "bg-black !text-white border-white",
        )}
        type="search"
        name="q"
        placeholder="学びたいキーワード"
        onInput={handleInput}
      />
    </form>
  );
}

export default SearchForm;
