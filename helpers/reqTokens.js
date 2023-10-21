import { getFaucetHost, requestSuiFromFaucetV0 } from "@mysten/sui.js/faucet";

export default async function reqTokens() {
	await requestSuiFromFaucetV0({
		host: getFaucetHost("testnet"),
		recipient:
			"0xcc2bd176a478baea9a0de7a24cd927661cc6e860d5bacecb9a138ef20dbab231",
	});
}
