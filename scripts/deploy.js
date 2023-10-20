
const hre = require("hardhat");

async function main() {

  const Superstream = await hre.ethers.getContractFactory("Superstream");
  const contract = await Superstream.deploy();
  await contract.deployed();
  console.log("Contract deployed to : " + contract.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
