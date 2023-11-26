import { run } from "hardhat";

async function main() {
    await run("verify:verify", {
        address: "0x5CE1cafdD298F2499030082223D55Aa0BBa50fe3",
        constructorArguments: ["TestRoom1"]
    })
    .then((res) => {
        console.log(`Well done ${res}`);
    })
    .catch((err) => {
        console.error(err);
    })
}

main();