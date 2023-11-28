import { useEffect, Fragment, useId } from "react";
import { useRouter } from "next/router";
import { Dialog, Transition } from "@headlessui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { pagesPath } from "lib/$path";
import useConsumers from "lib/use-consumers";
import usePortalCategories from "lib/use-portal-categories";
import contents from "lib/contents";
import Fallback from "components/Fallback";

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
  const { data: consumers, error: consumersError } = useConsumers();
  const { data: portalCategories, error: portalCategoriesError } =
    usePortalCategories();
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
              <section className="mb-8">
                <h2 className="text-xs font-bold text-gray-700 mb-4">
                  カテゴリから探す
                </h2>
                <ul
                  className="text-sm text-gray-700 leading-8"
                  aria-busy={!portalCategories}
                >
                  <Fallback
                    data={portalCategories}
                    error={portalCategoriesError}
                    pending={[...Array(10)].map((_, index) => (
                      <li
                        key={index}
                        className="animate-pulse bg-gray-300 w-48 h-4 my-3 rounded-full"
                      />
                    ))}
                  >
                    {(data) =>
                      data.map((portalCateogry) => (
                        <li key={portalCateogry.portal_category_id}>
                          <Link
                            href={pagesPath.portal_categories
                              ._portalCategoryId(
                                portalCateogry.portal_category_id,
                              )
                              .$url({ query: {} })}
                          >
                            {portalCateogry.name}
                          </Link>
                        </li>
                      ))
                    }
                  </Fallback>
                </ul>
              </section>
              <section className="mb-8">
                <h2 className="text-xs font-bold text-gray-700 mb-4">
                  教員育成指標から探す
                </h2>
                <ul className="text-sm text-gray-700 leading-8">
                  <Fallback
                    data={consumers}
                    error={consumersError}
                    pending={[...Array(10)].map((_, index) => (
                      <li
                        key={index}
                        className="animate-pulse bg-gray-300 w-48 h-4 my-3 rounded-full"
                      />
                    ))}
                  >
                    {(data) =>
                      data.map((consumer) => (
                        <li key={consumer.consumer_id}>
                          <Link
                            href={pagesPath.consumers
                              ._consumerId(consumer.consumer_id)
                              .$url()}
                          >
                            {consumer.name}
                          </Link>
                        </li>
                      ))
                    }
                  </Fallback>
                </ul>
              </section>
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
