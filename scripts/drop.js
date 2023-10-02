const hre = require("hardhat");

const TOKEN_CONTRACT_ADDRESS = "0x..."; // TODO: SET YOU DEPLOYED TOKEN CONTRACT ADDRESS
const WINNER_CONTRACT_ADDRESS = "0x873289a1aD6Cf024B927bd13bd183B264d274c68";
const CONTRACT_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "address", name: "", type: "address" },
    ],
    name: "Winner",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "erc20", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "drop",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

async function main() {
  const tokenContract = await hre.ethers.getContractAt(
    "PiedPiper",
    TOKEN_CONTRACT_ADDRESS
  );

  const wallet = new hre.ethers.Wallet(
    process.env.ACCOUNT_PRIVATE_KEY,
    hre.ethers.provider
  );

  const contractWinner = new hre.ethers.Contract(
    WINNER_CONTRACT_ADDRESS,
    CONTRACT_ABI,
    wallet
  );

  const amount = BigInt(1 * 10 ** 17);
  const approveTx = await tokenContract.approve(
    WINNER_CONTRACT_ADDRESS,
    amount
  );
  await approveTx.wait();
  console.log("Approve transaction hash: ", approveTx.hash);

  const dropTx = await contractWinner.drop(TOKEN_CONTRACT_ADDRESS, amount);
  await dropTx.wait();
  console.log("Drop transaction hash: ", dropTx.hash);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
