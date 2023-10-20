import { useAddress, useNFTCollection } from "@thirdweb-dev/react";
import { useRouter, NextRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Select from "../components/Select";
import useLivpeerApi from "../hooks/useLivepeerApi";
import useWeb3Storage from "../hooks/useWeb3Storage";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { currentUserState } from "../recoil/states";
import { ethers } from "ethers";
import useSuperstreamContract from "../hooks/useSuperstreamContract";
import TagInputField from "../components/TagInputField";
import Toggle from "../components/Toggle";
import { PhotographIcon, VideoCameraIcon } from "@heroicons/react/outline";
import Spinner from "../components/Spinner";
type Props = {
  web3storageToken: string;
};

type Category = {
  id: number;
  name: string;
};
const categories: Category[] = [
  { id: 1, name: "Entertainment" },
  { id: 2, name: "Gaming" },
  { id: 3, name: "Music" },
  { id: 8, name: "Technology" },
  { id: 8, name: "" },
];

export const getStaticProps = async () => {
  const web3storageToken = process.env.ACCESS_TOKEN;
  return {
    props: { web3storageToken },
  };
};

const upload= (props: Props) => {
  const currentAccount = useAddress();
  const [minting, setMinting] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('')
  const [category, setCategory] = useState<Category>(categories[0]);
  const [thumbnail, setThumbnail] = useState<string>('');
  const [video, setVideo] = useState<string>('');
  const thumbnailRef = useRef<HTMLInputElement>();
  const videoRef = useRef<HTMLInputElement>();
  const [error, setError] = useState<string[]>([]);
  const [buttonState,setButtonState] = useState<string>("Publish Video")
  const currentUser = useRecoilValue(currentUserState);
  const [tags, setTags] = useState<string[]>([]);
  const { storeFile } = useWeb3Storage();
  const [isSubscribersOnly, setIsSubscribersOnly] = useState(false);
  const superstream = useSuperstreamContract();
  const router = useRouter();

  const handleSubmit = async () => {
    setMinting(true);
   
    if (!title && !description) {
      setError([...error, "Please fill all fields."]);
      toast.error("Please fill all the fields.")
    }
    if (!thumbnail) {
      setError([...error, "Please select a thumbnail for your video."]);
      toast.error("Please select a thumbnail for your video.")
    }
    if (!video) {
      setError([...error, "Please select a video."]);
      toast.error("Please select a video.")
    }
    if (!currentAccount) {
      setError([...error, "Please connect your wallet first"]);
      toast.error("Please connect your wallet first .")
    }
    if (title && description && currentAccount && thumbnail) {
      toast("Minting stream Nft");
      const tokenId = await mintStream(title, description);
      // await superstream.addStream(tokenId,'',isSubscribersOnly).then(()=>{
      // });
      router.push('/');
      toast.success("Stream NFT Minted successfully");

    }
    setMinting(false);
  };

  const mintStream = async (
    name: string,
    description: string
  ) => {
    try {
        setButtonState("Uploading Video...")
        toast("Uploading video to ipfs");
        const videoCid = await storeFile(videoRef.current.files[0],props.web3storageToken);
        setButtonState("Uploading Thumbnail...")
        toast("Uploading thumbnail to ipfs");
        const thumbnail = await storeFile(
          thumbnailRef.current.files[0],
          props.web3storageToken
        );
        const metadata = {
          name,
          description,
          image: "ipfs://" + thumbnail,
          animation_url:"ipfs://" + videoCid ,
          created_at: Math.floor(new Date().getTime() / 1000).toString(),
          creator: currentUser.profile.username,
          properties: {
            category: category.name,
            tags: tags,
          },
        };
        console.log(metadata);
        setButtonState("Minting Video NFT...")
        const response = await axios.post("/api/mint/stream", {
          address: currentAccount,
          metadata: metadata,
        });
        console.log(response.data);
        setButtonState("Publishing Video");
        // return ethers.BigNumber.from(response.data.tokenId).toNumber();
      
    } catch (err) {
      console.error(err);
    }
  };

  const handleVideoChange = () => {
    const file = videoRef.current.files[0];
    console.log(file);

    if(file.type != 'video/mp4'){
      toast.error("Please upload a mp4 video");
      return;
    }

    const reader: FileReader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
    }

    reader.onload = (readerEvent) => {
      setVideo(readerEvent.target.result.toString());
    };
  };

  const handleThumbnailChange = () => {
    const file = thumbnailRef.current.files[0];
    // Limit to either image/jpeg, image/jpg or image/png file
    const fileTypes = ["image/jpeg", "image/jpg", "image/png"];
    const { size, type } = file;
    // Limit to either image/jpeg, image/jpg or image/png file
    if (!fileTypes.includes(type)) {
      toast.error("File format must be either png or jpg");
      return false;
    }
    // Check file size to ensure it is less than 2MB.
    if (size / 1024 / 1024 > 2) {
      toast.error("File size exceeded the limit of 2MB");
      return false;
    }

    const reader: FileReader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
    }

    reader.onload = (readerEvent) => {
      setThumbnail(readerEvent.target.result.toString());
    };
  };

  const styles = {
    inputContainer: `flex flex-col `,
  };

  return (
    <div className="mx-auto w-full max-w-screen-lg ">
      <h1 className="text-2xl font-display border-b border-gray-600 pb-2 mb-4">
        Upload new video
      </h1>
      <div
        className=" flex flex-col-reverse lg:flex-row gap-8  "
      >
        <div className="w-1/2 flex flex-col gap-4">
          <div className={styles.inputContainer}>
            <label htmlFor="title">Enter title</label>
            <input
              name="title"
              required
              type="text"
              placeholder="Enter Title "
              value={title}
              onChange={e=>setTitle(e.target.value)}
            />
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="description">Enter description</label>
            <textarea
              rows={3}
              name="description"
              placeholder="Enter desciption"
              value={description}
              onChange={e=>setDescription(e.target.value)}
            />
          </div>
          <div className={styles.inputContainer}>
            <label>Select Category</label>
            <Select list={categories} setValue={setCategory} value={category} />
          </div>
          <div className={styles.inputContainer}>
            <label>Subscribers Only</label>
            <Toggle
              enabled={isSubscribersOnly}
              setEnabled={setIsSubscribersOnly}
            />
          </div>
          <div>
            <label className="mb-2">Tags</label>
            <TagInputField maxTagsLength={5} tags={tags} setTags={setTags} />
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={minting}
            className="bg-violet-600 whitespace-nowrap disabled:text-slate-200  disabled:bg-violet-7000 disabled:animate-pulse r:bg-violet-500 max-w-fit rounded-xl py-2 px-6"
          >
          {minting && <Spinner className="w-5 fill-slate-100 mr-1 animate-spin text-violet-900" />}
          {buttonState}
          </button>
        </div>
        <div className="flex flex-col ">
          <div className="h-48 border-2 relative overflow-hidden border-dashed text-slate-400 border-slate-600 my-4 rounded-xl aspect-video flex items-center justify-center">
            <input
              type="file"
              ref={videoRef}
              onChange={handleVideoChange}
              hidden
              name="video-input"
              id="video-input"
            />
            {!video && (
              <button
                onClick={() => videoRef.current.click()}
                className="bg-slate-700 font-normal text-sm px-4 py-2 text-slate-300 hover:text-slate-100 hover:bg-slate-600 rounded-full"
              >
                <VideoCameraIcon className="h-4 w-4" /> Click to upload video
              </button>
            )}
            {video && <video src={video} controls  className="h-full w-full " />}
            {video && (
              <button
                onClick={() => setVideo(null)}
                className="absolute bg-red-500 text-white text-xs right-2 top-2 px-2"
              >
                Reset
              </button>
            )}
          </div>
          <div className="h-48 border-2 relative overflow-hidden border-dashed text-slate-400 border-slate-600 my-4 rounded-xl aspect-video flex items-center justify-center">
            <input
              type="file"
              ref={thumbnailRef}
              onChange={handleThumbnailChange}
              hidden
              name="thumbnail-input"
              id="thumbnail-input"
            />
            {!thumbnail && (
              <button
                onClick={() => thumbnailRef.current.click()}
                className="bg-slate-700 font-normal text-sm px-4 py-2 text-slate-300 hover:text-slate-100 hover:bg-slate-600 rounded-full"
              >
                <PhotographIcon className="h-4 w-4" /> Click to upload thumbnail
              </button>
            )}
            {thumbnail && (
              <img
                src={thumbnail}
                alt="profile-picture"
                className="h-full w-full "
              />
            )}
            {thumbnail && (
              <button
                onClick={() => setThumbnail(null)}
                className="absolute bg-red-500 text-white text-xs right-2 top-2 px-2"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
      {error.length > 0 && (
        <div className="w-full text-red-400 py-4">
          {error?.map((err, index) => (
            <p key={index}> * {err}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default upload;
  