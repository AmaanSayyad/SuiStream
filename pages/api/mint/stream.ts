export default function mint(
  //@ts-ignore
  req: NextApiRequest,
  //@ts-ignore
  res: NextApiResponse
): Promise<any> {
  const rpcUrl = "https://rpc-mumbai.maticvigil.com";

  //@ts-ignore
  const privateKey = process.env.PRIVATE_KEY;

  if (!privateKey) {
    // Handle the case when PRIVATE_KEY is not available
    return res.status(400).json({ error: "PRIVATE_KEY is not available" });
  }
  //@ts-ignore
  const wallet = new ethers.Wallet(
    privateKey,
    //@ts-ignore
    ethers.getDefaultProvider(rpcUrl)
  );

  //@ts-ignore
  const streamNft = new ThirdwebSDK(wallet).getNFTCollection(
    //@ts-ignore
    STREAM_NFT_ADDRESS
  );

  return new Promise<void>((resolve) => {
    // get the wallet address that's sent from the request body,
    const { address, metadata } = req.body;
    streamNft
      .mintTo(address, metadata)
      .then((tx) => {
        res
          .status(200)
          .json({ receipt: tx.receipt, tokenId: tx.id, nft: tx.data });
        resolve();
      })
      .catch((err) => console.error(err));
  });
}
