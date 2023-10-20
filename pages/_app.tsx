import { AppProps } from "next/app";
import "../styles/globals.css";
import Layout from "../components/layout/Layout";
import { Toaster } from "react-hot-toast";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import { RecoilRoot } from "recoil";



function MyApp({ Component, pageProps, web3storageToken }) {
  return (
    <ThirdwebProvider desiredChainId={ChainId.Mumbai}>
        <RecoilRoot>
        <Layout>
          <Toaster position="bottom-right" />
          <Component {...pageProps} />
        </Layout>
    </RecoilRoot>
      </ThirdwebProvider>
  );
}

export default MyApp;
