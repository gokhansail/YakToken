const { ethers } = require("hardhat");

async function main() {

  const whitelistContract = await ethers.getContractFactory("whitelist");

  const deployedWhitelistContract = await whitelistContract.deploy();
  
  await deployedWhitelistContract.deployed();

  console.log(
    "Kontrat şu adres ile deploy edildi:",
    deployedWhitelistContract.address
  );
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });