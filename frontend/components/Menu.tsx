import { useEffect, Fragment, useId } from "react";
import { useRouter } from "next/router";
import { Dialog, Transition } from "@headlessui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { pagesPath } from "lib/$path";
import contents from "lib/contents";

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
  const id = useId();
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={onClose}>
        <div className="fixed inset-0 overflow-y-auto">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="ease-out duration-300"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="w-full bg-white px-4 pt-3 pb-8 min-h-full relative">
              <button
                className="jumpu-icon-button group mb-8 sticky top-3"
                onClick={onClose}
                aria-describedby={id}
              >
                <Icon
                  className="text-xl text-primary-500"
                  icon="fa6-solid:xmark"
                />
                <span
                  id={id}
                  role="tooltip"
                  className="![transform:translate(-50%,_150%)_scale(0)] group-hover:![transform:translate(-50%,_150%)_scale(1)]"
                >
                  閉じる
                </span>
              </button>
              <section>
                <ul className="text-sm text-gray-700 leading-7">
                  {contents.map((content) => (
                    <li key={content.slug}>
                      <Link href={pagesPath._slug(content.slug).$url()}>
                        {content.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

export default Menu;
