import { ethers } from "hardhat";
import * as MyTokenJson from "../artifacts/contracts/Token.sol/MyToken.json";

const VOTERS = [
  ethers.utils.getAddress("0x2153963d32B8Add74e8196aDe07F0A7720aaFF2E"),
  ethers.utils.getAddress("0x5d1b87c68D88a65A79b6D311a18eb743a5fE6C7C"),
];

const DEFAULT_TOKEN_SUPPLY = 10;
const TOKEN_ADDRESS = ethers.utils.getAddress(
  "0xE44d3BADa3A46E9b8A4CCb08C445E8238D770c7C"
);

function convertToNumber(bn: any) {
  return Number(ethers.utils.formatEther(bn.toString()));
}

async function main() {
  const deployerWallet =
    process.env.MNEMONIC && process.env.MNEMONIC.length > 0
      ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
      : new ethers.Wallet(process.env.PRIVATE_KEY!);

  console.log(`Wallet connected to address: ${deployerWallet.address}`);

  const provider = ethers.providers.getDefaultProvider("ropsten");
  const signer = deployerWallet.connect(provider);

  const tokenContract = new ethers.Contract(
    TOKEN_ADDRESS,
    MyTokenJson.abi,
    signer
  );


  console.log("Token address: %s", tokenContract.address);

  console.log("Voter 0: %s, Voter 1: %s", VOTERS[0], VOTERS[1]);

  console.log(
    "Initial total supply of tokens is %s",
    convertToNumber(await tokenContract.totalSupply())
  );

  let delegateTx = await tokenContract.delegate(VOTERS[0]);
  await delegateTx.wait();

  console.log(
    "Initial voting power for address %s is %s",
    VOTERS[0],
    convertToNumber(await tokenContract.getVotes(VOTERS[0]))
  );

  let mintTx = await tokenContract.mint(
    VOTERS[0],
    ethers.utils.parseEther(DEFAULT_TOKEN_SUPPLY.toFixed(18))
  );
  await mintTx.wait();

  console.log("New total supply of tokens is %s", convertToNumber(await tokenContract.totalSupply()));

  console.log(
    "New token balance for address %s is %s",
    VOTERS[0],
    convertToNumber(await tokenContract.balanceOf(VOTERS[0]))
  );

  delegateTx = await tokenContract.delegate(VOTERS[0]);
  await delegateTx.wait();

  console.log(
    "New voting power for address %s is %s",
    VOTERS[0],
    convertToNumber(await tokenContract.getVotes(VOTERS[0]))
  );

  let historicVotes = await tokenContract.getPastVotes(VOTERS[0], 1);
  console.log("Historic votes for address %s at block 1 is %s", VOTERS[0], convertToNumber(historicVotes));
}

main().catch((error) => {
  console.log(error);
});
