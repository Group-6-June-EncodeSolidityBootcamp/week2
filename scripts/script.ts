import { ethers } from "hardhat";
import * as MyTokenJson from "../artifacts/contracts/Token.sol/MyToken.json";
import * as BallotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";

const PROPOSALS = ["1", "2", "3", "4"];

const VOTERS = [
    "",
    ""
];

const DEFAULT_TOKEN_SUPPLY = 10;
const TOKEN_ADDRESS = "0xE44d3BADa3A46E9b8A4CCb08C445E8238D770c7C";
const BALLOT_ADDRESS = "0x024E2157a8dfF9749E73Ccf9637e65e2Ebc26CB3";

function convertToNumber(bn: any) {
  return Number(ethers.utils.parseEther(bn.toString()));
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

  const ballotContract = new ethers.Contract(
    BALLOT_ADDRESS,
    BallotJson.abi,
    signer
  );

  console.log(
    "Total supply of tokens is %s",
    await tokenContract.totalSupply()
  );

  let delegateTx = await tokenContract.delegate(VOTERS[0]);
  await delegateTx.wait();

  console.log(
    "Voting power for address %s is %s",
    VOTERS[0],
    convertToNumber(await tokenContract.getVotes(VOTERS[0]))
  );

  let mintTx = await tokenContract.mint(
    VOTERS[0],
    ethers.utils.parseEther(DEFAULT_TOKEN_SUPPLY.toFixed(18))
  );
  await mintTx.wait();

  delegateTx = await tokenContract.delegate(VOTERS[0]);
  await delegateTx.wait();


  console.log(
      "New voting power for address %s is %s",
      VOTERS[0],
      convertToNumber(await tokenContract.getVotes(VOTERS[0]))
  );
}

main().catch((error) => {
  console.log(error);
});
