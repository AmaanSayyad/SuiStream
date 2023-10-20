import React, { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import useSuperstreamContract from "../../../hooks/useSuperstreamContract";
import { currentUserState } from "../../../recoil/states";
import { PhotographIcon } from "@heroicons/react/outline/";
import Spinner from "../../Spinner";
import toast from "react-hot-toast";
import useWeb3Storage from "../../../hooks/useWeb3Storage";
import { profile } from "console";

type Props = {
 web3storageToken:string
};

const EditStreamInfo = (props: Props) => {
  const [title, setTitle] = useState<string>();
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const [editing, setEditing] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<string>();
  const filePickerRef = useRef<HTMLInputElement>();
  const { setStreamInfo } = useSuperstreamContract();
  const {storeFile} = useWeb3Storage();
  
  const saveChanges = async() => {
    setSaving(true);
    try{
      toast("Saving changes");
      // get thumbnail Cid
      const thumbnailUri =await storeFile(filePickerRef.current.files[0],props.web3storageToken); 
      toast.success("Thumbnail Uploaded to Ipfs.")
      const saveTxn = await setStreamInfo(title,thumbnailUri); 
      toast.success("Changes Saved");
      window.location.reload();
      setEditing(false);
      setSaving(false);
    } catch(err){
      console.error(err);
      toast.error(err.message);
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

  //If in editing mode
  if (editing) {
    return (
      <div className="bg-slate-800 p-4 rounded-xl">
        <h6 className="border-b text-xl font-display font-medium  pb-1 border-slate-700">
          Edit Live Stream Title & Thumbnail
        </h6>
        <div className="h-64 border-2 relative overflow-hidden border-dashed text-slate-400 border-slate-600 my-4 rounded-xl aspect-video flex items-center justify-center">
          <input
            type="file"
            ref={filePickerRef}
            onChange={handleFileChange}
            hidden
            name="thumbnail-input"
            id="thumbnail-input"
          />
          {!selectedFile && (
            <button
              onClick={() => filePickerRef.current.click()}
              className="bg-slate-700 px-4 py-2 text-slate-300 hover:text-slate-100 hover:bg-slate-600 rounded-full"
            >
              
              <PhotographIcon className="h-6 w-6" /> Click to upload thumbnail
            </button>
          )}
          {selectedFile && (
            <img
              src={selectedFile}
              alt="profile-picture"
              className="h-full w-full "
            />
          )}
          {selectedFile && (
            <button onClick={()=>setSelectedFile(null)} className="absolute bg-red-500 text-white text-xs right-2 top-2 px-2">Reset</button>
          )}
        </div>
        <input
          className="w-full"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter new livestream title..."
        />
        <div className="flex gap-2 mt-4">
          <button
            disabled={saving}
            onClick={saveChanges}
            className="bg-emerald-500 disabled:bg-emerald-700 disabled:text-emerald-300 hover:bg-emerald-600"
          >
            {!saving && "Save Changes"}
            {saving && (
              <>
                <Spinner className="w-5 fill-emerald-300 mr-1 animate-spin text-emerald-900" />
                <div>Saving....</div>
              </>
            )}
          </button>
          <button
            onClick={() => setEditing(false)}
            className="bg-slate-700 hover:bg-slate-600 text-gray-400 hover:text-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 p-4 rounded-xl ">
      <h6 className=" text-xl font-display font-medium  pb-1 ">
        Edit Live Stream Title & Thumbnail
      </h6>
      {currentUser?.profile?.defaultThumbnail ? (
        <img
          className="h-64 bg-slate-700 rounded-xl overflow-hidden my-4 aspect-video"
          src={"https://ipfs.io/ipfs/" + currentUser?.profile?.defaultThumbnail}
          alt="thumbnail"
        />
      ) : (
        <div className="h-64 bg-slate-700 rounded-xl grid place-items-center overflow-hidden my-4 aspect-video">
          No Thumbnail Selected
        </div>
      )}
      <h1 className="text-xl">{currentUser?.profile?.defaultTitle}</h1>
      <button
        onClick={() => setEditing(true)}
        className="bg-sky-500 hover:bg-sky-600 mt-2"
      >
        Edit Thumbnail & Title
      </button>
    </div>
  );
};

export default EditStreamInfo;
