import { useAddress, useNFTCollection } from "@thirdweb-dev/react";
import { NFTMetadataOwner } from "@thirdweb-dev/sdk";
import moment from "moment";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { STREAM_NFT_ADDRESS } from "../../constants";
import useLivpeerApi from "../../hooks/useLivepeerApi";
import useSuperstreamContract from "../../hooks/useSuperstreamContract";

type Props = {
  streamId: string;
};

type Session = {
  id: string;
  duration: number;
  createdAt: number;
  recordingStatus:string;
  status: "Unpublished" | "Published";
};

type PublishedSession = {
  title: string;
  likes: number;
  views: number;
  sessionId: string;
  nftId: number;
  duration: number;
  createdAt: number;
};

const SessionDetails = ({ streamId }: Props) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const livepeer = useLivpeerApi();
  const superstream = useSuperstreamContract();
  const [sessionsLoading, setSessionsLoading] = useState<boolean>(true);

  const getSessions = async () => {
    setSessionsLoading(true);

    let _sessions = await livepeer.getSessionsList(streamId);
    _sessions.map(async (item) => {
      const isPublished = await checkIfAlreadyPublished(item.id);
  
      setSessions((sessions) => [
        ...sessions,
        {
          createdAt: item.createdAt,
          duration: item.sourceSegmentsDuration,
          id: item.id,
          status: isPublished ? "Published" : "Unpublished",
          recordingStatus: item.recordingStatus
        },
      ]);
    });
    setSessionsLoading(false);
  };

  const checkIfAlreadyPublished = async (sessionId) => {
    const isMinted = await superstream.checkIfPublished(sessionId);
    return isMinted;
  };

  useEffect(() => {
    if (streamId) {
      getSessions();
  
    }
  }, [streamId]);

  return (
    <div className="col-span-2 lg:ml-4">
      <div>
        <h1 className="text-xl font-display ">Recent Sessions</h1>
        <p className="mb-4 italic text-gray-500">
          Note: Streams may take 6+ minutes to get saved and appear here .
        </p>
        {!sessionsLoading ? (
          <table className="w-full text-left rounded-md overflow-hidden ring-1 ring-gray-600 ">
            <tbody className="divide-y divide-gray-600">
              <tr className="text-gray-300  font-display font-normal bg-slate-800 ">
                <th className="p-2 px-4">Streamed At</th>
                <th className="p-2 px-4 text-center">Duration</th>
                <th className="p-2 px-4 text-center">Status</th>
                <th className="p-2 px-4 text-center">Recording Status</th>
                <th className="p-2 px-4 text-right"></th>
              </tr>
              {sessions &&
                sessions?.map((session) => (
                  <tr className="hover" key={session.id}>
                    <td className="p-2 px-4">
                      {moment(new Date(session?.createdAt)).format(
                        "MMMM Do , yyyy h:mm a"
                      )}
                    </td>
                    <td className="p-2 px-4 text-center">
                      {moment
                        .duration(Math.ceil(session?.duration / 60) * 60 * 1000)
                        .humanize()}
                    </td>
                    <td className="p-2 px-4 text-center">{session.status}</td>
                    <td className="p-2 px-4 text-center">{session.recordingStatus}</td>
                    <td className="p-2 px-4 text-right">
                      {session.status == "Unpublished" && (
                        <Link legacyBehavior href={`/publish?id=${session.id}`}>
                          <a className="bg-emerald-600 rounded-md whitespace-nowrap py-1 px-2 font-display text-sm font-medium hover:bg-emerald-500 ">
                            Mint & Publish Stream
                          </a>
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
               
            </tbody>
          </table>
        ) : (
          <div className="w-full animate-pulse flex justify-center">
            {/* <BeatLoader color="#fff" /> */}
            Loading...
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionDetails;
