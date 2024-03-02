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
      className={clsx("bg-gray-800 mt-4 pb-32 lg:pb-10 py-10", className)}
    >
      <div className="max-w-5xl xl:max-w-7xl mx-auto px-16 xl:px-4 flex flex-col xl:justify-center sm:flex-row flex-wrap gap-x-24 gap-y-8 mb-10 ">
        <div className="w-full xl:w-auto -translate-y-2">
          <Link href={pagesPath.$url()} className="inline-block -translate-x-3">
            <Image
              src="/logo-white.svg"
              width={108}
              height={24}
              alt="トップページに戻る"
              className="w-40"
            />
          </Link>
        </div>
        <ul className="text-gray-300 text-xs leading-8 md:leading-6 xl:columns-2 [&>li]:break-inside-avoid">
          {contents.map((content) => (
            <li key={content.slug}>
              <Link
                href={pagesPath._slug(content.slug).$url()}
                className="hover:text-white"
              >
                {content.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-center text-gray-300 text-xs px-2">
        <p>Copyright &copy; Osaka Kyoiku University. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
