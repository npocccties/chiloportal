import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import { pagesPath } from "lib/$path";
import contents from "lib/contents";

type Props = {
  className?: string;
};

function Footer({ className }: Props) {
  return (
    <footer
      className={clsx("bg-black mt-4 lg:pb-10 pt-12 pb-32 md:py-8", className)}
    >
      <div className="container px-6 flex flex-col md:flex-row items-center justify-center gap-10">
        <Link href={pagesPath.$url()} className="flex-shrink-0">
          <Image
            src="/logo.svg"
            width={128}
            height={32}
            alt="トップページに戻る"
          />
        </Link>
        <ul className="text-white text-xs flex items-center flex-wrap gap-4">
          {contents.map((content) => (
            <li key={content.slug}>
              <Link
                href={pagesPath._slug(content.slug).$url()}
                className="hover:underline"
              >
                {content.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
