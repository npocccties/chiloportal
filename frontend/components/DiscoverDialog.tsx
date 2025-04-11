import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import { Props } from "pages/discover";
import DiscoverNav from "./DiscoverNav";

function toLabel(props: Props): string {
  switch (props.type) {
    case "all":
      return "すべてのバッジ";
    case "issuer":
      return props.issuer.name;
    case "category":
      return props.portalCategory.name;
    case "framework":
      return props.framework.name;
  }
}

export default function DiscoverDialog(props: Props & { className?: string }) {
  const [open, setOpen] = useState(false);
  const label = toLabel(props);
  const handleClick = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  return (
    <>
      <button
        type="button"
        className={clsx(
          "jumpu-outlined-button text-black border-1 border-gray-400 w-full text-left flex justify-between items-center",
          props.className,
        )}
        onClick={handleClick}
      >
        {label}
        <Icon icon="fa6-solid:chevron-down" />
      </button>
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-20" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="jumpu-card w-full max-w-xl rounded-xl bg-white mt-44 p-6 shadow-xl">
                  <Dialog.Title className="text-sm font-bold text-gray-500 mb-4">
                    以下のメニューからバッジを取り込んで探すことができます。
                  </Dialog.Title>
                  <hr className="border-gray-300 mb-4" />
                  <DiscoverNav {...props} onClick={onClose} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
