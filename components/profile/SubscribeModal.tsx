import React ,{Fragment, useEffect, useState}from 'react'
import {Dialog,Transition} from "@headlessui/react"
import { BadgeCheckIcon, GiftIcon, XIcon } from '@heroicons/react/outline';
import { ethers } from 'ethers';
import { useAddress, useSigner } from '@thirdweb-dev/react';
import { USDCX_ABI, USDCX_ADDRESS } from '../../constants';
import useSuperfluid from '../../hooks/useSuperfluid';
import toast from 'react-hot-toast';
import useSuperstreamContract from '../../hooks/useSuperstreamContract';


type Props = {
  isOpen:boolean
  setIsOpen:any
  setIsSubscribed:any
  toUser:string
  toUserAddress:string
  flowRate:any
}

const SubscribeModal = ({isOpen,setIsOpen,toUser,toUserAddress,flowRate,setIsSubscribed}: Props) => {
  const address = useAddress();
  const {initalizeSf,createFlow} = useSuperfluid();
  const [usdcxBalance,setUsdcxBalance] = useState<string>('');
  const superstream = useSuperstreamContract()
  const getUSDCxBalance = async () => {
    try{
      const {sf,signer} = await initalizeSf();
      const usdcx = await sf.loadSuperToken(USDCX_ADDRESS);
      const _balance = await usdcx.balanceOf({account:address,providerOrSigner:signer});
      setUsdcxBalance(ethers.utils.formatEther(_balance));
    } catch(err){
      console.error(err);
      toast.error("Subscription Failed")
    }
  }

  useEffect(()=>{
    if(address){
      getUSDCxBalance(); 
    }
  },[address])



  const handleSubscribe = async () => {
    const createFlowOperation = await createFlow(flowRate.toString(),toUserAddress);
    toast("Subscription Flow Started ��");
    const subscribeOperation = await superstream.subscribe(toUser,Number(flowRate.toString()));
    toast.success("Subscription Successful")
    // call subscribe
    setIsSubscribed(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  }
  const formatFlowRate = (flowRate:string) => {
    return Number(ethers.utils.formatEther(flowRate.toString())).toFixed(8);
  }
    return (
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-5 text-center">
            <Transition.Child
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
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-800 shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-2xl mb-4 font-display font-medium leading-6 text-gray-100"
                >
                  Subscribe to {toUser}
                </Dialog.Title>
                <div>
                <p>Your USDCx Balance : {Number(usdcxBalance)?.toFixed(4)} </p>
                <p> Currency : USDCx </p>
                Subscription charge : $ {flowRate && Number(ethers.utils.formatEther(flowRate?.toString())).toFixed(8) } / second
                </div>
                <div className="flex gap-4 mt-4">
                  <button onClick={handleSubscribe} className="w-full py-2  rounded-lg justify-center bg-emerald-500 group hover:bg-emerald-400">
                    <BadgeCheckIcon className="h-6 w-6 mr-2 group-hover:scale-110  group-hover:rotate-6" />
                    Subscribe
                  </button>
                  <button
                    onClick={closeModal}
                    className="w-full bg-rose-500 justify-center rounded-lg hover:bg-rose-400 active:bg-rose-600"
                  >
                    <XIcon className="h-6 w-6 mr-2 group-hover:scale-110" /> Cancel{" "}
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
  )
}

export default SubscribeModal