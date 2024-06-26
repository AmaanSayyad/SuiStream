import { ChipIcon, FilmIcon, MusicNoteIcon } from "@heroicons/react/outline";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import VideoCard from "../components/VideoCard";
import { useNFTCollection } from "@thirdweb-dev/react";
import { STREAM_NFT_ADDRESS } from "../constants";
// import { zkLogin } from "./callback";
import video from "./video";
import Loading from "../components/Loading";
import Spinner from "../components/Spinner";

import { Github } from "../components/icons";
import { authOptions } from "../lib/auth";
import prisma from "../lib/prisma";
import { deriveUserSalt } from "../lib/salt";
import { nFormatter } from "../lib/utils";
import { jwtToAddress } from "@mysten/zklogin";
import { getServerSession } from "next-auth/next";
import Header from "./Header";

const GameIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 512 512">
    <title>Game Controller</title>
    <path
      d="M467.51 248.83c-18.4-83.18-45.69-136.24-89.43-149.17A91.5 91.5 0 00352 96c-26.89 0-48.11 16-96 16s-69.15-16-96-16a99.09 99.09 0 00-27.2 3.66C89 112.59 61.94 165.7 43.33 248.83c-19 84.91-15.56 152 21.58 164.88 26 9 49.25-9.61 71.27-37 25-31.2 55.79-40.8 119.82-40.8s93.62 9.6 118.66 40.8c22 27.41 46.11 45.79 71.42 37.16 41.02-14.01 40.44-79.13 21.43-165.04z"
      fill="none"
      stroke="currentColor"
      strokeMiterlimit={10}
      strokeWidth={32}
    />
    <circle fill="currentColor" cx={292} cy={224} r={20} />
    <path
      fill="currentColor"
      d="M336 288a20 20 0 1120-19.95A20 20 0 01336 288z"
    />
    <circle fill="currentColor" cx={336} cy={180} r={20} />
    <circle fill="currentColor" cx={380} cy={224} r={20} />
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={32}
      d="M160 176v96M208 224h-96"
    />
  </svg>
);
const Home = () => {
  const streamNft = useNFTCollection(STREAM_NFT_ADDRESS);
  const [videos, setVideos] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>();
  const [session, setSession] = useState(null);

  const [address, setAddress] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/user");

        const data = await response.json();

        console.log("Data : ", data);

        setSession(data.session);
        setAddress(data.address);

        // Fetch videos
        await getAllVideos();
      } catch (error) {
        console.error(error);
        // Handle errors...
      }
    };

    fetchData();
  }, []);

  const getAllVideos = async () => {
    setLoading(true);
    try {
      //@ts-ignore
      const res = await streamNft.getAll();
      console.log("harsh", res);
      res.forEach((item) => {
        setVideos((videos) => [
          ...videos,
          {
            title: item?.metadata?.name,
            description: item?.metadata?.description,
            id: item?.metadata?.id,
            creator: item?.metadata?.creator,
            owner: item?.owner,
            createdAt: item?.metadata?.created_at,
            animationUrl: item?.metadata?.animation_url,
            thumbnail: item?.metadata?.image,
            duration: item?.metadata?.duration,
            category: item?.metadata?.properties?.category,
            tags: item?.metadata?.properties?.tags,
          },
        ]);
      });
      setLoading(false);
    } catch (e) {
      console.log("Harsh", e);
    }
  };

  useEffect(() => {
    getAllVideos();
  }, []);

  // useEffect(() => {
  //   const asyncFunc = async () => {
  //     // Call zkLogin here or perform other asynchronous tasks if needed
  //     await zkLogin();
  //   };
  //   asyncFunc();
  // }, []);

  const content = [
    {
      id: 1,
      title: "Intro to Sui Network and Move",
      thumbnail: "./thumbnail/technology.jpg",
      category: "Technology",
      createdAt: 1697830690,
      creator: "Sui Network",
      pfp: "./pfp/1.jpg",
    },
    {
      id: 2,
      title: "Fortnite Live Stream",
      thumbnail: "./thumbnail/gaming.jpg",
      category: "Gaming",
      createdAt: 1697637690,
      creator: "Ninja",
      pfp: "./pfp/4.jpg",
    },
    {
      id: 3,
      title: "Fight for $250,000!",
      thumbnail: "./thumbnail/entertainment.jpg",
      category: "Entertainment",
      createdAt: 1697830690,
      creator: "Mr. Beast",
      pfp: "./pfp/2.jpg",
    },
    {
      id: 4,
      title: "Girls like you - Maroon 5",
      thumbnail: "./thumbnail/music.jpg",
      category: "Music",
      createdAt: 1697837690,
      creator: "Maroon 5",
      pfp: "./pfp/3.jpg",
    },
    {
      id: 5,
      title: "Builder House Seoul",
      thumbnail: "./thumbnail/technology2.jpg",
      category: "Technology",
      createdAt: 1697837600,
      creator: "Builder House",
      pfp: "./pfp/1.jpg",
    },
    {
      id: 6,
      title: "Unfold 2023",
      thumbnail: "./thumbnail/technology3.jpg",
      category: "Technology",
      createdAt: 1697833600,
      creator: "Coin DCX",
      pfp: "./pfp/1.jpg",
    },
    {
      id: 7,
      title: "Fortnite Late Night Stream",
      thumbnail: "./thumbnail/gaming2.jpg",
      category: "Technology",
      createdAt: 1697837600,
      creator: "Macbeth",
      pfp: "./pfp/5.jpg",
    },
  ];
  return (
    <div className="">
      <div className="z-20 w-full max-w-2xl px-5 xl:px-0">
        {session != null && (
          <>
            <h1 className="text-white text-center">
              {
                //@ts-ignore
                `Welcome back, ${session?.user?.name}`
              }
            </h1>
            <div className="border-[1px] border-slate-300 rounded-lg px-3 py-4 flex flex-col gap-2 w-full">
              <p
                className=" text-center text-white"
                style={{
                  animationDelay: "0.25s",
                  animationFillMode: "forwards",
                }}
              >
                Your Sui address is:
              </p>
              <p
                className="text-white text-center"
                style={{
                  animationDelay: "0.25s",
                  animationFillMode: "forwards",
                }}
              >
                {address}
              </p>
            </div>
          </>
        )}
        {session === null && <div className="h-16"></div>}
      </div>
      <div className=" flex  p-8  ease-out duration-500 items-center w-full bg-gradient-to-br rounded-2xl from-violet-800 via-purple-600  to-fuchsia-400">
        <div className="md:w-1/2 flex flex-col">
          <h1 className="text-4xl  font-display mb-2 font-bold">
            Welcome to SuiStream
          </h1>
          <p className="text-violet-200 text-xl">
            A decentralized live streaming platform
          </p>
        </div>
        <div className="w-1/2 h-full border-l-2 -skew-x-12 px-12 font-display   border-white">
          <div className="md:flex hidden flex-col gap-2  justify-center">
            <p> 🔴 Live Stream & Upload Clips</p>
            <p> 📢 Publish / Mint Stream NFT </p>
            <p> ✨ Follow your favorite streamers </p>
            <p> 💰 Receive Tips </p>
            <p> 🎫 Subscriptions </p>
            <p> 📨 Super Chat ( Coming soon !) </p>
          </div>
        </div>
      </div>
      <div className="my-4 flex  gap-4">
        <Link href="">
          <div className="bg-purple-600 hover:bg-purple-500 duration-200 flex group cursor-pointer items-center gap-3 px-6 py-2 rounded-lg  max-w-fit font-display text-2xl font-medium">
            Gaming{" "}
            <GameIcon className="h-8 w-8 rotate-12 group-hover:scale-110 duration-200" />
          </div>
        </Link>
        <Link href="">
          <div className="bg-green-500 hover:bg-lime-500   duration-200 flex group cursor-pointer items-center gap-3 px-6 py-2 rounded-lg  max-w-fit font-display text-2xl font-medium">
            Entertainment{" "}
            <FilmIcon className="h-8 w-8 rotate-12 group-hover:scale-110 duration-200" />
          </div>
        </Link>
        <Link href="">
          <div className="bg-pink-600 hover:bg-pink-500  duration-200 flex group cursor-pointer items-center gap-3 px-6 py-2 rounded-lg  max-w-fit font-display text-2xl font-medium">
            Music{" "}
            <MusicNoteIcon className="h-8 w-8 rotate-12 group-hover:scale-110 duration-200" />
          </div>
        </Link>
        <Link href="">
          <div className="bg-cyan-600 hover:bg-cyan-500 duration-200 flex group cursor-pointer items-center gap-3 px-6 py-2 rounded-lg  max-w-fit font-display text-2xl font-medium">
            Technology{" "}
            <ChipIcon className="h-8 w-8 rotate-12 group-hover:scale-110 duration-200" />
          </div>
        </Link>
      </div>
      <h1 className="text-2xl mb font-medium text-grap-200 mb-4">
        Trending Videos{" "}
      </h1>
      <div className="gap-4 grid sm:grid-cols-2 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 ">
        {!loading &&
          //@ts-ignore
          videos?.map((item) => <VideoCard key={item.id} data={item} />)}
        {loading &&
          //@ts-ignore
          content?.map((item) => <VideoCard key={item.id} data={item} />)}
      </div>
    </div>
  );
};

export default Home;
