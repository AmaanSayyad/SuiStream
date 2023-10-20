import Avatar from "./Avatar";
import { GiftIcon, HeartIcon, BadgeCheckIcon } from "@heroicons/react/outline";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { currentUserState, Profile } from "../../recoil/states";
import toast from "react-hot-toast";
import useSuperstreamContract from "../../hooks/useSuperstreamContract";
import { useSigner } from "@thirdweb-dev/react";
import { HeartIcon as HeartIconFilled } from "@heroicons/react/solid";
import SendTip from "../profile/SendTip";
import useSuperfluid from "../../hooks/useSuperfluid";
import SubscribeModal from "./SubscribeModal";
import Link from "next/link";

type Props = {
  profileData: Profile;
};

const ProfileInfo = ({ profileData }: Props) => {
  const [profile, setProfile] = useState<Profile>(profileData);
  const [tipModal, setTipModal] = useState<boolean>(false);
  const currentUser = useRecoilValue(currentUserState);
  const { follow, isSubscriber } = useSuperstreamContract();
  const signer = useSigner();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>();
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const { deleteFlow } = useSuperfluid();
  const [subscibeModal, setSubscribeModal] = useState<boolean>(false);

  const isOwnProfile = async () => {
    const result = (await currentUser?.profile?.owner) === profile?.owner;
    setIsOwner(result);
  };

  const showSubscribeModal = () => {
    if (!signer) {
      toast("Connect your Metamask Wallet");
      return;
    }
    setSubscribeModal(true);
  };

  const handleUnsubscribe = () => {
    if (!signer) {
      toast("Connect your Metamask Wallet");
      return;
    }
    setIsSubscribed(false);
    // stop superfluid stream
    // call unsubscriber
  };

  const handleSendTip = () => {
    if (!signer) {
      toast("Connect your Metamask Wallet");
      return;
    }
    setTipModal(true);
  };
  const handleFollow = async () => {
    if (signer) {
      await follow(profile?.username).catch((err) => {
        toast.success("You followed " + profile?.username);
        setIsFollowing(true);
      });
    } else {
      toast("Connect your Metamask Wallet !");
    }
  };

  const checkIfSubscribed = async () => {
    if (!isOwner) {
      const result = await isSubscriber(profile?.username);
      setIsSubscribed(result);
      console.log(isSubscribed);
    }
  };

  const checkIfFollowing = async () => {
    const result = await currentUser?.profile?.follows.includes(
      profile?.username
    );
    setIsFollowing(result);
  };

  useEffect(() => {
    if (currentUser?.profile && profile) {
      isOwnProfile();
      checkIfFollowing();
      checkIfSubscribed();
    }
  }, [currentUser, profile]);

  return (
    <div>
      <SendTip
        isOpen={tipModal}
        setIsOpen={setTipModal}
        toUser={profile?.username}
        toAddress={profile?.owner}
      />
      <SubscribeModal
        isOpen={subscibeModal}
        setIsOpen={setSubscribeModal}
        toUser={profile?.username}
        toUserAddress={profile?.owner}
        flowRate={profile?.subscriptionCharge}
        setIsSubscribed={setIsSubscribed}
      />
      <div className="flex items-center gap-4">
        <Avatar src={"https://ipfs.io/ipfs/" + profile?.pfp} />
        <div className="flex-1 font-display">
          <Link href={`/u/${profile?.username}`}>
            <h6 className="text-xl cursor-pointer font-medium">
              {profile?.username}
            </h6>
          </Link>
          <p className="text-medium text-gray-400">
            {profile?.followers.length} Followers |{" "}
            {profile?.subscribersCount.toString()} Subscribers{" "}
          </p>
        </div>
        <div className="flex gap-2">
          {!isOwner && (
            <button
              disabled={isFollowing}
              onClick={handleFollow}
              className="text-lg bg-violet-600 hover:bg-violet-500 group  disabled:text-gray-400  disabled:bg-gray-800  gap-2"
            >
              {!isFollowing && (
                <HeartIcon className="group-hover:scale-110 group-hover:rotate-12 duration-300 ease-out h-6 w-6" />
              )}
              {isFollowing && (
                <HeartIconFilled className="group-hover:scale-110 group-hover:rotate-12 duration-300 ease-out h-6 w-6" />
              )}
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}

          {!isOwner &&
            (isSubscribed ? (
              <button
                onClick={handleUnsubscribe}
                className="text-lg flex bg-amber-500 hover:bg-yellow-500 group  disabled:text-gray-400  disabled:bg-gray-800  gap-2"
              >
                <BadgeCheckIcon className="group-hover:scale-110 group-hover:rotate-12 duration-300 ease-out h-6 w-6" />
                Unsubscribe
              </button>
            ) : (
              <button
                onClick={showSubscribeModal}
                className="text-lg bg-amber-500 hover:bg-yellow-500 group  disabled:text-gray-400  disabled:bg-gray-800  gap-2"
              >
                <BadgeCheckIcon className="group-hover:scale-110 group-hover:rotate-12 duration-300 ease-out h-6 w-6" />
                Subscribe
              </button>
            ))}
          <button
            onClick={handleSendTip}
            className="text-lg bg-emerald-500 hover:bg-emerald-400 group   gap-2"
          >
            <GiftIcon className="group-hover:scale-110 group-hover:rotate-12 duration-300 ease-out h-6 w-6" />
            Send Tip
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
