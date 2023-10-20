import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import React, { Fragment, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import useSuperstreamContract from "../../hooks/useSuperstreamContract";
import useWeb3Storage from "../../hooks/useWeb3Storage";
import Spinner from "../Spinner";

type Props = {
  isOpen: boolean;
  setIsOpen: (boolean) => void;
  web3storageToken:string
};




const CreateProfile = ({ isOpen, setIsOpen,web3storageToken }: Props) => {
  const filePickerRef = useRef<HTMLInputElement>();
  const [selectedFile, setSelectedFile] = useState<string>();
  const [errors, setErrors] = useState<string[]>([]);
  const [minting, setMinting] = useState<boolean>(false);
  const web3Storage = useWeb3Storage();
  const {checkIfUsernameExists} = useSuperstreamContract();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMinting(true);
    const username = e.target.username.value;
    const bio = e.target.bio.value;
    const file = filePickerRef.current.files[0];

    if(!file) {
      setErrors([...errors,"Please Choose a profile picture"])
    }
    if(!username && !bio){
      setErrors([...errors,"Please fill all fields"])
    } 
    // if(usernameTaken) {
    //   setErrors([...errors,"Username already taken !!"])
    // }
    if(username && bio && file){
    try{
      // Upload thumbnail to ipfs
      const pfp = await web3Storage.storeFile(file,web3storageToken);
      // Save data to block chain

    } catch(err){
      toast.error(err.message);
      console.error(err);
    }
  }
    setSelectedFile(null);
    setMinting(false);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  
  useEffect(()=>{
    return () => setSelectedFile(null);
  },[])

  return (
    <Transition appear show={isOpen} as={Fragment}>
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
              {errors.length > 0 && (
                <div className="w-full text-center italic font-medium text-red-400 mt-4">
                  {errors?.map((err) => (
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

export default CreateProfile;
