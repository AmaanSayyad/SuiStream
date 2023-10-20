import { ethers } from 'ethers';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import useSuperfluid from '../hooks/useSuperfluid';

type Props = {}

const superfluid = (props: Props) => {
  const [monthlyFlowRate,setMonthlyFlowRate] = useState<any>(0);
  const RECEIVER_ADDRESS = "0xC36De947c7E8fF70721c2a4A70643106e0A103D5"
  const sf = useSuperfluid();

  const handleStartFlow = async () => {
    const flowRate = ethers.utils.parseEther(monthlyFlowRate);
    await sf.createFlow(flowRate.toString(),RECEIVER_ADDRESS).then(()=>{
      toast.success("Flow created Successfully");
    })
  }  

  const handleDeleteFlow = async () => {
    await sf.deleteFlow(RECEIVER_ADDRESS);
  }
  return (
    <div className='flex flex-col gap-4'>
      <input value={monthlyFlowRate} onChange={(e)=>setMonthlyFlowRate(e.target.value)} type="number" placeholder='Enter Monthly' />
      <button onClick={handleStartFlow}>Start Flow</button>
      <button onClick={handleDeleteFlow}>Cancel Subscription</button>
      <div>
          You will receive :  $ {(monthlyFlowRate * (3600 * 24 * 30)).toFixed(8) } / month;

      </div>
    </div>
  )
}

export default superfluid