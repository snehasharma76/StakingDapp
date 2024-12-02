async function main() {
  // Deploy StakingToken first
  const StakingToken = await ethers.getContractFactory("StakingToken");
  const stakingToken = await StakingToken.deploy();
  await stakingToken.deployed();
  console.log("StakingToken deployed to:", stakingToken.address);

  // Deploy StakingPlatform with StakingToken address
  const StakingPlatform = await ethers.getContractFactory("StakingPlatform");
  const stakingPlatform = await StakingPlatform.deploy(stakingToken.address);
  await stakingPlatform.deployed();
  console.log("StakingPlatform deployed to:", stakingPlatform.address);

  // Deploy TokenFaucet
  const amountPerRequest = ethers.utils.parseEther("100"); // 100 tokens per request
  const lockTime = 24 * 60 * 60; // 24 hours in seconds
  
  const TokenFaucet = await ethers.getContractFactory("TokenFaucet");
  const tokenFaucet = await TokenFaucet.deploy(stakingToken.address, amountPerRequest, lockTime);
  await tokenFaucet.deployed();
  console.log("TokenFaucet deployed to:", tokenFaucet.address);

  // Fund the faucet with some initial tokens (1000 tokens)
  const initialFaucetAmount = ethers.utils.parseEther("1000");
  await stakingToken.transfer(tokenFaucet.address, initialFaucetAmount);
  console.log("Funded faucet with", ethers.utils.formatEther(initialFaucetAmount), "tokens");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
