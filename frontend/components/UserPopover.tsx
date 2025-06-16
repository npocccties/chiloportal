import { Icon } from "@iconify/react";
import Popover from "components/Popover";
import {
  NEXT_PUBLIC_SHIBBOLETH_SP_LOGIN_URL,
  NEXT_PUBLIC_SHIBBOLETH_SP_LOGOUT_URL,
} from "lib/env";
import useUserAttributes from "lib/use-user-attributes";
import { useId } from "react";

type Props = {
  className?: string;
};

function UserPopover({ className }: Props) {
  const { data } = useUserAttributes();
  const id = useId();

  if (!data)
    return (
      <a
        className="jumpu-text-button text-sm text-white hover:bg-gray-700"
        href={NEXT_PUBLIC_SHIBBOLETH_SP_LOGIN_URL}
      >
        ログイン
      </a>
    );

  return (
    <Popover
      className={className}
      title={
        <>
          <Icon
            className="text-xl text-white size=[1.125rem]"
            icon="mdi:user-outline"
            aria-labelledby={id}
          />
          <span
            id={id}
            className="hidden lg:inline overflow-hidden max-w-[6rem] whitespace-nowrap text-ellipsis"
          >
            {data.displayName}
          </span>
        </>
      }
    >
      {({ close }) => (
        <ul
          className="jumpu-card bg-black border-gray-500 text-white p-2 text-sm max-h-[80vh]"
          role="menu"
          onClick={() => close()}
        >
          <li role="menuitem">
            <a
              className="block w-max min-w-full px-4 py-3 rounded-sm hover:bg-gray-700"
              href={NEXT_PUBLIC_SHIBBOLETH_SP_LOGOUT_URL}
            >
              ログアウト
            </a>
          </li>
        </ul>
      )}
    </Popover>
  );
}

export default UserPopover;
