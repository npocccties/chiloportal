import { Fragment } from "react";
import clsx from "clsx";
import { Popover as Base, Transition } from "@headlessui/react";
import { Icon } from "@iconify/react";

type Props = {
  className?: string;
  title: string;
  disabled?: boolean;
  children(props: {
    close: (
      ref?: React.MutableRefObject<HTMLElement | null> | HTMLElement
    ) => void;
  }): React.ReactNode;
};

function Popover({ title, className, children }: Props) {
  return (
    <Base className={clsx("relative", className)}>
      <Base.Button className="group jumpu-text-button text-gray-700 inline-flex items-center rounded-md text-base font-medium">
        <span className="pr-2">{title}</span>
        <Icon
          icon="fa6-solid:chevron-down"
          className="transition duration-150 ease-in-out"
          aria-hidden="true"
        />
      </Base.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Base.Panel className="absolute left-0 z-10 mt-1 transform">
          {({ close }) => <>{children({ close })}</>}
        </Base.Panel>
      </Transition>
    </Base>
  );
}

export default Popover;
