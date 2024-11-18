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
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
