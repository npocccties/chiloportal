import clsx from "clsx";
import { Popover as Base } from "@headlessui/react";

type Props = {
  className?: string;
  title: React.ReactNode;
  disabled?: boolean;
  children(props: {
    close: (
      ref?: React.MutableRefObject<HTMLElement | null> | HTMLElement,
    ) => void;
  }): React.ReactNode;
};

function Popover({ title, className, children }: Props) {
  return (
    <Base className={clsx("relative", className)}>
      <Base.Button className="group jumpu-text-button text-white hover:bg-gray-700 inline-flex items-center rounded-md text-sm whitespace-nowrap gap-2">
        {title}
      </Base.Button>
      <Base.Panel className="absolute left-0 z-10 mt-1 transform">
        {({ close }) => <>{children({ close })}</>}
      </Base.Panel>
    </Base>
  );
}

export default Popover;
