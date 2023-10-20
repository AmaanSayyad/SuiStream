import { useSigner } from "@thirdweb-dev/react";
import { ethers, Transaction } from "ethers";
import React from "react";
import { SUPERSTREAM_CONTRACT_ADDRESS } from "../constants";
import SuperstreamContract from "../artifacts/contracts/Superstream.sol/Superstream.json";
import { AlchemyProvider } from "ethers/node_modules/@ethersproject/providers";
import toast from "react-hot-toast";
import { Profile } from "../recoil/states";

export type SessionData = {
  likes: number[];
  views: number;
  sessionId: string;
  isSubscribersOnly: boolean;
  id: number;
  creator: string;
};

export type Comment = {
  createdAt: number;
  topic: string; // topic will be video id for published videos & username for livech
  message: string;
  senderUsername: string;
  senderAddress: string;
};

const useSuperstreamContract = () => {
  const signer = useSigner();

  const provider = new AlchemyProvider(
    "maticmum",
    "y9AN19h5Qs12YEhnVPAHsePLRZU-Tszl"
  );

  const contract = new ethers.Contract(
    SUPERSTREAM_CONTRACT_ADDRESS,
    SuperstreamContract.abi,
    signer || provider
  );

  const addProfile = async (
    username: string | string[],
    bio: string,
    pfp: string,
    streamId: string,
    streamKey: string
  ): Promise<void> => {
    try {
      const tx = await contract.addProfile(
        username,
        bio,
        pfp,
        streamId,
        streamKey
      );
      await tx.wait();
      console.log(tx);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const getProfileByUsername = async (
    username: string | string[]
  ): Promise<Profile> => {
    try {
      const res = await contract.getProfileByUsername(username);
      return {
        bio: res.bio,
        defaultThumbnail: res.defaultThumbnail,
        defaultTitle: res.defaultTitle,
        followers: res.followers,
        follows: res.follows,
        id: res.id,
        owner: res.owner,
        pfp: res.pfp,
        streamId: res.streamId,
        username: res.username,
        isOnlySubscribers: res.isOnlySubscribers,
        subscribersCount: res.subscribersCount,
        subscriptionCharge: res.subscriptionCharge,
      };
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };
  const getProfileByAddress = async (): Promise<Profile> => {
    try {
      const res = await contract.getProfileByAddress();
      return {
        bio: res.bio,
        defaultThumbnail: res.defaultThumbnail,
        defaultTitle: res.defaultTitle,
        followers: res.followers,
        follows: res.follows,
        id: res.id,
        owner: res.owner,
        pfp: res.pfp,
        streamId: res.streamId,
        username: res.username,
        isOnlySubscribers: res.isOnlySubscribers,
        subscribersCount: res.subscribersCount,
        subscriptionCharge: res.subscriptionCharge,
      };
    } catch (err) {
      console.error(err);
    }
  };
  const getStreamId = async (username: string | string[]): Promise<string> => {
    try {
      const streamId = await contract.getStreamId(username);

      return streamId;
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const getStreamKey = async (): Promise<string> => {
    try {
      const streamKey = await contract.getStreamKey();
      return streamKey;
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const checkIfUsernameExists = async (username: string): Promise<boolean> => {
    try {
      const usernameExists = await contract.usernameTaken(username);
      return usernameExists;
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const getStreamInfo = async (
    username: string
  ): Promise<{ title: string; thumbnail: string }> => {
    try {
      const streamInfo = await contract.getStreamInfo(username);
      return { thumbnail: streamInfo[0], title: streamInfo[1] };
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const addStream = async (
    streamNftId: number,
    sessionId: string,
    isSubscribersOnly: boolean
  ) => {
    try {
      const tx = await contract.addStream(
        streamNftId,
        sessionId,
        isSubscribersOnly
      );
      await tx.wait();
      console.log(tx);
      return;
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const checkIfPublished = async (sessionId: string | string[]) => {
    try {
      const isPublished = await contract.isPublished(sessionId);
      return isPublished;
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const like = async (profileId: string, sessionId: string) => {
    try {
      const newLikeCount = await contract.like(profileId, sessionId);
      return newLikeCount;
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const follow = async (toFollowUsername: string) => {
    try {
      const tx = await contract.follow(toFollowUsername);
      await tx.wait();
      console.log(tx);
      // Events testing
      // contract.on()
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const getSessionData = async (streamNftId: number): Promise<SessionData> => {
    try {
      const response = await contract.getSessionData(streamNftId);

      return {
        likes: response.likes,
        views: response.views.toNumber(),
        sessionId: response.sessionId,
        creator: response.creator,
        id: response.id,
        isSubscribersOnly: response.isSubscribersOnly,
      };
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };
  const getSessionWithViewIncrement = async (
    streamNftId: number
  ): Promise<void> => {
    try {
      const response = await contract.getSessionWithViewIncrement(
        streamNftId
      );
      console.log(response);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const sendTip = async (toAddress: string, amount: number) => {
    try {
      const _amount = ethers.utils.parseEther(amount.toString());

      const response = await contract.tip(toAddress, _amount, {
        value: _amount,
      });
      await response.wait();
      console.log(response);
    } catch (err) {
      console.error(err);
      toast.error(err.data.message);
    }
  };

  const setStreamInfo = async (title: string, thumbnail: string) => {
    try {
      const tx = await contract.setStreamInfo(title, thumbnail);
      await tx.wait();
      console.log(tx);
    } catch (err) {
      console.error(err);
      toast.error(err.data.message);
    }
  };

  const setSubscriptionCharge = async (flowRate: string) => {
    try {
      const tx = await contract.setSubscriptionCharge(
        ethers.utils.parseEther(flowRate)
      );
      await tx.wait();
      console.log(tx);
    } catch (err) {
      console.error(err);
      toast.error(err.data.message);
    }
  };

  const toggleSubOnlyForLivestream = async () => {
    try {
      const tx = await contract.toggleSubOnlyForLiveStream();
      await tx.wait();
      console.log(tx);
    } catch (err) {
      console.error(err);
      toast.error(err.data.message);
    }
  };

  const toggleSubOnlyForPublishedStream = async (streamNftId: number) => {
    try {
      const tx = await contract.toggleSubOnlyForPublishedStream(streamNftId);
      await tx.wait();
      console.log(tx);
    } catch (err) {
      console.error(err);
      toast.error(err.data.message);
    }
  };

  const isSubscriber = async (username: string): Promise<boolean> => {
    try {
      const response = await contract.isSubscriber(username);
      return response;
    } catch (err) {
      console.error(err);
      toast.error(err.data.message);
    }
  };

  const addComment = async (topic: string, message: string): Promise<void> => {
    try {
      const tx = await contract.addComment(topic, message);
      await tx.wait();
      console.log(tx);
    } catch (err) {
      console.error(err);
      toast.error(err.data.message);
    }
  };

  const getComments = async (topic: string): Promise<Comment[]> => {
    try {
      let comments: Comment[] = [];
      const response = await contract.getComments(topic);

      response.forEach((item) => {
        comments.push({
          createdAt: item.createdAt.toString(),
          message: item.message,
          senderAddress: item.senderAddress,
          senderUsername: item.senderUsername,
          topic: item.topic,
        });
      });
      console.log(comments);
      return comments;
    } catch (err) {
      console.error(err);
      toast.error(err.data.message);
    }
  };
  const subscribe = async (username: string, flowRate: number) => {
    try {
      const tx = await contract.subscribe(username, flowRate);
      await tx.wait();
      console.log(tx);
    } catch (err) {
      console.error(err);
      toast.error(err.data.message);
    }
  };
  const unsubscribe = async (username: string) => {
    try {
      const tx = await contract.unsubscribe(username);
      await tx.wait();
      console.log(tx);
    } catch (err) {
      console.error(err);
      toast.error(err.data.message);
    }
  };

  const getSubscriptionInfo = async (username: string) => {
    try {
      const tx = await contract.getSubscriptionInfo(username);
      await tx.wait();
      console.log(tx);
    } catch (err) {
      console.error(err);
      toast.error(err.data.message);
    }
  };

  return {
    contract,
    addProfile,
    getProfileByAddress,
    getStreamId,
    getStreamKey,
    checkIfUsernameExists,
    getStreamInfo,
    getProfileByUsername,
    addStream,
    checkIfPublished,
    like,
    follow,
    getSessionData,
    getSessionWithViewIncrement,
    sendTip,
    setStreamInfo,
    setSubscriptionCharge,
    subscribe,
    unsubscribe,
    getComments,
    addComment,
    getSubscriptionInfo,
    isSubscriber,
    toggleSubOnlyForLivestream,
    toggleSubOnlyForPublishedStream,
  };
};

export default useSuperstreamContract;
