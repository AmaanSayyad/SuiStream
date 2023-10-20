import React from "react";
import { Menu } from "@headlessui/react";
import Link from "next/link";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { useAddress, useDisconnect } from "@thirdweb-dev/react";
import { useRecoilValue } from "recoil";
import { currentUserState } from "../../recoil/states";
import Copyable from "../Copyable";

export const parseAddress = (address) => {
  return address.slice(0, 6) + "..." + address.slice(-5, -1);
};

const UserMenu = () => {
  const currentUser = useRecoilValue(currentUserState);
  const disconnect = useDisconnect();
  const address = useAddress();

  const handleDisconnect = () => {
    disconnect();
    window.location.reload();
  };

  return (
    <>
      {currentUser.hasProfile && (
        <button disabled className="bg-violet-900 bg-opacity-50 text-violet-400">
          <Copyable text={parseAddress(address)} copyText={address}/>
        </button>
      )}
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="bg-slate-700 flex relative gap-2 rounded-lg py-1 px-2 pl-3 ">
          {currentUser.hasProfile
            ? currentUser?.profile?.username
            : address && parseAddress(address)}
          <ChevronDownIcon className="h-4 w-4" />
        </Menu.Button>
        <Menu.Items className="absolute  bg-slate-800 shadow-2xl right-0 m-2 rounded-lg">
          <div className="p-1 text-left flex flex-col min-w-fit gap-1">
            {currentUser.hasProfile && (
              <Menu.Item>
                <Link href={`/u/${currentUser?.profile?.username}`}>
                  <a className="px-4 py-1 whitespace-nowrap font-display hover:bg-slate-700 rounded-lg">
                    My Channel
                  </a>
                </Link>
              </Menu.Item>
            )}
            {currentUser.hasProfile && (
              <Menu.Item>
                <Link href={`/dashboard`}>
                  <a className="px-4 py-1 whitespace-nowrap font-display text-left hover:bg-slate-700 rounded-lg">
                    Dashboard
                  </a>
                </Link>
              </Menu.Item>
            )}
            <hr className=" border-gray-600" />
            <Menu.Item>
              <button
                onClick={handleDisconnect}
                className=" hover:bg-slate-700 px-4 py-1 w-full block text-left rounded-lg font-normal"
              >
                Disconnect{" "}
              </button>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Menu>
    </>
  );
};

export default UserMenu;
