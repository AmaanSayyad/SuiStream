import { Transition ,Dialog} from '@headlessui/react'
import { ethers } from 'ethers'
import React,{Fragment, useMemo, useState} from 'react'
import toast from 'react-hot-toast'
import useSuperstreamContract from '../../../hooks/useSuperstreamContract'
import Spinner from "../../Spinner"

type Props = {
  isOpen:boolean
  setIsOpen:(boolean) => void
  setFlowRate:(any) => void
}

const EditSubscriptionFees = ({isOpen,setIsOpen,setFlowRate}: Props) => {
  const [monthlyFlowRate,setMonthlyFlowRate] = useState<any>(5.00);
  const secondlyflowRate = useMemo(()=>(monthlyFlowRate/(3600*24*30)).toFixed(18),[monthlyFlowRate]);
  const {setSubscriptionCharge} = useSuperstreamContract();
  const [saving ,setSaving] = useState<boolean>(false)
  
  const save = async () => {
    try{
      setSaving(true);
      const setOperation = await setSubscriptionCharge(secondlyflowRate.toString());
      setFlowRate(secondlyflowRate);
      setSaving(false);
      closeModal();
      
      toast.success("Subscription Fee Changed Successfully!")
    } catch(err){
      setSaving(false);
      console.log(err);
      toast.error(err.message)
    }
  }
  
  const closeModal = () => {
    setIsOpen(false);
  }

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
          <Dialog.Overlay className="fixed inset-0 backdrop-blur-lg backdrop-brightness-75" />
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
            <Dialog.Title className="text-2xl pb-2 text-center w-full  font-bold font-display ">
              Set Subscription Fees
            </Dialog.Title>
            
            <div className="relative">

            <input 
            type="number"
            value={monthlyFlowRate} 
            onChange={(e)=>setMonthlyFlowRate(e.target.value)}
            id='sub-fee-input'
            />
              <span className='absolute left-3 top-[0.4rem] text-gray-400 font-display text-lg'>$</span>
              <span className='absolute right-12 top-[0.5rem] text-gray-400 font-display '>/ month</span>
            </div>
            <div className='flex gap-2 mt-4'>
              <button disabled={saving} onClick={save} className='bg-emerald-500 disabled:bg-emerald-700 disabled:text-emerald-300 hover:bg-emerald-600'>{!saving && "Save"}
              {saving && <>
               <Spinner className="w-5 fill-emerald-300 mr-1 animate-spin text-emerald-900" />
              <div>Saving....</div>
              </>}
              </button>
              <button onClick={closeModal} className='bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-gray-100'>Cancel</button>
            </div>
          </div>
        </Transition.Child>
      </div>
    </Dialog>
  </Transition>
  )
}

export default EditSubscriptionFees;