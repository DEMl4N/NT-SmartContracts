import fs from "fs";
import { ethers } from "hardhat";
import { generateCommitment, calculateMerkleRootAndZKProof } from "zk-merkle-tree";

const fsPromises = fs.promises;

// The path to the contract ABI
const ABI_FILE_PATH = 'artifacts/contracts/NtZkVote.sol/NtZkVote.json';
const NETWORK = 'sepolia';
const TREE_LEVELS = 20;

// load ABI from build artifacts
const getAbi = async () => {
  const data = await fsPromises.readFile(ABI_FILE_PATH, 'utf8');
  const abi = JSON.parse(data)['abi'];
  //console.log(abi);
  return abi;
}

const vote = async (contractID: string, option: number) => {
    const provider = new ethers.BrowserProvider(window.ethereum, NETWORK);
    const abi = await getAbi();
    await provider.send("eth_requestAccounts", []);
    let signer = await provider.getSigner();
    const voteContract = new ethers.Contract(contractID, abi, signer);

    const commitment = await generateCommitment();
    const cd = await calculateMerkleRootAndZKProof(
        contractID,
        signer,
        TREE_LEVELS,
        commitment,
        "verifier.zkey"
    );
    
    const voteTx = await voteContract.vote(
        option,
        cd.nullifierHash,
        cd.root,
        cd.proof_a,
        cd.proof_b,
        cd.proof_c
    );
    await voteTx.wait();
    return voteTx;
}

const info = async (contractID: string) => {
    const provider = new ethers.BrowserProvider(window.ethereum, NETWORK);
    const abi = await getAbi();
    await provider.send("eth_requestAccounts", []);
    let signer = await provider.getSigner();
    const voteContract = new ethers.Contract(contractID, abi, signer);

    return {
        period: await voteContract.votingPeriod(),
        candidates: await voteContract.candidates()
    }
}

exports = {
    vote,
    info
}