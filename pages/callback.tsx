// pages/oauth-callback.js

import { useEffect } from "react";
import {
  genAddressSeed,
  getExtendedEphemeralPublicKey,
  getZkLoginSignature,
  jwtToAddress,
} from "@mysten/zklogin";
import { generateNonce, generateRandomness } from "@mysten/zklogin";
import { SuiClient } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";

export interface ZKPReqPayload {
  jwt: string;
  extendedEphemeralPublicKey: string;
  maxEpoch: number;
  jwtRandomness: string;
  salt: "0";
  keyClaimName: "sub";
}

export type PartialZkLoginSignature = Omit<
  Parameters<typeof getZkLoginSignature>["0"]["inputs"],
  "addressSeed"
>;

const userSalt = "129390038577185583942388216820280642146";

const REDIRECT_URI = "http://localhost:3000/callback";

const FULLNODE_URL = "https://fullnode.devnet.sui.io";

const ephemeralKeyPair = new Ed25519Keypair();

let epoch = "";

export async function zkLogin() {
  const suiClient = new SuiClient({ url: FULLNODE_URL });
  epoch = (await suiClient.getLatestSuiSystemState()).epoch;

  const maxEpoch = Number(epoch) + 2; // this means the ephemeral key will be active for 2 epochs from now.

  const randomness = generateRandomness();
  const nonce = generateNonce(
    ephemeralKeyPair.getPublicKey(),
    maxEpoch,
    randomness
  );

  const CLIENT_ID =
    "1057019886938-ujpgthletdvlfn6tq32pp5ha582ib47j.apps.googleusercontent.com";
  const NONCE = nonce;

  const loginURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&response_type=id_token&redirect_uri=${REDIRECT_URI}&scope=openid&nonce=${NONCE}`;

  // You can now use the loginURL for authentication or any other actions you need to perform.
  console.log("HARSSSSSSSSSSSSSSSSSSSS", loginURL);
}

zkLogin().catch((error) => {
  console.error(error);
});

const OAuthCallbackPage = () => {
  useEffect(() => {
    // Extract and process the id_token here
    const hash = window.location.hash.substring(1);
    const hashParams = hash.split("&").reduce((params, param) => {
      const [key, value] = param.split("=");
      params[key] = value;
      return params;
    }, {});
    //@ts-ignore
    const idToken = hashParams.id_token;

    const payload = idToken && idToken.split(".")[1];
    const decodedPayload = payload && JSON.parse(atob(payload));

    console.log("id_token:", idToken);

    // Now you can access the claims in the payload
    console.log("Decoded Payload:", decodedPayload);

    // Now you can verify the id_token and authenticate the user

    const zkLoginUserAddress = jwtToAddress(idToken, userSalt);
    console.log("zkLoginUserAddress:", zkLoginUserAddress);

    const generateProof = async (
      zkpReqPayload: ZKPReqPayload
    ): Promise<PartialZkLoginSignature> => {
      try {
        const calcrandomNess = generateRandomness();
        console.log(zkpReqPayload);
        const res = await fetch("http://localhost:8010/proxy/v1", {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jwt: idToken,
            extendedEphemeralPublicKey: getExtendedEphemeralPublicKey(
              ephemeralKeyPair.getPublicKey()
            ),
            maxEpoch: epoch,
            jwtRandomness: calcrandomNess,
            salt: "0",
            keyClaimName: "sub",
          }),
        });

        if (!res.ok) {
          const error = await res.text();
          throw new Error(error);
        }

        const data = await res.json();
        return data;

        console.log("API response data", data);
      } catch (err) {
        console.error(err);
        const demmi = {
          proofPoints: {
            a: [
              "5269899869155837208812347723139000629277338112368079595938096017712442290435",
              "4094053162911090813560569865050853009576300612791394505685465228741066749773",
              "1",
            ],
            b: [
              [
                "13154198965047707453293634888861573363583390555839794369317310575450112098542",
                "3458838022077135832401988542859004355958890318063762492612784420425269092765",
              ],
              [
                "16569089400140985982205035951997672036929013939923172215055857765311605080647",
                "1152117817977733694255872467123936693494829255677283644402133741888400749336",
              ],
              ["1", "0"],
            ],
            c: [
              "15235721341728444640538726513564650462636842284989917939235944746939011913438",
              "5530797828806708347743126692872989229145245407395106983024010315213089054172",
              "1",
            ],
          },
          issBase64Details: {
            value: "yJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLC",
            indexMod4: 1,
          },
          headerBase64:
            "eyJhbGciOiJSUzI1NiIsImtpZCI6IjdkMzM0NDk3NTA2YWNiNzRjZGVlZGFhNjYxODRkMTU1NDdmODM2OTMiLCJ0eXAiOiJKV1QifQ",
        };
        return demmi;
      }
    };

    generateProof({
      jwt: idToken,
      extendedEphemeralPublicKey: getExtendedEphemeralPublicKey(
        ephemeralKeyPair.getPublicKey()
      ),
      maxEpoch: Number(epoch),
      jwtRandomness: generateRandomness(),
      salt: "0",
      keyClaimName: "sub",
    })
      .then((data) => {
        const addressSeed: string = genAddressSeed(
          BigInt(userSalt!),
          "sub",
          idToken.sub,
          idToken.aud
        ).toString();
        console.log("Proof data", data);
        //         const signature = getZkLoginSignature({
        //   inputs:[
        //     ...partialZkLoginSignature,
        //     addressSeed
        //   ]
        //         });
        // console.log("Signature", signature);
        // Now you can send the signature to the server to verify the user
      })
      .catch((err) => {
        console.error(err);
      });

    // Redirect or perform actions as needed
  }, []);

  return <div>Processing OAuth callback...</div>;
};

export default OAuthCallbackPage;
