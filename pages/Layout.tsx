import { useAddress, useNFTCollection, useSigner } from "@thirdweb-dev/react";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { STREAM_NFT_ADDRESS } from "../constants";
import useSuperstreamContract from "../hooks/useSuperstreamContract";
import { currentUserState } from "../recoil/states";
import Header from "./Header";
import Sidebar from "../components/layout/Sidebar";
import { Props } from "next/script";

const Layout = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);

  const superstream = useSuperstreamContract();
  const signer = useSigner();

  let data1:any;

  const [session, setSession] = useState(null);
  const [address, setAddress] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('../../pages/api/user');
        
        const data = await response.json();
        data1 = data;

        console.log("Data : ",data)

        setSession(data.session);
        setAddress(data.address);

    
      } catch (error) {
        console.error(error);
        // Handle errors...
      }
    };

    fetchData();
  }, [data1]);

  const checkIfUserHasProfile = async () => {
    setCurrentUser({ ...currentUser, loading: true });
    console.log("Checking...");
    const _profile: any = await superstream.getProfileByAddress();
    if (_profile?.username) {
      setCurrentUser({
        ...currentUser,
        hasProfile: true,
        loading: false,
        profile: _profile,
      });
    } else {
      setCurrentUser({ ...currentUser, hasProfile: false, loading: false });
    }
  };

  useEffect(() => {
    if (signer) {
      checkIfUserHasProfile();
    }
  }, [signer]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* <Header session={session} /> */}
      <Header />
      <div className="w-full flex flex-1">
        <Sidebar />
        <div className="p-4 pl-64 flex-1 max-w-screen-2xl h-full mx-auto">{children}</div>
      </div>
    </div>
  );
};

export default Layout;