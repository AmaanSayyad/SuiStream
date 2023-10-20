import { Tab } from '@headlessui/react'
import { ethers } from 'ethers'
import React, { useEffect, useMemo, useState } from 'react'
import { useRecoilState } from 'recoil'
import { currentUserState } from '../../../recoil/states'

import EditSubscriptionFees from './EditSubscriptionFees'

type Props = {}


const SubscriptionFees = (props: Props) => {
  const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
  const [flowRate, setFlowRate] = useState<any>("0.00");
  const monthly = useMemo(() => (flowRate*(3600*24*30)).toFixed(6),[flowRate]);
  const hourly = useMemo(() => (flowRate*(3600)).toFixed(6),[flowRate]);
  const daily = useMemo(() => (flowRate*(3600*24)).toFixed(6),[flowRate]);
  const [isEditing,setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    if(currentUser?.profile?.subscriptionCharge){
      setFlowRate((Number(currentUser?.profile?.subscriptionCharge) / Number(ethers.constants.WeiPerEther)).toString());
    }
  }, [currentUser])
  

  const styles = {
    card: `bg-slate-800 p-5 shadow rounded-xl`,
    tablist: `flex text-xs select-none text-gray-400 p-1 gap-1 items-center bg-gray-900  rounded-lg  bg-slate-700 overflow-hidden `,
    selectedTab: `bg-sky-500 shadow-xl text-white px-3 py-1 rounded-md whitespace-nowrap`,
    tab: `cursor-pointer px-2 py-1 hover:bg-gray-700 rounded-md duration-200 ease-out whitespace-nowrap`,
    tabPanel:`text-3xl font-bold font-display my-2`
  };

  return (
    <>
    <EditSubscriptionFees setFlowRate={setFlowRate} isOpen={isEditing} setIsOpen={setIsEditing}/>
    <div className={styles.card}>
    <h6 className="text-xl mb-1 font-semibold font-display text-gray-300">
      Subscription fees 
    </h6>
    <Tab.Group>
      <Tab.List className={styles.tablist}>
        <Tab className={({ selected }) =>
              selected ? styles.selectedTab : styles.tab
            }> per month</Tab>
            <Tab className={({ selected }) =>
                  selected ? styles.selectedTab : styles.tab
                }> per day</Tab>
            <Tab className={({ selected }) =>
                  selected ? styles.selectedTab : styles.tab
                }> per hour</Tab>
            <Tab className={({ selected }) =>
                  selected ? styles.selectedTab : styles.tab
                }> per second</Tab>
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel className={styles.tabPanel}>
          $ {monthly} <span className="text-lg font-normal text-gray-400"> / month </span>
        </Tab.Panel>
        <Tab.Panel className={styles.tabPanel}>
          $ {daily} <span className="text-lg font-normal text-gray-400"> / day </span>
        </Tab.Panel>
        <Tab.Panel className={styles.tabPanel}>
          $ {hourly}<span className="text-lg font-normal text-gray-400"> / hour </span>
        </Tab.Panel>
        <Tab.Panel className={styles.tabPanel}>
          $ {Number(flowRate).toFixed(8)} <span className="text-lg font-normal text-gray-400"> / second </span>
        </Tab.Panel >
      </Tab.Panels>
    </Tab.Group>
  
    <button onClick={()=>setIsEditing(true)} className="bg-violet-600 hover:bg-violet-500 mt-4">Edit Subscription Fees</button>
  </div>
    </>
  )
}

export default SubscriptionFees