import clsx from "clsx";
import { Popover as Base } from "@headlessui/react";
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
      <Base.Button className="group jumpu-text-button text-primary-700 inline-flex items-center rounded-md text-sm">
        <span className="pr-2 whitespace-nowrap">{title}</span>
        <Icon
          icon="fa6-solid:chevron-down"
          className="text-primary-600"
          aria-hidden="true"
        />
      </Base.Button>
      <Base.Panel className="absolute left-0 z-10 mt-1 transform">
        {({ close }) => <>{children({ close })}</>}
      </Base.Panel>
    </Base>
  );
}

export default Popover;
