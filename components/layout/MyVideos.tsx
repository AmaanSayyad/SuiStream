import { useNFTCollection } from "@thirdweb-dev/react";
import moment from "moment";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { STREAM_NFT_ADDRESS } from "../../constants";
import Spinner from "../Spinner";
// import technology from "../../content/thumbnail/tecnhology.jpg";
// import techVideo from "../../content/videos/technology.mp4";

type Props = {
  address: string | string[];
};

const MyVideos = ({ address }: Props) => {
  console.log("harsh");
  const streamNft = useNFTCollection(STREAM_NFT_ADDRESS);
  const [videos, setVideos] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>();

  const getAllVideos = async () => {
    setLoading(true);
    //@ts-ignore
    const res = await streamNft.getOwned(address.toString());

    console.log("harsh");
    console.log("ankit", res);
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

    console.log("videos", videos);
    setLoading(false);
  };

  useEffect(() => {
    if (address) {
      getAllVideos();
    }
  }, [address]);

  if (loading) {
    const content = [
      {
        id: 1,
        title: "Intro to Sui Network and Move",
        thumbnail: "./thumbnail/technology.jpg",
        category: "Technology",
        createdAt: 1629780000,
        creator: "Sui Network",
      },
    ];
    return (
      <div>
        {content?.map((item) => (
          <Link href={`/video?id=${item?.id.toString()}`}>
            <div className="flex gap-3 my-4 hover:p-2 hover:bg-slate-700 duration-200 ease-out cursor-pointer rounded-xl">
              <img
                src={item.thumbnail}
                className="max-h-28 aspect-video rounded-xl bg-slate-600"
              />
              <div className="flex flex-col">
                <h6 className="font-medium text-lg mb-1">{item?.title}</h6>
                <p className="font-medium mb-1 italic  text-slate-300">
                  {item?.creator}{" "}
                </p>
                <p className="text-slate-400">
                  {moment.unix(item?.createdAt).fromNow()} | {item?.category}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      // <div className="flex justify-center items-center gap-2 mt-4">
      //   <Spinner />
      //   Loading Videos....
      // </div>
    );
  }
  return (
    <div>
      {videos?.map((item) => (
        <Link href={`/video?id=${item?.id.toString()}`}>
          <div className="flex gap-3 my-4 hover:p-2 hover:bg-slate-700 duration-200 ease-out cursor-pointer rounded-xl">
            <img
              src={item.thumbnail}
              className="max-h-28 aspect-video rounded-xl bg-slate-600"
            />
            <div className="flex flex-col">
              <h6 className="font-medium text-lg mb-1">{item?.title}</h6>
              <p className="font-medium mb-1 italic  text-slate-300">
                {item?.creator}{" "}
              </p>
              <p className="text-slate-400">
                {moment.unix(item?.createdAt).fromNow()} | {item?.category}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default MyVideos;
