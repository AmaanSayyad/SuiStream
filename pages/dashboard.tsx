import { useSigner } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Tab } from "@headlessui/react";
import Loading from "../components/Loading";
import useLivpeerApi from "../hooks/useLivepeerApi";
import { currentUserState } from "../recoil/states";
import StreamDetails from "../components/dashboard/streamDetails/StreamDetails";
import SessionDetails from "../components/dashboard/SessionDetails";
import Subscriptions from "../components/dashboard/Subscriptions/Subscriptions";
import EditStreamInfo from "../components/dashboard/streamDetails/EditStreamInfo";
import useSuperstreamContract from "../hooks/useSuperstreamContract";
import Stats from "../components/dashboard/Subscriptions/Stats";
import { InformationCircleIcon } from "@heroicons/react/outline";

const tabs = [
  'Stream Details ',
  'Sessions',
  'Published Videos',
  'Subscriptions',
]

type Props = {
  web3storageToken:string
};

export async function getStaticProps() {
  const token = process.env.ACCESS_TOKEN;
  return {
    props: {
      web3storageToken:token
    }, // will be passed to the page component as props
  }
}

const Dashboard = ({web3storageToken}:Props) => {
  const signer = useSigner();
  const currentUser = useRecoilValue(currentUserState);
  const [loading, setLoading] = useState(true);
  const [stream, setStream] = useState<any>();
  const livepeer = useLivpeerApi();
  const router = useRouter();
  const {getStreamKey} = useSuperstreamContract();
  
  const getStreamStatus = async () => {
    setLoading(true);
    const data = await livepeer.fetchStreamStatus(currentUser.profile.streamId);
    setStream(data);
    console.log(stream);
    setLoading(false);
  };

  useEffect(() => {
    if (currentUser?.profile?.streamId) {
      getStreamStatus();
    }
  }, [currentUser]);

  if (!signer) {
    return (
      <div className="h-[85vh] flex items-center justify-center text-lg">
        Please Connect your metamask wallet!
      </div>
    );
  }

  if (!currentUser.loading && !currentUser.hasProfile) {
    router.push("/signup");
  }

  if (loading) {
    return <Loading />;
  }

  const styles = {
    tablist: `flex   select-none  text-gray-400 p-1 gap-1 items-center bg-slate-800  rounded-lg  my-4 overflow-hidden `,
    selectedTab: `bg-violet-600 font-medium shadow-xl text-white px-4 py-1 rounded-lg whitespace-nowrap`,
    tab: `cursor-pointer px-4 font-normal py-1 hover:bg-slate-700 rounded-md duration-200 ease-out whitespace-nowrap`,
  };
  return (
    <div className="">
      <h1 className="text-3xl white font-display">Dashboard </h1>
      <div>
        <Tab.Group>
          <Tab.List className={styles.tablist}>
            {tabs.map((item) => (
              <Tab
            key={item}
                as="div"
                className={({ selected }) =>
                  selected ? styles.selectedTab : styles.tab
                }
              >
                {item}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <div className="flex w-full flex-wrap gap-4">
              <EditStreamInfo web3storageToken={web3storageToken}/>
              <StreamDetails stream={stream} />
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <SessionDetails streamId={currentUser?.profile?.streamId}/>
            </Tab.Panel>
            <Tab.Panel>Published Videos</Tab.Panel>
            <Tab.Panel>
            <div className="flex w-full flex-wrap gap-4">
            <p className="border w-full bg-sky-900 bg-opacity-50 border-sky-500 text-sky-300 px-2 flex gap-2 p-1 rounded-md text-sm">
          <InformationCircleIcon className="h-5 w-5 " />
          Subscribers pay for each second in USDCx they are subscribed to your
          channel.
        </p>
              <Subscriptions/>
            <Stats/>
            </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};
export default Dashboard;
