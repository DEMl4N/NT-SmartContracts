import { run } from "hardhat";

async function main() {
    await run("verify:verify", {
        address: "0x6983ACCAF7D0dC8e3d0856acA8395fc96Bf976A4",
        constructorArguments: ["StartupLounge3"]
      })
      .then(() => {
        console.log(`Well done`);
      })
      .catch((err) => {
        console.error(err);
      });
}

main();