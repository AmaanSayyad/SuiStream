import React from 'react'
import {useAddress,useMetamask} from "@thirdweb-dev/react";

type Props = {}

const ConnectMetamask = (props: Props) => {
  const connect = useMetamask();

  return (
    <button onClick={connect} className='bg-violet-600 hover:bg-violet-500'>ConnectMetamask</button>
  )
}

export default ConnectMetamask