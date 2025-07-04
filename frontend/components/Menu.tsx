import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Icon } from "@iconify/react";
import Fallback from "components/Fallback";
import { pagesPath } from "lib/$path";
import contents from "lib/contents";
import useIssuers from "lib/use-issuers";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useId } from "react";

type Props = {
  open: boolean;
  onClose(): void;
};
function Menu({ open, onClose }: Props) {
  const { events } = useRouter();
  useEffect(() => {
    events.on("routeChangeStart", onClose);
    return () => {
      events.off("routeChangeStart", onClose);
    };
  });
  const { data: issuers, error: issuersError } = useIssuers();
  const id = useId();
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="bg-transparent"
          enterTo="bg-black/30"
          leave="ease-out duration-300"
          leaveFrom="bg-black/30"
          leaveTo="bg-transparent"
        >
          <div className="fixed inset-0" />
        </TransitionChild>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="left-full"
          enterTo="left-0"
          leave="ease-out duration-300"
          leaveFrom="left-0"
          leaveTo="left-full"
        >
          <div className="fixed inset-0 overflow-x-hidden overflow-y-auto">
            <DialogPanel className="w-screen bg-white px-4 pt-6 pb-12 min-h-full relative">
              <div className="mb-8 sticky top-3 flex justify-end pr-6">
                <button
                  className="text-right jumpu-icon-button group mb-8 sticky top-6"
                  onClick={onClose}
                  aria-describedby={id}
                >
                  <Icon className="text-xl text-black" icon="fa6-solid:xmark" />
                  <span
                    id={id}
                    role="tooltip"
                    className="![transform:translate(-50%,_150%)_scale(0)] group-hover:![transform:translate(-50%,_150%)_scale(1)]"
                  >
                    閉じる
                  </span>
                </button>
              </div>
              <ul className="mb-12 space-y-1">
                <li>
                  <Link
                    className="jumpu-text-button font-bold w-full text-gray-700 hover:bg-gray-100"
                    href={pagesPath.$url()}
                  >
                    ホーム
                  </Link>
                </li>
                <li>
                  <Link
                    className="jumpu-text-button font-bold w-full text-gray-700 hover:bg-gray-100"
                    href={pagesPath.dashboard.$url({ query: {} })}
                  >
                    あなたのダッシュボード
                  </Link>
                </li>
                <li>
                  <Link
                    className="jumpu-text-button font-bold w-full text-gray-700 hover:bg-gray-100"
                    href={pagesPath.discover.$url({ query: {} })}
                  >
                    コースを探す
                  </Link>
                </li>
                <li>
                  <p className="text-gray-400 font-bold px-[1.25em] py-[0.75em]">
                    コース提供者
                  </p>
                  <ul className="pl-4 mb-3 space-y-1">
                    <Fallback
                      data={issuers}
                      error={issuersError}
                      pending={[...Array(5)].map((_, index) => (
                        <li
                          key={index}
                          className="animate-pulse rounded-sm bg-gray-100 h-8 mb-1"
                          aria-hidden
                        ></li>
                      ))}
                    >
                      {(data) =>
                        data.map((issuer) => (
                          <li key={issuer.issuer_id} role="menuitem">
                            <Link
                              href={pagesPath.issuers
                                ._issuerId(issuer.issuer_id)
                                .$url()}
                              className="jumpu-text-button font-bold w-full text-sm text-gray-700 hover:bg-gray-100"
                            >
                              {issuer.name}
                            </Link>
                          </li>
                        ))
                      }
                    </Fallback>
                  </ul>
                </li>
                <li>
                  <Link
                    className="jumpu-text-button font-bold w-full text-gray-700 hover:bg-gray-100"
                    href={pagesPath.search.$url({ query: { q: "" } })}
                  >
                    キーワード検索
                  </Link>
                </li>
              </ul>
              <ul className="space-y-1">
                {contents.map((content) => (
                  <li key={content.slug}>
                    <Link
                      className="jumpu-text-button font-bold w-full text-gray-700 hover:bg-gray-100"
                      href={pagesPath._slug(content.slug).$url()}
                    >
                      {content.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </DialogPanel>
          </div>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}

export default Menu;
