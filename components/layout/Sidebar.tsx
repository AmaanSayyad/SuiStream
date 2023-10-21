import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import React, { JSXElementConstructor, ReactNode } from "react";
import {
  CogIcon,
  FilmIcon,
  HomeIcon,
  MusicNoteIcon,
  PuzzleIcon,
  UploadIcon,
  UserIcon,
  VideoCameraIcon,
} from "@heroicons/react/outline";
import FollowedUsers from "./FollowedUsers";
import { useRecoilValue } from "recoil";
import { currentUserState } from "../../recoil/states";
type Props = {};

type SidebarItem = {
  name: string;
  href: string;
  icon: JSXElementConstructor<"svg">;
};




const Sidebar = (props: Props) => {
  const router: NextRouter = useRouter();
  const currentUser = useRecoilValue(currentUserState);
  
  const sidebarItems = [
    {
      name: "Home",
      href: "/",
      icon: HomeIcon,
    },
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: CogIcon,
    },
    {
      name: "My Channel",
      href: `/u/7631`,
      icon: UserIcon,
    },
    {
      name: "Upload Video",
      href: `/upload`,
      icon: UploadIcon
    }
  ];
  
  return (
    <div className=" fixed bg-gray-900 py-3 h-full border-r w-60 border-gray-600">
      <div className="flex flex-col">
        {sidebarItems.map((item) =>
          item.href === router.pathname ? (
            <div key={item.href} className="flex cursor-pointer duration-200 tracking-wider font-medium font-display ease-out items-center px-4 py-2   w-full text-violet-100  gap-3">
              <item.icon className="h-7 w-7 stroke-current " />
              {item.name}
            </div>
          ) : (
            <Link legacyBehavior href={item.href} key={item.href}>
              <a className="flex duration-200 font-medium tracking-wider group font-display ease-out items-center px-4 py-2  w-full text-slate-500   hover:bg-gray-800 hover:text-violet-100  gap-3">
                <item.icon className="h-7 w-7 stroke-current group-hover:rotate-6 duration-200 ease-out" />
                {item.name}
              </a>
            </Link>
          )
        )}
        <FollowedUsers/>
      </div>
    </div>
  );
};

export default Sidebar;
