import { atom } from "recoil";

export type Profile = {
  id: number;
  username: string;
  bio: string;
  pfp: string;
  streamId: string;
  defaultTitle: string;
  defaultThumbnail: string;
  followers: string[];
  follows: string[];
  owner: string;
  subscriptionCharge : BigInt; // flow rate  
  subscribersCount:number;
  isOnlySubscribers:boolean;
};

type AppUserState = {
  profile?: Profile;
  loading: boolean;
  hasProfile: boolean;
};


export const currentUserState = atom<AppUserState>({
  key: "currentUser",
  default: { loading: true, hasProfile: false },
});

export const currentUserStream = atom({
  key: "currentUserStream",
  default: {},
});
