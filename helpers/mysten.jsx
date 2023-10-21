import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";

export default async function mysten() {
	// create a client connected to devnet
	const client = new SuiClient({ url: getFullnodeUrl("devnet") });

	// get coins owned by an address
	await client.getCoins({
		owner: "0xcc2bd176a478baea9a0de7a24cd927661cc6e860d5bacecb9a138ef20dbab231",
	});
}
