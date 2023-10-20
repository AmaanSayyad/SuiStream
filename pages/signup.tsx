import React, { Fragment, useRef, useState } from "react";
import { useAddress } from "@thirdweb-dev/react";
import toast from "react-hot-toast";
import useLivpeerApi from "../hooks/useLivepeerApi";
import useWeb3Storage from "../hooks/useWeb3Storage";
import useSuperstreamContract from "../hooks/useSuperstreamContract";
import { NextRouter, useRouter } from "next/router";
import Spinner from "../components/Spinner";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { useRecoilState } from "recoil";
import { currentUserState } from "../recoil/states";

type Props = {
  web3storageToken:string
};


export async function getStaticProps() {
  const token = process.env.ACCESS_TOKEN;
  return {
    props: {
      web3storageToken:token
    }, // will be passed to the page component as props
  }
}



const profile = (props:Props) => {
  const currentAccount = useAddress();
  const router:NextRouter = useRouter();
  const [minting,setMinting] = useState<boolean>();
  const filePickerRef = useRef<HTMLInputElement>();
  const [selectedFile, setSelectedFile] = useState<string>();
  const {addProfile,checkIfUsernameExists} = useSuperstreamContract()
  const livepeerApi = useLivpeerApi();
  const {storeFile} = useWeb3Storage();
  const [error,setError] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const superstream = useSuperstreamContract();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMinting(true);
    const username = e.target.username.value;
    const bio = e.target.bio.value;
    const file = filePickerRef.current.files[0];    
    // try{
    //   const usernameTaken = await checkIfUsernameExists(username);
    // } catch(err){
    //   console.error(err);
    // }
    if(!file) {
      setError([...error,"Please Choose a profile picture"])
    }
    if(!username && !bio){
      setError([...error,"Please fill all fields"])
    } 
    // if(usernameTaken) {
    //   setError([...error,"Username already taken !!"])
    // }
    if(username && bio && file){
      try{
      // Create Stream in Livepeer -- get streamId,streamKey
      const streamObject:any = await livepeerApi.createStream(username);
      console.log(streamObject.data);
      // Upload pfp to ipfs -- get pfpCid
      toast("Uploading profile picture to Ipfs...")
      const pfpUri = await storeFile(file,props.web3storageToken);
      console.log("Profile Picture Uploaded to " +pfpUri);
      // mint profile nft -- get profileId
      toast("Creating Profile...")
      await addProfile(username,bio,pfpUri,streamObject.data.id,streamObject.data.streamKey)
      toast.success("Profile Created Successfully..")
      setMinting(false);
      checkIfUserHasProfile();
      router.push('/dashboard');
    } catch(err) {
      console.error(err);
      toast.error(err.message);
    }
  }
  setMinting(false)
  };
  
  
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



  const handleFileChange = () => {
    const file = filePickerRef.current.files[0];
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
      setSelectedFile(readerEvent.target.result.toString());
    };
  };


  if(!currentAccount){
    return (
      <div className="text-2xl font-medium">
        PLease Connect to Metamask!
      </div>
    )
  }

  const closeModal = () => {
    
    router.push('/');
  }

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={closeModal}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as="div"
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 backdrop-blur-lg" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-fit p-6 overflow-hidden text-left align-middle transition-all transform bg-gray-800 shadow-xl rounded-2xl">
              <Dialog.Title className="text-2xl border-b border-b-gray-600 pb-4 text-center w-full  font-bold font-display ">
                Create a Superstream Profile
              </Dialog.Title>
              <div>
                <form
                  className="flex pt-4 justify-center gap-8 items-center w-full "
                  onSubmit={handleSubmit}
                >
                  <div className="mb-8 relative">
          
                    {selectedFile && <XIcon onClick={()=>setSelectedFile(null)} className="cursor-pointer shadow-lg ring-1 ring-white duration-200 hover:shadow-2xl hover:scale-110 h-6 w-6 top-3 right-3 absolute bg-red-500 p-1 rounded-full "/>}
                    <div
                      onClick={() => filePickerRef.current.click()}
                      className="cursor-pointer  object-center object-contain ring-1 ring-white overflow-hidden rounded-full bg-gray-700  border-dashed flex items-center justify-center h-40 w-40"
                    >
                      <input
                        type="file"
                        ref={filePickerRef}
                        onChange={handleFileChange}
                        hidden
                      />
                      {!selectedFile && (
                        <p className="text-xs text-center font-display">
                          Click to upload profile picture
                        </p>
                      )}
                      {selectedFile && (
                        <img
                          src={selectedFile}
                          alt="profile-picture"
                          className="h-full w-full"
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-col w-80 col-span-2">
                      <label htmlFor="useranme">Username</label>
                      <input
                        type="text"
                        name="username"
                        placeholder="Enter username"
                      />
                    </div>

                    <div className="flex flex-col mt-4 col-span-2">
                      <label htmlFor="bio">Bio</label>
                      <textarea
                        name="bio"
                        placeholder="Say something about yourself"
                      />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        type="submit"
                        disabled={minting}
                        className=" bg-violet-600 disabled:bg-violet-700 disabled:bg-opacity-90 disabled:text-gray-300 hover:bg-violet-500"
                      >
                        {minting && <Spinner className="w-5 fill-slate-100 mr-1 animate-spin text-violet-900" />}
                        {minting && "Creating Profile..."}
                        {!minting && "Create Profile"}
                      </button>
                      <button onClick={closeModal} className="bg-slate-700 hover:bg-slate-600 text-gray-400">Cancel</button>
                    </div>
                  </div>
                </form>
              </div>
              {error.length > 0 && (
                <div className="w-full text-center italic font-medium text-red-400 mt-4">
                  {error?.map((err) => (
                    <p> * {err}</p>
                  ))}
                </div>
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default profile;
