import React from 'react';
import toast from 'react-hot-toast';
import {Web3Storage} from "web3.storage";

const useWeb3Storage = () => {
  
  const makeStorageClient = () => {
    return new Web3Storage({token:process.env.ACCESS_TOKEN})
  }

  const storeFile = async (file:File,token:string) =>{
    console.log("inside store file")
    try{

      const client = new Web3Storage({token});
      const cid = await client.put([file]);
      return `${cid}/${file.name}`;
    }catch(err){
      console.error(err);
    }
  }
  
  const retrieveFile = async (cid:string) => {
    const client = makeStorageClient();
    const res = await client.get(cid);
    console.log(`Got a response! [${res.status}] ${res.statusText}` )
    if(!res.ok){
      throw new Error(`Failed to get ${cid} - [${res.status}] ${res.statusText}`)
    }
    const file = await res.files()
    console.log(file);
  }

  return {makeStorageClient,storeFile,retrieveFile}

}
  
export default useWeb3Storage