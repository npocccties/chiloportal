import { useState } from "react";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Consumer, BadgeDetail2 } from "api/@types";
import useWisdomBadgesConsumers from "lib/use-wisdom-badges-consumers";
import Fallback from "components/Fallback";

function Consumers({ consumers }: { consumers: Consumer[] }) {
  return (
    <ul className="pl-8 list-disc text-gray-700">
      {consumers.map((consumer) => {
        return <li key={consumer.consumer_id}>{consumer.name}</li>;
      })}
    </ul>
  );
}

type Props = {
  wisdomBadges: BadgeDetail2;
  open: boolean;
  onClose(): void;
};

function WisdomBadgesDialog({ wisdomBadges, open, onClose }: Props) {
  const [shouldFetch, setShouldFetch] = useState(false);
  const { data: consumers, error: consumersError } = useWisdomBadgesConsumers(
    wisdomBadges.badges_id,
    shouldFetch,
  );
  const handleEnter = () => {
    setShouldFetch(true);
  };
  const handleLeave = () => {
    setShouldFetch(false);
  };
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
          beforeEnter={handleEnter}
          afterLeave={handleLeave}
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
                  このバッジは以下の教育委員会に認定されています
                </Dialog.Title>
                <Fallback
                  data={consumers}
                  error={consumersError}
                  pending={
                    <div
                      className="flex justify-center items-center w-full h-48"
                      aria-hidden
                    >
                      <div className="jumpu-spinner">
                        <svg viewBox="24 24 48 48">
                          <circle cx="48" cy="48" r="16" />
                        </svg>
                      </div>
                    </div>
                  }
                  fallback={
                    <p className="font-bold">
                      認定している教育委員会は今のところありません。
                    </p>
                  }
                >
                  {(data) => <Consumers consumers={data} />}
                </Fallback>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default WisdomBadgesDialog;
