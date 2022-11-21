import clsx from "clsx";
import { Icon } from "@iconify/react";
import { Fragment } from "react";
import Link, { LinkProps } from "components/Link";

type Props = {
  className?: string;
  nodes: { name: string; href: LinkProps["href"] }[];
  leaf: string;
};

function Breadcrumbs({ className, nodes, leaf }: Props) {
  return (
    <div className={clsx("text-gray-700", className)}>
      {nodes.map((node, index) => (
        <Fragment key={index}>
          <Link href={node.href} className="underline mr-2">
            {node.name}
          </Link>
          <Icon className="inline mr-2" icon="fa6-solid:chevron-right" />
        </Fragment>
      ))}
      <span>{leaf}</span>
    </div>
  );
}

export default Breadcrumbs;
