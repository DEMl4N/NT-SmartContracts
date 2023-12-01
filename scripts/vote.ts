import "dotenv/config";
import fs from "fs";
import { ethers } from "hardhat";
import { generateCommitment, calculateMerkleRootAndZKProof } from "zk-merkle-tree";
const fsPromises = fs.promises;

// The path to the contract ABI
const ABI_FILE_PATH = 'artifacts/contracts/NtZkVote.sol/NtZkVote.json';
// The address from the deployed smart contract
const DEPLOYED_CONTRACT_ADDRESS = '0x9E1430cEA7D1E8f0986a5F067085F8eede80EB40';

// load ABI from build artifacts
const getAbi = async () => {
  const data = await fsPromises.readFile(ABI_FILE_PATH, 'utf8');
  const abi = JSON.parse(data)['abi'];
  //console.log(abi);
  return abi;
}

async function main() {
    let provider = ethers.getDefaultProvider(process.env.RPC_SEPOLIA as string);
    const abi = await getAbi();

    /* 
    // READ-only operations require only a provider.
    // Providers allow only for read operations.
    let contract = new ethers.Contract(DEPLOYED_CONTRACT_ADDRESS, abi, provider);
    const greeting = await contract.greet();
    console.log(greeting);
    */

    // WRITE operations require a signer
    const PRIVATE_KEY = process.env.PRIVATE_KEY as string;
    let signer = new ethers.Wallet(PRIVATE_KEY, provider);
    const new_contract = new ethers.Contract(DEPLOYED_CONTRACT_ADDRESS, abi, signer);
    const commitment = await generateCommitment();

    let tx1 = await new_contract.setBeginning(2023, 11, 30, 14);
    await tx1.wait();
    console.log(tx1);

    let tx2 = await new_contract.setDeadline(2023, 12, 30, 14);
    await tx2.wait();
    console.log(tx2);

    let rc1 = await new_contract.registerCandidate("Naka Chano", "Greatest of all time");
    await rc1.wait();
    console.log(rc1);

    let rc2 = await new_contract.registerCandidate("DGood", "Going glamping");
    await rc2.wait();
    console.log(rc2);

    let rc3 = await new_contract.registerCandidate("ysowan", "Hakim Ziyech");
    await rc3.wait();
    console.log(rc3);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });