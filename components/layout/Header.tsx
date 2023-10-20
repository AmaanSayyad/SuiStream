import React, { useState } from "react";
import { useAddress } from "@thirdweb-dev/react";
import UserMenu from "./UserMenu";
import ConnectMetamask from "./ConnectMetamask";
import { useRecoilValue } from "recoil";
import { currentUserState } from "../../recoil/states";
import Link from "next/link";
import CreateProfile from "./CreateProfile";

const Header = () => {
  const currentUserAddress = useAddress();
  const [createProfileModal, setCreateProfileModal] = useState<boolean>(false);
  const currentUser = useRecoilValue(currentUserState);

  return (
    <>
      <header className="sticky z-20  bg-gray-900 top-0 left-0 border-b border-gray-700">
        <nav className="py-3 px-4 flex justify-between items-center">
          <div className=" flex items-center gap-3  ">
            <Link href="/">
              <img
                src="/logo.svg"
                alt="logo"
                className="hover:scale-110 duration-300 ease-out cursor-pointer "
              />
            </Link>
            <h1 className="font-display font-bold text-2xl ">Super Stream</h1>
          </div>
          <div className="flex gap-3 items-center ">
            {!currentUser.loading && !currentUser.hasProfile && (
              <Link href="/signup">
                <button className="bg-violet-600 hover:bg-violet-500">
                  Create Profile
                </button>
              </Link>
            )}
            {!currentUserAddress && !currentUser.hasProfile ? (
              <ConnectMetamask />
            ) : (
              <UserMenu />
            )}
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
