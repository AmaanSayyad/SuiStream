import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import {ethers} from "ethers";
import { NextApiRequest,NextApiResponse } from "next";
import { STREAM_NFT_ADDRESS } from "../../../constants";

export default function mint(req:NextApiRequest,res:NextApiResponse):Promise<any> {
  const rpcUrl = "https://rpc-mumbai.maticvigil.com";

  const wallet = new ethers.Wallet(
    process.env.PRIVATE_KEY,
    ethers.getDefaultProvider(rpcUrl)
  );

  const streamNft = new ThirdwebSDK(wallet).getNFTCollection(
    STREAM_NFT_ADDRESS
  );
  
return new Promise<void>((resolve) => {
  //get the wallet address that's sent from the request body,
  const {address,metadata} = req.body;
  streamNft.mintTo(address,metadata).then((tx) => {
    res.status(200).json({receipt:tx.receipt,tokenId:tx.id,nft:tx.data});
    resolve();
  }).catch(err=>console.error(err));
});

};