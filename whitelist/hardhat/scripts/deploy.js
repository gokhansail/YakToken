const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });
require("@nomiclabs/hardhat-etherscan");

async function main() {

  const whitelistContract = await ethers.getContractFactory("Whitelist");

  const deployedWhitelistContract = await whitelistContract.deploy();
  
  await deployedWhitelistContract.deployed();

  console.log(
    "Kontrat şu adres ile deploy edildi:",
    deployedWhitelistContract.address
  );

  await sleep(10000);

  await hre.run("verify:verify", {
    address: deployedWhitelistContract.address,
    constructorArguments: [],
  });
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });