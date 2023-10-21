import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { TransactionBlock } from "@mysten/sui.js/transactions";

export default async function contractCall(hash) {
	// Generate a new Ed25519 Keypair

	async function addGlobalUrl() {
		const keypair = new Ed25519Keypair();
		const client = new SuiClient({
			url: getFullnodeUrl("devnet"),
		});
		const packageObjectId = "0x...";
		const tx = new TransactionBlock();
		tx.moveCall({
			target: `${packageObjectId}::addUrl`,
			arguments: [tx.pure.string(`${hash}`)],
		});
		const result = await client.signAndExecuteTransactionBlock({
			signer: keypair,
			transactionBlock: tx,
		});
		console.log({ result });
	}

	async function addLocalUrl() {
		const keypair = new Ed25519Keypair();
		const client = new SuiClient({
			url: getFullnodeUrl("devnet"),
		});
		const packageObjectId = "0x...";
		const tx = new TransactionBlock();
		tx.moveCall({
			target: `${packageObjectId}::addUrlToUser`,
			arguments: [tx.pure.string(`${hash}`)],
		});
		const result = await client.signAndExecuteTransactionBlock({
			signer: keypair,
			transactionBlock: tx,
		});
		console.log({ result });
	}
}
