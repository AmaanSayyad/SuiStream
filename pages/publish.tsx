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

const stream = (props: Props) => {
  const currentAccount = useAddress();
  const router: NextRouter = useRouter();
  const sessionId = router.query.id;
  const [loading,setLoading]  = useState<boolean>();
  const [minting,setMinting] = useState<boolean>();
  const [category, setCategory] = useState<Category>(categories[0]);
  const [thumbnail, setThumbnail] = useState<string>();
  const thumbnailRef = useRef<HTMLInputElement>();
  const livepeer = useLivpeerApi();
  const [error, setError] = useState<string[]>([]);
  const [session,setSession] = useState<any>();
  const superstream = useSuperstreamContract();
  const [isPublished,setIsPublished] = useState<boolean>();
  const currentUser = useRecoilValue(currentUserState);
  const [tags,setTags] = useState<string[]>([]);
  const {storeFile} = useWeb3Storage();
  const [isSubscribersOnly, setIsSubscribersOnly] = useState();

  const checkIfAlreadyPublished = async () => {
    setLoading(true);
      const isMinted = await superstream.checkIfPublished(sessionId);
      setIsPublished(isMinted);
      setLoading(false);
  }

  const fetchSessionData = async () => {
    setLoading(true);
    const _session = await livepeer.getSession(sessionId);
    console.log(_session);
    setSession(_session);
    setLoading(false);
  }

  useEffect(()=>{
    if(sessionId){
      fetchSessionData();
      checkIfAlreadyPublished();
    }
  },[sessionId])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMinting(true);
    const title = e.target.title.value;
    const description = e.target.description.value;
    
    if(!title && !description){
      setError([...error,"Please fill all fields."])
    }
    if(!thumbnail){
      setError([...error,"Please select a thumbnail for your video."])
    }
    if(!currentAccount){
      setError([...error,"Please connect your wallet first"])
    }
    if(title && description && currentAccount && thumbnail ){
      toast("Minting stream Nft");
      const tokenId = await mintStream(title,description);
      // await superstream.addStream(tokenId,session.id,isSubscribersOnly);
      toast.success("Stream NFT Minted successfully");
      router.push("/dashboard")
    }
    setMinting(false);
  };

  const mintStream = async (name: string, description: string) => {
    try {
      if (session) {
        toast("Uploading thumbnail to ipfs");

        const thumbnail = await storeFile(thumbnailRef.current.files[0], props.web3storageToken);
        const metadata = {
          name,
          description,
          image: "ipfs://"+thumbnail,
          animation_url: session.mp4Url,
          created_at: Math.floor(new Date().getTime() / 1000).toString(),
          duration: session.transcodedSegmentsDuration,
          creator: currentUser.profile.username,
          properties: {
            category: category.name,
            tags: tags
          },
        };

        console.log(metadata);
        const response = await axios.post('/api/mint/stream',{
          address:currentAccount,
          metadata:metadata
        })
        console.log(response.data);
        // return ethers.BigNumber.from(response.data.tokenId).toNumber();
      }
    } catch (err) {
      console.error(err);
    }
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

  if(loading){
    return <div className="my-auto h-[90vh] gap-4 flex flex-col items-center justify-center">
      <p className="text-lg"> Loading ...  </p>
    </div>
  }

  if(!loading && !session){
    return <div className="my-auto h-[90vh] text-lg gap-4 flex flex-col items-center justify-center">
    Stream doesn't exist.
  </div>
  }

  if(isPublished){
    return <div className="my-auto h-[90vh] text-lg gap-4 flex flex-col items-center justify-center">
        Stream has been already published;
  </div>
  }

  return (
    <div className="mx-auto p-4">
      <h1 className="text-3xl font-display border-b border-gray-600 pb-4 mb-4">
        Mint & Publish Stream
      </h1>
      <form
        onSubmit={handleSubmit}
        className=" flex flex-col-reverse lg:flex-row gap-8  w-full"
      >
        <div className="w-1/2 flex flex-col gap-4">
          <div className={styles.inputContainer}>
            <label htmlFor="title">Enter title</label>
            <input
              name="title"
              required
              type="text"
              placeholder="Enter Title "
            />
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="description">Enter description</label>
            <textarea
              rows={3}
              name="description"
              placeholder="Enter desciption"
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
            <TagInputField maxTagsLength={5} tags={tags} setTags={setTags}/>
          </div>
          <button
            type="submit"
            disabled={minting}
            className="bg-violet-600 whitespace-nowrap disabled:text-slate-200  disabled:bg-violet-7000 disabled:animate-pulse r:bg-violet-500 max-w-fit rounded-xl py-2 px-6"
          >
            {!minting && "Mint & Publish Stream"}
            {minting && ("Minting Stream ... ")}
          </button>
        </div>
        <div>
          <label htmlFor="thumbnail">Upload Thumbnail </label>
          <input
            type="file"
            name="thumbnail"
            id="thumbnail"
            onChange={handleThumbnailChange}
            hidden
            ref={thumbnailRef}
          />
          <div className="border-dashed mb-4 aspect-video h-64 border-2 rounded-md mt-1 border-gray-600 flex items-center justify-center overflow-hidden">
            {!thumbnail && "No thumbnail Selected"}
            {thumbnail && (
              <img
                src={thumbnail}
                alt="thumbnail"
                className="h-full w-full object-contain object-center"
              />
            )}
          </div>
          <div className="flex gap-2 ">
            {thumbnail && (
              <button
                className="ring-1 ring-red-500 text-red-400"
                onClick={() => setThumbnail(null)}
              >
                Reset
              </button>
            )}
            <button
              className="bg-slate-800 hover:bg-slate-700"
              onClick={() => thumbnailRef.current.click()}
            >
              Upload Thumbnail
            </button>
          </div>
        </div>
      </form>
      {error.length > 0 && (
        <div className="w-full text-red-400 py-4">
          {error?.map((err,index) => (
            <p key={index}> * {err}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default stream;
