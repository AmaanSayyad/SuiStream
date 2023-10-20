import { ethers } from 'ethers';
import React from 'react'
import { useRecoilValue } from 'recoil';
import { currentUserState } from '../../../recoil/states';

type Props = {}

const Stats = (props: Props) => {
  const currentUser = useRecoilValue(currentUserState);
  
  const styles ={
    container:`p-5  grid gap-4 bg-slate-800 rounded-xl shadow-xl`,
    name:`text-gray-400 font-medium`,
    value:`text-2xl font-display font-bold`
  }

  return (
    <div className={styles.container}>
      <div>
        <p className={styles.name}>Number of Subscribers</p>
        <p className={styles.value}>{currentUser?.profile?.subscribersCount.toString()} </p>
      </div>
      <div>
        <p className={styles.name}>Expected Income Per Second</p>
        <p className={styles.value}>$ {(Number(currentUser?.profile?.subscribersCount.toString()) * Number(ethers.utils.formatEther(currentUser?.profile?.subscriptionCharge.toString()))).toFixed(8) }</p>
      </div>
     </div>
  )
}

export default Stats