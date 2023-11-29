import { run } from "hardhat";

async function main() {
    await run("verify:verify", {
        address: "0xd5E9AE102A3dD23f7723D93E75dd03D59d5C28Dc",
        constructorArguments: ["StartupLounge1"]
      })
      .then(() => {
        console.log(`Well done`);
      })
      .catch((err) => {
        console.error(err);
      });
}

main();