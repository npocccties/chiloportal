import useUserAttributes from "lib/use-user-attributes";
import Popover from "components/Popover";
import {
  NEXT_PUBLIC_SHIBBOLETH_SP_LOGIN_URL,
  NEXT_PUBLIC_SHIBBOLETH_SP_LOGOUT_URL,
} from "lib/env";
import { Icon } from "@iconify/react";
import { useId } from "react";

function LoggedIn() {
  return (
    <li role="menuitem">
      <a
        className="block w-max min-w-full px-4 py-3 rounded-sm hover:bg-gray-700"
        href={NEXT_PUBLIC_SHIBBOLETH_SP_LOGOUT_URL}
      >
        ログアウト
      </a>
    </li>
  );
}

function NotLoggedIn() {
  return (
    <li role="menuitem">
      <a
        className="block w-max min-w-full px-4 py-3 rounded-sm hover:bg-gray-700"
        href={NEXT_PUBLIC_SHIBBOLETH_SP_LOGIN_URL}
      >
        ログイン
      </a>
    </li>
  );
}

type Props = {
  className?: string;
};

function UserPopover({ className }: Props) {
  const { data } = useUserAttributes();
  const id = useId();

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
            {data ? data.displayName : "ゲスト"}
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
          {data ? <LoggedIn /> : <NotLoggedIn />}
        </ul>
      )}
    </Popover>
  );
}

export default UserPopover;
