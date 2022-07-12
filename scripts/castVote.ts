import { ethers } from "ethers";
import "dotenv/config";
import * as BallotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";

  if (process.argv.length < 2) {
    throw new Error("Specify Ballot Address");
  }
  const ballotAddress = ethers.utils.getAddress(process.argv[2]);
  if (process.argv.length < 3) {
    throw new Error("Specify Proposal");
  }
  const proposalToVote = process.argv[3];

  if (process.argv.length < 4) {
    throw new Error("Specify Vote Amount");
  }
  const voteAmount = process.argv[4];

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

  const ballotContract = new ethers.Contract(
    ballotAddress,
    BallotJson.abi,
    signer
  );

  console.log("Ballot contract: %s", ballotContract.address);
  
  const votingPower = await ballotContract.votingPower(); 
  console.log(`You have ${votingPower} Voting Power.`);
  console.log(`Casting ${voteAmount} votes to proposal ${proposalToVote}`);
  const tx = await ballotContract.vote(proposalToVote, voteAmount, {gasLimit: 10000000,});
  console.log("Awaiting confirmations");
  await tx.wait();
  console.log(`Voted! Transaction completed. Hash: ${tx.hash}`);
}

main().catch((error) => {
  console.log(error);
});