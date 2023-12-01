import "dotenv/config";
import fs from "fs";
import { ethers } from "hardhat";
const fsPromises = fs.promises;

// The path to the contract ABI
const ABI_FILE_PATH = 'artifacts/contracts/NtReservation.sol/NtReservation.json';
// The address from the deployed smart contract
const DEPLOYED_CONTRACT_ADDRESS = '0xaFe59e93DA9967089995656f8756f96F19734fe5';

// load ABI from build artifacts
async function getAbi() {
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

    let tx = await new_contract.reserveRoom(2023, 12, 1, 20, 2, "0xC09736e7f1DcB6e430905b131Fe3A80845290C57");
    await tx.wait();

    // let tx = await new_contract.code();
    // await tx.wait();
    return console.log(tx);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });