import { useSigner } from "@thirdweb-dev/react";
import moment from "moment";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRecoilValue } from "recoil";
import useSuperstreamContract from "../../../hooks/useSuperstreamContract";
import { currentUserState } from "../../../recoil/states";
import Copyable from "../../Copyable";


const StreamDetails = ({stream}:any) => {
  const currentUser = useRecoilValue(currentUserState);
  const {getStreamKey , toggleSubOnlyForLivestream} = useSuperstreamContract();
  const [streamKey,setStreamKey] = useState<string>("Unavailable");

  const signer = useSigner();

  const fetchStreamKey = async () => {
    const key = await getStreamKey();
    setStreamKey(key);
  }

  useEffect(() => {
  if(signer){
    fetchStreamKey();
  }    

  }, [signer])
  

  const handleToggleSubscribersMode = async () => {
    if(currentUser?.profile?.isOnlySubscribers){
      toast("Turning off Subscribers only mode ");
    } else {
      toast("Turning on subscribers only mode");
    }
    await toggleSubOnlyForLivestream();
    window.location.reload();  
  }

  return (
    <div className="">

      <div className="bg-slate-800 rounded-xl p-4">
        <h6 className="text-xl font-display font-medium  pb-1 ">
          Stream Details
        </h6>
        <table className="text-left">
          <tbody className="divide-y divide-gray-600">
            <tr>
              <th className=" h-12 font-normal  text-gray-400">Server</th>
              <td className="pl-8">
                <Copyable text="rtmp://rtmp.livepeer.com/live" />{" "}
              </td>
            </tr>
            <tr>
              <th className=" h-12  font-normal text-gray-400">
                Stream Key
              </th>
              <td className="pl-8">
                <Copyable text={streamKey} />{" "}
              </td>
            </tr>
            <tr>
              <th className=" h-12 font-normal  text-gray-400">
                Stream Url
              </th>
              <td className="pl-8">
                
                <Copyable
                  text={
                    currentUser?.hasProfile
                      ? `${window.location.origin}/u/${currentUser?.profile?.username}`
                      : "Unavailable"
                  }
                />
              </td>
            </tr>
            <tr>
              <th className=" h-12 font-normal  text-gray-400">
                Last seen
              </th>
              <td className="pl-8">
                {stream?.lastSeen
                  ? moment(stream.lastSeen).format("MMMM Do yyyy , h:mm a")
                  : "Never"}
              </td>
            </tr>
            <tr>
              <th className=" h-12 font-normal  text-gray-400">Status</th>
              <td className="pl-8">
                {stream?.status ? (
                  <div className="px-2 max-w-fit rounded-md bg-emerald-500">
                    Live
                  </div>
                ) : (
                  "Idle"
                )}{" "}
              </td>
            </tr>
              <tr>
              <th className=" h-12 font-normal  text-gray-400">
                Only Subscribers mode
              </th>
              <td className="pl-8 my-auto font-semibold  ">
                <div className="flex items-center gap-4">
                {currentUser?.profile?.isOnlySubscribers ? "ON" : "OFF"}
                <button onClick={handleToggleSubscribersMode} className="bg-slate-700 hover:bg-slate-600 text-sm"> Turn {currentUser?.profile?.isOnlySubscribers ? "OFF" : "ON"}</button> 
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StreamDetails;
