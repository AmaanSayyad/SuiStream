import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import useSuperstreamContract from "../../hooks/useSuperstreamContract";
import { currentUserState } from "../../recoil/states";

type Props = {};

const FollowedUsers = (props: Props) => {
  const currentUser = useRecoilValue(currentUserState);
  const [followedUsers,setFollowedUsers] = useState<any[]>([]);
  const superstream = useSuperstreamContract();

  const getFollowedUsers = async () => {
    const followedUsernames = currentUser?.profile?.follows;
    followedUsernames.forEach(async (item)=>{
      const _data = await superstream.getProfileByUsername(item);
      setFollowedUsers([...followedUsers,_data])
  
    })
    console.log({followedUsers});
  }

  useEffect(() => {
    if(currentUser?.profile?.followers){
      getFollowedUsers();
    }
    return () => {
      setFollowedUsers([]);
    }
  }, [currentUser])
  
  if(!currentUser.hasProfile){
    return <div></div>;
  }

  return (<div className=" mt-3">
    <h6 className="font-bold pl-3 mb-2 uppercase  text-slate-500 font-display">FOLLOWED CHANNELS</h6>
    <div className="">
      {followedUsers?.map((item)=>(
      <Link href={`/u/${item?.username}`} key={item?.id}>
      <a className="flex font-bold font-display text-gray-400 hover:text-gray-100 pl-3 py-2 hover:bg-slate-800 items-center gap-3">
        <img className="h-8 rounded-md" src={`https://ipfs.io/ipfs/${item?.pfp}`} alt="" />
        {item.username}
      </a>
      </Link>
      ))}
    </div>
  </div>);
};

export default FollowedUsers;
