const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Staking Platform", function () {
  let StakingToken;
  let stakingToken;
  let StakingPlatform;
  let stakingPlatform;
  let owner;
  let addr1;
  let addr2;
  
  // Helper function to move time forward
  async function moveTime(seconds) {
    await network.provider.send("evm_increaseTime", [seconds]);
    await network.provider.send("evm_mine");
  }

  beforeEach(async function () {
    // Get test accounts
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy StakingToken
    StakingToken = await ethers.getContractFactory("StakingToken");
    stakingToken = await StakingToken.deploy();
    await stakingToken.deployed();

    // Deploy StakingPlatform
    StakingPlatform = await ethers.getContractFactory("StakingPlatform");
    stakingPlatform = await StakingPlatform.deploy(stakingToken.address);
    await stakingPlatform.deployed();

    // Transfer tokens to test accounts and staking platform
    await stakingToken.transfer(addr1.address, ethers.utils.parseEther("1000"));
    await stakingToken.transfer(addr2.address, ethers.utils.parseEther("1000"));
    
    // Add rewards to the staking platform
    await stakingToken.approve(stakingPlatform.address, ethers.utils.parseEther("10000"));
    await stakingPlatform.addRewards(ethers.utils.parseEther("1000")); // Add 1000 tokens as rewards
  });

  describe("Deployment", function () {
    it("Should set the right token address", async function () {
      expect(await stakingPlatform.stakingToken()).to.equal(stakingToken.address);
    });

    it("Should set the right owner", async function () {
      expect(await stakingPlatform.owner()).to.equal(owner.address);
    });
  });

  describe("Staking", function () {
    beforeEach(async function () {
      // Approve staking platform to spend tokens
      await stakingToken.connect(addr1).approve(stakingPlatform.address, ethers.utils.parseEther("1000"));
    });

    it("Should allow staking above minimum amount", async function () {
      const stakeAmount = ethers.utils.parseEther("100");
      await expect(stakingPlatform.connect(addr1).stake(stakeAmount))
        .to.emit(stakingPlatform, "Staked")
        .withArgs(addr1.address, stakeAmount);

      const stake = await stakingPlatform.stakes(addr1.address);
      expect(stake.amount).to.equal(stakeAmount);
    });

    it("Should reject staking below minimum amount", async function () {
      const stakeAmount = ethers.utils.parseEther("50");
      await expect(
        stakingPlatform.connect(addr1).stake(stakeAmount)
      ).to.be.revertedWith("Amount below minimum staking amount");
    });
  });

  describe("Rewards", function () {
    beforeEach(async function () {
      await stakingToken.connect(addr1).approve(stakingPlatform.address, ethers.utils.parseEther("1000"));
      await stakingPlatform.connect(addr1).stake(ethers.utils.parseEther("100"));
    });

    it("Should calculate rewards correctly", async function () {
      // Move time forward by 365 days
      await moveTime(365 * 24 * 60 * 60);

      const reward = await stakingPlatform.calculateReward(addr1.address);
      // Expected reward should be 10% of staked amount after 1 year
      expect(reward).to.be.closeTo(
        ethers.utils.parseEther("10"), // 10% of 100 tokens
        ethers.utils.parseEther("0.1") // Allow for small rounding differences
      );
    });

    it("Should track total rewards distributed", async function () {
      await moveTime(365 * 24 * 60 * 60);
      await stakingPlatform.connect(addr1).withdraw(ethers.utils.parseEther("100"));
      
      expect(await stakingPlatform.totalRewardsDistributed()).to.be.closeTo(
        ethers.utils.parseEther("10"),
        ethers.utils.parseEther("0.1")
      );
    });
  });

  describe("Withdrawals", function () {
    beforeEach(async function () {
      await stakingToken.connect(addr1).approve(stakingPlatform.address, ethers.utils.parseEther("1000"));
      await stakingPlatform.connect(addr1).stake(ethers.utils.parseEther("100"));
    });

    it("Should allow full withdrawal with rewards", async function () {
      // Move time forward by 365 days
      await moveTime(365 * 24 * 60 * 60);

      const initialBalance = await stakingToken.balanceOf(addr1.address);
      await stakingPlatform.connect(addr1).withdraw(ethers.utils.parseEther("100"));
      const finalBalance = await stakingToken.balanceOf(addr1.address);

      // Should receive original stake plus ~10% reward
      expect(finalBalance.sub(initialBalance)).to.be.closeTo(
        ethers.utils.parseEther("110"),
        ethers.utils.parseEther("0.1")
      );
    });

    it("Should prevent withdrawal of more than staked amount", async function () {
      await expect(
        stakingPlatform.connect(addr1).withdraw(ethers.utils.parseEther("200"))
      ).to.be.revertedWith("Insufficient staked amount");
    });

    it("Should fail if contract has insufficient balance", async function () {
      // Deploy new instance without rewards
      const newStakingPlatform = await StakingPlatform.deploy(stakingToken.address);
      await stakingToken.connect(addr1).approve(newStakingPlatform.address, ethers.utils.parseEther("1000"));
      await newStakingPlatform.connect(addr1).stake(ethers.utils.parseEther("100"));
      
      await moveTime(365 * 24 * 60 * 60);
      
      await expect(
        newStakingPlatform.connect(addr1).withdraw(ethers.utils.parseEther("100"))
      ).to.be.revertedWith("Insufficient contract balance");
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to change minimum staking amount", async function () {
      const newMinimum = ethers.utils.parseEther("200");
      await stakingPlatform.connect(owner).setMinimumStakingAmount(newMinimum);
      expect(await stakingPlatform.minimumStakingAmount()).to.equal(newMinimum);
    });

    it("Should allow owner to change reward rate", async function () {
      const newRate = 20; // 20% APR
      await stakingPlatform.connect(owner).setRewardRate(newRate);
      expect(await stakingPlatform.rewardRate()).to.equal(newRate);
    });

    it("Should prevent non-owner from changing parameters", async function () {
      await expect(
        stakingPlatform.connect(addr1).setRewardRate(20)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
