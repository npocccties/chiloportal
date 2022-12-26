import { useEffect, Fragment } from "react";
import { useRouter } from "next/router";
import { Dialog, Transition } from "@headlessui/react";
import StagesTable from "components/StagesTable";
import { Consumer, Framework, Stage } from "api/@types";

type Props = {
  consumer: Consumer;
  framework: Framework;
  stages: Stage[];
  stage: Stage;
  open: boolean;
  onClose(): void;
};

function StagesDialog({
  consumer,
  framework,
  stages,
  stage,
  open,
  onClose,
}: Props) {
  const { events } = useRouter();
  useEffect(() => {
    events.on("routeChangeStart", onClose);
    return () => {
      events.off("routeChangeStart", onClose);
    };
  });
  return (
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
          <div className="fixed inset-0 bg-black bg-opacity-25" />
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
              <Dialog.Panel className="jumpu-card w-full max-w-xl rounded-xl bg-white p-6 shadow-xl">
                <Dialog.Title className="text-lg font-bold text-gray-500 mb-6">
                  {framework.name}の成長段階
                </Dialog.Title>
                <StagesTable
                  className="w-full"
                  consumer={consumer}
                  framework={framework}
                  stages={stages}
                  activeStageId={stage.stage_id}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default StagesDialog;
