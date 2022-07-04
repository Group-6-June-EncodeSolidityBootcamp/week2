import { ethers } from "ethers";
import "dotenv/config";
import * as BallotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";

const ballotAddress = ethers.utils.getAddress(process.argv[2]);

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

  let i = 0;
  while (true) {
    try {
      let proposal = await ballotContract.proposals(i);
      console.log(
        "Proposal #%s, name: %s, vote count: %s",
        i,
        ethers.utils.parseBytes32String(proposal.name),
        convertToNumber(proposal.voteCount)
      );
      i += 1;
    }
    catch (error) {
      //error when loop is complete
      break;
    }
  }

  console.log(
    "Winner name: %s",
    ethers.utils.parseBytes32String(await ballotContract.winnerName())
  );
}

main().catch((error) => {
  console.log(error);
});