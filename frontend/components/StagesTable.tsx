import clsx from "clsx";
import { Icon } from "@iconify/react";
import { Consumer, Framework, Stage } from "api/@types";
import { pagesPath } from "lib/$path";
import Link, { LinkProps } from "components/Link";

type Props = {
  className?: string;
  consumer: Consumer;
  framework: Framework;
  stages: Stage[];
  activeStageId?: number;
};

function StageLink({
  className,
  name,
  href,
  active,
}: {
  className?: string;
  name: string;
  href: LinkProps["href"];
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "px-4 py-2 flex gap-4 items-center",
        active ? "bg-primary-200" : "hover:bg-primary-50",
        className
      )}
    >
      <span className="flex-1 text-ellipsis">{name}</span>
      <Icon
        className="inline text-gray-400 text-base flex-shrink-0"
        icon="fa6-solid:chevron-right"
      />
    </Link>
  );
}

function StagesTable({
  className,
  consumer,
  framework,
  stages,
  activeStageId,
}: Props) {
  const handleHref = (stage: Stage) =>
    pagesPath.consumers
      ._consumerId(consumer.consumer_id)
      .frameworks._frameworkId(framework.framework_id)
      .stages._stageId(stage.stage_id)
      .$url();
  return (
    <table className={clsx("border-collapse border-gray-200", className)}>
      <tbody>
        {stages.map((stage) => (
          <tr key={stage.stage_id}>
            {stage.sub_name === "" ? (
              <td className="border p-0 text-gray-700" colSpan={2}>
                <StageLink
                  name={stage.name}
                  href={handleHref(stage)}
                  active={stage.stage_id === activeStageId}
                />
              </td>
            ) : (
              <>
                <th className="border px-4 py-2 text-left text-gray-700 font-normal">
                  {stage.name}
                </th>
                <td className="border p-0 text-xs">
                  <StageLink
                    className="min-h-[2.5rem]"
                    name={stage.sub_name}
                    href={handleHref(stage)}
                    active={stage.stage_id === activeStageId}
                  />
                </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default StagesTable;
