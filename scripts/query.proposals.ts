import { ethers } from "hardhat";
import * as BallotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";

const PROPOSALS_LENGTH = 4;

const BALLOT_ADDRESS = ethers.utils.getAddress(
  "0x024E2157a8dfF9749E73Ccf9637e65e2Ebc26CB3"
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

  const ballotContract = new ethers.Contract(
    BALLOT_ADDRESS,
    BallotJson.abi,
    signer
  );

  console.log("Ballot contract: %s", ballotContract.address);

  for (let i = 0; i < PROPOSALS_LENGTH; i++) {
    let proposal = await ballotContract.proposals(i);
    console.log(
      "Proposal #%s, name: %s, vote count: %s",
      i,
      ethers.utils.parseBytes32String(proposal.name),
      convertToNumber(proposal.voteCount)
    );
  }

  console.log(
    "Winner name: %s",
    ethers.utils.parseBytes32String(await ballotContract.winnerName())
  );
}

main().catch((error) => {
  console.log(error);
});