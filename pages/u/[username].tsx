
import { NextRouter, useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ProfileInfo from "../../components/profile/ProfileInfo";
import LiveChat from "../../components/LiveChat/LiveChat";
import useSuperstreamContract from "../../hooks/useSuperstreamContract";
import useLivpeerApi from "../../hooks/useLivepeerApi";
import Videojs from "../../components/video-players/Videojs";
import Spinner from "../../components/Spinner";
import { Tab } from "@headlessui/react";
import { Profile } from "../../recoil/states";
import Copyable from "../../components/Copyable";
import { parseAddress } from "../../components/layout/UserMenu";
import MyVideos from "../../components/layout/MyVideos";

type Props = {};

const ProfilePage = (props: Props) => {
  const router: NextRouter = useRouter();
  const { username } = router.query;
  const superstream = useSuperstreamContract();
  const livepeer = useLivpeerApi();
  // const [profile, setProfile] = useState<Profile>();
  const [loading, setLoading] = useState<boolean>(true);
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  const [stream, setStream] = useState<any>();
  interface Profile {
    streamId: string;
    defaultThumbnail: string; 
    defaultTitle: string;     
    owner: string;         
    username: string;    
    followers:string[];   
    subscribersCount:number;
    pfp:"https://plus.unsplash.com/premium_photo-1676637000058-96549206fe71?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    subscriptionCharge:BigInt;
    bio:string;
    id:number;
    follows:string[];
    isOnlySubscribers:boolean;
  }
  const profile: Profile = {
    streamId: "0",
    defaultThumbnail: "https://plus.unsplash.com/premium_photo-1676637000058-96549206fe71?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    defaultTitle: "Pro Coder",      
    owner: "0xb1f78bda569a408b6a7da7cc264d660cb106f4bd9f4a3390d6e3ebdee555b283",                  
    username: "Ankit"  ,
    followers: ["ankit","harsh","amaan"],
    subscribersCount: 42,
    pfp:"https://plus.unsplash.com/premium_photo-1676637000058-96549206fe71?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    subscriptionCharge:BigInt(9007199254740991),
    bio:"Loves to code",
    id:1,
    follows:["ankit","harsh","amaan"],
    isOnlySubscribers:true,
  };
  

 const checkIfUserHasProfile = async (): Promise<void> => {
    setLoading(true);
    try {
      // const _profile: any = await superstream.getProfileByUsername(username);

      
     
      setHasProfile(true);
    } catch (err) {
      console.error(err);
      setHasProfile(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (username) {
      checkIfUserHasProfile();
    }
  }, [username]);

  const getStreamStatus = async () => {
    setLoading(true);
    const _stream = await livepeer.fetchStreamStatus(profile.streamId);
    setStream(_stream);
    console.log(stream);
    setLoading(false);
  };

  useEffect(() => {
    if (profile?.streamId) {
      getStreamStatus();
    }
  }, [profile]);
  const styles = {
    tabPanel:`p-4 bg-slate-800 rounded-xl shadow`,
    tablist: `flex mt-4 mb-2 shadow text-sm font-medium  select-none text-gray-400 p-1 gap-1 items-center  bg-slate-800  rounded-lg  overflow-hidden max-w-fit `,
    selectedTab: ` bg-sky-500 shadow-xl text-white px-3 py-1 rounded-md whitespace-nowrap`,
    tab: `cursor-pointer px-2 py-1 hover:bg-gray-700 rounded-md duration-200 ease-out whitespace-nowrap`,
  };
  if (profile) {
    return (
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
        <div className=" lg:col-span-2 flex flex-col  w-full ">
          <div className="relative select-none overflow-hidden mb-2 flex rounded-md items-center justify-center bg-gradient-to-br w-full from-sky-300 via-violet-500 to-fuchsia-500">
            <div className=" z-10  flex h-[465px] items-center justify-center ">
              {stream?.isActive ? (
                <div className="relative py-2 h-[465px] aspect-video ">
                  <Videojs
                    poster={profile?.defaultThumbnail}
                    src={`https://cdn.livepeer.com/hls/${stream?.playbackId}/index.m3u8`}
                  />
                </div>
              ) : (
                <div className="font-bold font-display uppercase text-4xl">
                  User is Offline !!
                </div>
              )}
            </div>
          </div>
          <h1 className="text-2xl mb-4 fony">{profile?.defaultTitle}</h1>
          <ProfileInfo profileData={profile} />
          <Tab.Group>
            <Tab.List className={styles.tablist}>
              <Tab
              as='div'
              className={({ selected }) =>
              selected ? styles.selectedTab : styles.tab 
                }
              >
                About
              </Tab>
              <Tab
                as='div'
                className={({ selected }) =>
                  selected ? styles.selectedTab : styles.tab 
                }>Videos</Tab>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel className={styles.tabPanel}>
                <p className="font-medium  text-gray-400">
                   Address </p>
                  <Copyable text={parseAddress(profile?.owner)} copyText={profile?.owner}/>
                  <p className="font-medium  text-gray-400">
                   Bio </p>
                {profile?.bio}
              </Tab.Panel>
              <Tab.Panel>
            <MyVideos address={profile?.owner}/> 
                </Tab.Panel>p
  
            </Tab.Panels>
          </Tab.Group>
        </div>
        <div className="">
          {!stream?.isActive && <LiveChat topic={profile?.username} />}
        </div>
      </div>
    );
  } else if (loading) {
    return (
      <div className="h-[85vh] flex flex-col gap-2 items-center justify-center">
        <Spinner className="w-12 fill-slate-400 mr-1 animate-spin text-slate-700" />
        Fetching profile...
      </div>
    );
  } else {
    return (
      <div className="h-[85vh] flex items-center justify-center">
        Profile Not Found!!
      </div>
    );
  }
};

export default ProfilePage;
