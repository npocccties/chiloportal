import clsx from "clsx";
import Link, { LinkProps } from "next/link";
import { Post } from "schemas";

type Props = LinkProps & {
  className?: string;
  post: Post;
};

export default function PostLink({ className, post, ...props }: Props) {
  return (
    <Link
      className={clsx(
        "flex items-center justify-between gap-4 border-l-4 border-gray-100 pl-4 text-sm hover:bg-gray-50 py-1 pr-1 [&>span:first-child]:hover:underline",
        className,
      )}
      {...props}
    >
      <span>{post.title}</span>
      <span className="flex-shrink-0 p-2 text-xs text-primary-950 bg-gray-100 rounded">
        {post.datePublished}
      </span>
    </Link>
  );
}
