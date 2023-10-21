import { generateNonce, generateRandomness } from "@mysten/zklogin";
import { SuiClient } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { jwtToAddress } from "@mysten/zklogin";

const REDIRECT_URI = "https://10af-110-224-90-133.ngrok-free.app/callback";

const FULLNODE_URL = "https://fullnode.devnet.sui.io"; // replace with the RPC URL you want to use

export default async function zklogin() {
  const suiClient = new SuiClient({ url: FULLNODE_URL });
  const { epoch, epochDurationMs, epochStartTimestampMs } =
    await suiClient.getLatestSuiSystemState();

  const maxEpoch = Number(epoch) + 2; // this means the ephemeral key will be active for 2 epochs from now.
  const ephemeralKeyPair = new Ed25519Keypair();
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

zklogin().catch((error) => {
  console.error(error);
});
