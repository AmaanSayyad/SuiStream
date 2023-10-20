import { Framework, SuperToken } from "@superfluid-finance/sdk-core";
import { FrameworkStruct } from "@superfluid-finance/sdk-core/dist/module/typechain/SuperfluidLoader";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { chain } from "wagmi-core";


const useSuperfluid = () => {
  // const [sf,setSf] = useState<FrameworkStruct>();
  const USDCX_ADDRESS = "0x42bb40bf79730451b11f6de1cba222f17b87afd7";

  // Approve
  // const approveUsdcx = async (receiver: string) => {
  //   try {
  //     const usdcx = await sf.loadSuperToken(USDCX_ADDRESS);
  //     const approveTxn = await usdcx
  //       .approve({
  //         receiver: receiver,
  //         amount: ethers.utils.parseUnits("100").toString(),
  //       })
  //       .exec(signer);
  //     const approveTxnReceipt = await approveTxn.wait();
  //     console.log(approveTxnReceipt);
  //     toast.success("Usdcx Approved!");
      
  //   } catch (err) {
  //     console.error(err);
  //     toast.error(err.message);
  //   }
  // };

  const initalizeSf = async () => {
    try {
      const { ethereum }: any = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const sf = await Framework.create({
        chainId: chain.polygonTestnetMumbai.id,
        provider: provider,
      });
      const signer = await sf.createSigner({ web3Provider: provider });
      return {sf,signer};
    }catch(err){
      console.log(err.message);
      toast.error("Failed to initialize Superfluid sdk")
    }
  }

  const createFlow = async (_flowRate: string, _receiver: string) => {
    try {
 
    const {sf,signer} = await initalizeSf();
    //Approve Usdcx
    const usdcx = await sf.loadSuperToken(USDCX_ADDRESS);
    const signerAddress = await signer.getAddress();
    const approveTxn = await usdcx.approve(
      {
        receiver:signerAddress,
        amount:ethers.utils.parseUnits("100").toString(),
      }
    ).exec(signer);
    const approveTxReceipt = await approveTxn.wait();
    console.log(approveTxReceipt);
    toast.success("USdcx approved!")
    

      const createFlowOperation = await sf.cfaV1.createFlow({
        flowRate: _flowRate,
        receiver: _receiver,
        superToken: USDCX_ADDRESS,
      });

      console.log("Creating Money Flow");

      const result = await createFlowOperation.exec(signer);
      console.log(result);

      toast.success("Subscription flow started successfully.")
      return {}
    } catch (err) {
      console.error(err);
    }
  };

  const deleteFlow = async (recipient: string) => {
   
  try {
   
    const {sf,signer} = await initalizeSf();
 
    const signerAddress = await signer.getAddress();
    console.log(signerAddress)
    console.log({signerAddress,recipient,SuperToken})
    const deleteFlowOperation = await sf.cfaV1.deleteFlow({
        sender:signerAddress,
        receiver: recipient,
        superToken: USDCX_ADDRESS,
        // userData?: string
    });

      console.log("Deleting your stream...");

      const result = await deleteFlowOperation.exec(signer);
      console.log(result);
      console.log(
        `Congrats - you've just deleted your money stream!
         Receiver: ${recipient}
      `
      );
      toast.success("Deleted Subscription flow successfully!")


    } catch (err) {
      console.error(err);
      toast.error(err.message.message);
    }
  };

  return { createFlow ,deleteFlow,initalizeSf };
};

export default useSuperfluid;
