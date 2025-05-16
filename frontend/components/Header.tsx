import { Icon } from "@iconify/react";
import clsx from "clsx";
import Fallback from "components/Fallback";
import Menu from "components/Menu";
import Popover from "components/Popover";
import SearchForm from "components/SearchForm";
import UserPopover from "components/UserPopover";
import { pagesPath } from "lib/$path";
import useDialog from "lib/use-dialog";
import useIssuers from "lib/use-issuers";
import Image from "next/image";
import Link from "next/link";
import AllBadge from "public/all-badge.svg";
import Issuer from "public/issuer.svg";
import { useId } from "react";

type Props = {
  className?: string;
};

function Header({ className }: Props) {
  const { open, onOpen, onClose } = useDialog();
  const id = useId();
  const { data: issuers, error: issuersError } = useIssuers();
  return (
    <header className={clsx("bg-black", className)}>
      <div className="container flex items-center gap-1 px-6 py-3">
        <Link href={pagesPath.$url()} className="md:mr-10 shrink-0">
          <Image
            src="/logo.svg"
            width={128}
            height={32}
            alt="トップページに戻る"
          />
        </Link>
        <Link
          href={pagesPath.dashboard.$url({ query: {} })}
          className="hidden md:inline-flex jumpu-text-button text-white text-sm hover:bg-gray-700 items-center gap-2 whitespace-nowrap"
        >
          <Icon
            className="text-xl text-white size=[1.125rem]"
            icon="mdi:compass-outline"
          />
          ダッシュボード
        </Link>
        <Link
          href={pagesPath.discover.$url({ query: {} })}
          className="hidden md:inline-flex jumpu-text-button text-white text-sm hover:bg-gray-700 items-center gap-2 whitespace-nowrap"
        >
          <AllBadge className="stroke-white size-[1.125rem]" alt="" />
          コースを探す
        </Link>
        <Popover
          className="hidden md:block"
          title={
            <>
              <Issuer className="fill-white size-[1.125rem]" alt="" />
              <span>発行元</span>
            </>
          }
        >
          {({ close }) => (
            <ul
              role="menu"
              className="jumpu-card bg-black border-gray-500 text-white p-2 text-sm overflow-y-scroll max-h-[80vh]"
              aria-busy={!issuers}
              onClick={() => close()}
            >
              <Fallback
                data={issuers}
                error={issuersError}
                pending={
                  <li
                    className="flex justify-center items-center w-48 h-72"
                    aria-hidden
                  >
                    <div className="jumpu-spinner">
                      <svg viewBox="24 24 48 48">
                        <circle cx="48" cy="48" r="16" />
                      </svg>
                    </div>
                  </li>
                }
              >
                {(data) =>
                  data.map((issuer) => (
                    <li key={issuer.issuer_id} role="menuitem">
                      <Link
                        href={pagesPath.issuers
                          ._issuerId(issuer.issuer_id)
                          .$url()}
                        className="block w-max min-w-full px-4 py-3 rounded-sm hover:bg-gray-700"
                      >
                        {issuer.name}
                      </Link>
                    </li>
                  ))
                }
              </Fallback>
            </ul>
          )}
        </Popover>
        <div className="flex-1" />
        <SearchForm
          className="hidden lg:w-1/5 lg:inline-flex xl:w-auto"
          size="small"
        />
        <UserPopover />
        <button
          className="jumpu-icon-button hover:bg-gray-700 group lg:hidden ml-2"
          onClick={onOpen}
          aria-describedby={id}
        >
          <Icon className="text-xl text-white" icon="fa6-solid:bars" />
          <span
            id={id}
            role="tooltip"
            className="![transform:translate(-50%,_150%)_scale(0)] group-hover:![transform:translate(-50%,_150%)_scale(1)]"
          >
            メニュー
          </span>
        </button>
        <Menu open={open} onClose={onClose} />
      </div>
    </header>
  );
}

export default Header;
