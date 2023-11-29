import { ethers } from "hardhat";
import fs from 'fs';
import { mimcSpongecontract } from "circomlibjs";
import "dotenv/config"

const SEED = "mimcsponge";
const TREE_LEVELS = 20;
const NUMBER_OF_OPTIONS = 4;

async function main() {
  // const signers = await ethers.getSigners()
  const { PRIVATE_KEY } = process.env;
  let provider = ethers.getDefaultProvider(process.env.RPC_SEPOLIA as string);
  let signer = new ethers.Wallet(PRIVATE_KEY as string, provider);

  const MiMCSponge = new ethers.ContractFactory(mimcSpongecontract.abi, mimcSpongecontract.createCode(SEED, 220), signer);
  const mimcsponge = await MiMCSponge.deploy();
  console.log(`MiMC sponge hasher address: ${mimcsponge.target}`);

  const verifier = await ethers.deployContract("Verifier");
  await verifier.waitForDeployment();
  console.log(`Verifier address: ${verifier.target}`);

  const ntzkVote = await ethers.deployContract("NtZkVote", [TREE_LEVELS, mimcsponge.target, verifier.target, NUMBER_OF_OPTIONS]);
  await ntzkVote.waitForDeployment();
  console.log(`ntzkVote address: ${ntzkVote.target}`);

  console.log("Let's go, come on!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});