import { EventLog } from "ethers";
import fs from "fs";
import { ethers } from "hardhat";

const fsPromises = fs.promises;

// The path to the contract ABI
const ABI_FILE_PATH = 'artifacts/contracts/NtReservation.sol/NtReservation.json';

// load ABI from build artifacts
const getAbi = async () => {
  const data = await fsPromises.readFile(ABI_FILE_PATH, 'utf8');
  const abi = JSON.parse(data)['abi'];
  //console.log(abi);
  return abi;
}



const reserve = async (
    contractID: string, 
    year: number, 
    month: number, 
    day: number, 
    hour: number,
    period: number
    ) => {
    const provider = new ethers.BrowserProvider(window.ethereum, "sepolia");
    const abi = await getAbi();

    // WRITE operations require a signer
    let signer = await provider.getSigner();
    const reservationContract = new ethers.Contract(contractID, abi, signer);

    let reservation = await reservationContract.reserveRoom(year, month, day, hour, period, await signer.getAddress());
    await reservation.wait();
    return reservation;
}

const getName = async (contractID: string) => {
    const provider = new ethers.BrowserProvider(window.ethereum, "sepolia");
    const abi = await getAbi();

    // WRITE operations require a signer
    let signer = await provider.getSigner();
    const reservationContract = new ethers.Contract(contractID, abi, signer);

    const name: string = await reservationContract.code();
    return name;
}

const checkReservation = async (contractID: string) => {
    const provider = new ethers.BrowserProvider(window.ethereum, "sepolia");
    const abi = await getAbi();

    // WRITE operations require a signer
    let signer = await provider.getSigner();
    const reservationContract = new ethers.Contract(contractID, abi, signer);

    const eventName = "roomReserved";
    const filter = reservationContract.filters[eventName](); // 이벤트 필터 생성

    const blockNumber = await provider.getBlockNumber(); // 현재 블록 번호
    const startBlock = blockNumber - 1000; // 시작 블록 번호 (현재 블록 기준으로 최근 1000개 블록 검색)

    // 과거 블록 범위에서 이벤트 검색
    const reservations = await reservationContract.queryFilter(filter, startBlock);

    return reservations.map((r) => {
        return r.topics[1]
    });
}