import React from "react";
import { useAddress, useMetamask } from "@thirdweb-dev/react";

type Props = {};

const ConnectSui = (props: Props) => {
  const connect = useMetamask();

  return (
    <button onClick={connect} className="bg-violet-600 hover:bg-violet-500">
      Connect SuiWallet
    </button>
  );
};

export default ConnectSui;
