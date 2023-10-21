import {
  ExternalLinkIcon,
  EyeIcon,
  GiftIcon,
  HeartIcon,
  ThumbUpIcon,
} from "@heroicons/react/outline";
import { useNFTCollection, useSigner } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import moment from "moment";
import { NextPage } from "next";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRecoilValue } from "recoil";
import SuggestedVideos from "../components/layout/SuggestedVideos";
import Avatar from "../components/profile/Avatar";
import ProfileInfo from "../components/profile/ProfileInfo";
import SendTip from "../components/profile/SendTip";
import Spinner from "../components/Spinner";
import Videojs from "../components/video-players/Videojs";
import CommentSection from "../components/video/CommentSection";
import { STREAM_NFT_ADDRESS } from "../constants";
import useSuperstreamContract from "../hooks/useSuperstreamContract";
import { Profile } from "../recoil/states";
import { BadgeCheckIcon } from "@heroicons/react/outline";

type Props = {};

const video: NextPage = () => {
  const router: NextRouter = useRouter();
  const signer = useSigner();
  const id = router.query.id;
  const [currentVideo, setCurrentVideo] = useState<any>({});
  const [videoExist, setVideoExist] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile>();
  const superstream = useSuperstreamContract();
  const [tipModal, setTipModal] = useState<boolean>(false);
  const videoNft = useNFTCollection(STREAM_NFT_ADDRESS);

  const fetchProfileData = async (): Promise<void> => {
    console.log(currentVideo);
    try {
      const _profile = await superstream.getProfileByUsername(
        currentVideo?.metadata?.creator
      );
      console.log(_profile);
      setProfile(_profile);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFollow = () => {
    toast("👩‍💻 Developer is currently working on this feature !!🛠");
  };
  const handleLike = () => {
    toast("👩‍💻 Developer is currently working on this feature !!🛠");
  };

  const fetchVideo = async () => {
    setLoading(true);
    try {
      //@ts-ignore
      const _video = await videoNft.get(Number(id));
      setCurrentVideo(_video);
      setVideoExist(true);
      setLoading(false);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Handle 401 Unauthorized error here
        console.log("Unauthorized access");
        // You can also redirect the user to a login page or show a message.
      } else {
        setVideoExist(false);
        // toast.error("An error occurred while fetching the video.");
        console.error(err);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentVideo?.metadata?.creator) {
      fetchProfileData();
    }
  }, [currentVideo]);

  useEffect(() => {
    if (signer) {
      fetchVideo();
    }
  }, [signer]);

  if (signer) {
    return (
      <div className="h-[85vh] w-full flex items-center justify-center">
        Please connect to your Sui wallet
      </div>
    );
  }
  if (loading) {
    return (
      <div className="h-[85vh] w-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // if (!loading && !videoExist) {
  //   return (
  //     <div className="h-[85vh] w-full flex items-center justify-center">
  //       Video Does not exist.
  //     </div>
  //   );
  // }

  if (!loading && !videoExist) {
    let currentVideo = {
      metadata: {
        image: "./thumbnail/technology.jpg",
        name: "Intro to Sui Network and Move",
        description: "Intro to Sui Network and Move",
        id: 1,
        creator: "Sui Network",
        owner: "Sui Network",
        created_at: 1697830690,
        animation_url: "./videos/technology.mp4",
        properties: {
          category: "Technology",
          tags: ["Blockchain"],
        },
      },
    };

    if (id === "2") {
      currentVideo = {
        metadata: {
          image: "./thumbnail/gaming.jpg",
          name: "Fortnite Live Stream",
          description: "Fortnite's Halloween Update is CRAZY!",
          id: 2,
          creator: "Ninja",
          owner: "Ninja",
          created_at: 1697637690,
          animation_url: "./videos/gaming.mp4",
          properties: {
            category: "Gaming",
            tags: ["Fortnite"],
          },
        },
      };
    }

    if (id === "3") {
      currentVideo = {
        metadata: {
          image: "./thumbnail/entertainment.jpg",
          name: "Fight for $250,000!",
          description: "Every Country on Earth Fights for $250,000!",
          id: 3,
          creator: "Mr. Beast",
          owner: "Mr. Beast",
          created_at: 1697830690,
          animation_url: "./videos/entertainment.mp4",
          properties: {
            category: "Entertainment",
            tags: ["Charity", "Games"],
          },
        },
      };
    }

    if (id === "4") {
      currentVideo = {
        metadata: {
          image: "./thumbnail/music.jpg",
          name: "Girls Like You",
          description:
            "Maroon 5 - Girls Like You ft. Cardi B (Volume 2) (Official Music Video)",
          id: 4,
          creator: "Maroon 5",
          owner: "Maroon 5",
          created_at: 1697830690,
          animation_url: "./videos/music.mp4",
          properties: {
            category: "Music",
            tags: ["Spotify"],
          },
        },
      };
    }

    if (id === "5") {
      currentVideo = {
        metadata: {
          image: "./thumbnail/technology2.jpg",
          name: "Builder House Seoul",
          description:
            "Sui Mainnet Update with Adeniyi Abiodun - Sui Builder House Seoul",
          id: 5,
          creator: "Sui Network",
          owner: "Sui Network",
          created_at: 1697830690,
          animation_url: "./videos/builderhouseseoul.mp4",
          properties: {
            category: "Technology",
            tags: ["Blockchain"],
          },
        },
      };
    }

    if (id === "6") {
      currentVideo = {
        metadata: {
          image: "./thumbnail/technology3.jpg",
          name: "Unfold 2023",
          description: "Stream - Unfold 2023",
          id: 6,
          creator: "Sui Network",
          owner: "Sui Network",
          created_at: 1697830690,
          animation_url: "./videos/unfold2023.mp4",
          properties: {
            category: "Entertainment",
            tags: ["Blockchain"],
          },
        },
      };
    }

    if (id === "7") {
      currentVideo = {
        metadata: {
          image: "./thumbnail/gaming2.jpg",
          name: "Fortnite Montage",
          description: "A Fortnite Montage But All The Songs are 8D Audio...",
          id: 7,
          creator: "Macbeth",
          owner: "Macbeth",
          created_at: 1697830690,
          animation_url: "./videos/fortnitestream.mp4",
          properties: {
            category: "Gaming",
            tags: ["Fortnite"],
          },
        },
      };
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3  gap-4">
        <SendTip
          isOpen={tipModal}
          setIsOpen={setTipModal}
          //@ts-ignore
          toUser={profile?.username}
          //@ts-ignore
          toAddress={profile?.owner}
        />
        <div className="lg:col-span-2">
          {/* Main */}
          <div className="relative z-10 mb-4 h-[480px] flex justify-center bg-black">
            <video
              src={currentVideo?.metadata?.animation_url}
              poster={currentVideo?.metadata?.image}
              controls
              // poster={currentVideo?.metadata?.image}
            />
          </div>
          <div className="flex justify-between">
            <div className="flex flex-col">
              <h1 className="text-2xl font-medium leading-relaxed">
                {currentVideo?.metadata?.name}
              </h1>
              <div className="flex text-sm font-display items-center gap-2">
                <div className="rounded-lg p-1 px-2 max-w-fit bg-slate-800 text-gray-200">
                  {currentVideo?.metadata?.properties.category}
                </div>
                {currentVideo?.metadata?.properties.tags.map((tag) => (
                  <div className="rounded-lg p-1 px-2 max-w-fit bg-slate-800 text-gray-200">
                    {tag}
                  </div>
                ))}
              </div>
              <h6 className="text-gray-200 font-medium mt-4">Description</h6>
              <p className="text-gray-400 mb-4">
                {currentVideo?.metadata?.description}
                <br></br>
                <span className="fony-medium italic">
                  {" "}
                  Uploaded on :{" "}
                  {moment
                    .unix(currentVideo?.metadata?.created_at)
                    .format("LLL")}
                </span>
              </p>
              <div className="max-w-min">
                <a
                  target="_blank"
                  rel="noreferrer"
                  className="flex whitespace-nowrap text-sm items-center gap-1 font-medium bg-sky-500 hover:bg-sky-600 px-3 py-1 rounded-lg font-display"
                  // href={`https://testnets.opensea.io/assets/mumbai/${STREAM_NFT_ADDRESS}/${currentVideo?.metadata?.id.toString()}`}
                >
                  View on BlueMove <ExternalLinkIcon className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div className="flex gap-2 h-1/2">
              <button className="text-lg bg-violet-600 hover:bg-violet-500 group  disabled:text-gray-400  disabled:bg-gray-800  gap-2">
                <HeartIcon className="group-hover:scale-110 group-hover:rotate-12 duration-300 ease-out h-6 w-6" />
                Following
              </button>

              <button className="text-lg flex bg-amber-500 hover:bg-yellow-500 group  disabled:text-gray-400  disabled:bg-gray-800  gap-2">
                <BadgeCheckIcon className="group-hover:scale-110 group-hover:rotate-12 duration-300 ease-out h-6 w-6" />
                Unsubscribe
              </button>

              <button className="text-lg bg-emerald-500 hover:bg-emerald-400 group   gap-2">
                <GiftIcon className="group-hover:scale-110 group-hover:rotate-12 duration-300 ease-out h-6 w-6" />
                Send Tip
              </button>
            </div>
          </div>

          <hr className="border-gray-600 my-4" />

          {profile && <ProfileInfo profileData={profile} />}
          <hr className="border-gray-600 my-4" />
          <CommentSection topic={currentVideo?.metadata?.id.toString()} />
        </div>
        <div className="col-span-1">
          <h6 className="text-lg pb-1 text-gray-300 border-b border-1 border-gray-600 uppercase font-display tracking-wider fond-bold">
            SUGGESTED VIDEOS
          </h6>

          <div className="flex flex-col gap-2 p-2">
            {/* //@ts-ignore */}
            {/* <SuggestedVideos id={id} /> */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3  gap-4">
      <SendTip
        isOpen={tipModal}
        setIsOpen={setTipModal}
        //@ts-ignore
        toUser={profile?.username}
        //@ts-ignore
        toAddress={profile?.owner}
      />
      <div className="lg:col-span-2">
        {/* Main */}
        <div className="relative z-10 mb-4 h-[480px] flex justify-center bg-black">
          <video
            src={currentVideo?.metadata?.animation_url}
            poster={currentVideo?.metadata?.image}
            controls
            // poster={currentVideo?.metadata?.image}
          />
        </div>
        <h1 className="text-2xl font-medium leading-relaxed">
          {currentVideo?.metadata?.name}
        </h1>
        <div className="flex text-sm font-display items-center gap-2">
          <div className="rounded-lg p-1 px-2 max-w-fit bg-slate-800 text-gray-200">
            {currentVideo?.metadata?.properties.category}
          </div>
          {currentVideo?.metadata?.properties.tags.map((tag) => (
            <div className="rounded-lg p-1 px-2 max-w-fit bg-slate-800 text-gray-200">
              {tag}
            </div>
          ))}
        </div>
        <h6 className="text-gray-200 font-medium mt-4">Description</h6>
        <p className="text-gray-400 mb-4">
          {currentVideo?.metadata?.description}
          <br></br>
          <span className="fony-medium italic">
            {" "}
            Uploaded on :{" "}
            {moment.unix(currentVideo?.metadata?.created_at).format("LLL")}
          </span>
        </p>
        <div className="max-w-min">
          <a
            target="_blank"
            rel="noreferrer"
            className="flex whitespace-nowrap text-sm items-center gap-1 font-medium bg-sky-500 hover:bg-sky-600 px-3 py-1 rounded-lg font-display"
            href={`https://testnets.opensea.io/assets/mumbai/${STREAM_NFT_ADDRESS}/${currentVideo?.metadata?.id.toString()}`}
          >
            View on BlueMove <ExternalLinkIcon className="h-5 w-5" />
          </a>
        </div>

        <hr className="border-gray-600 my-4" />

        {profile && <ProfileInfo profileData={profile} />}
        <hr className="border-gray-600 my-4" />
        <CommentSection topic={currentVideo?.metadata?.id.toString()} />
      </div>
      <div className="col-span-1">
        <h6 className="text-lg pb-1 text-gray-300 border-b border-1 border-gray-600 uppercase font-display tracking-wider fond-bold">
          SUGGESTED VIDEOS
        </h6>

        <div className="flex flex-col gap-2 p-2">
          {/* <SuggestedVideos id={id} /> */}
        </div>
      </div>
    </div>
  );
};

export default video;
