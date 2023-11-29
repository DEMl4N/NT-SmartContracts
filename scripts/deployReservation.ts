import { ethers } from "hardhat";
import { run } from "hardhat";

async function main() {
  const roomCode: string = "StartupLounge1";

  const ntReservation = await ethers.deployContract("NtReservation", [roomCode]);

  await ntReservation.waitForDeployment();

  console.log(
    `deployed to ${ntReservation.target}`
  );

  setTimeout(() => {
    
  }, 10000);
  
  await run("verify:verify", {
    address: ntReservation.target,
    constructorArguments: [roomCode]
  })
  .then(() => {
    console.log(`Well done`);
  })
  .catch((err) => {
    console.error(err);
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
