const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Superstream",function(){
  let superstream;

  before(async function () {
    const Superstream = await ethers.getContractFactory("Superstream");
    superstream = await Superstream.deploy();
    await superstream.deployed();
    console.log(` 🚀 Superstream contract deployed to : ${superstream.address} `);
  })
  
  it("Should create a new user",async function () {
    let username = "FunkyDegen";
    let about = "A funky degen who loves spending time in metaverse.";
    let tx = await superstream.createUser(username,about);
    await tx.wait();
    expect(tx.confirmations).to.equal(1,"Transaction not confirmed!!");
    let user = await superstream.getUserByUsername(username);
    expect(user.username).to.equal(username,"Username Mismatch");
    let allusers = await superstream.getAllUsers();
    expect(allusers.length).to.equals(1);
  });

  

}); 