// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StakingPlatform is ReentrancyGuard, Ownable {
    IERC20 public stakingToken;
    
    // Staking settings
    uint256 public minimumStakingAmount = 100 * 10**18; // 100 tokens minimum
    uint256 public rewardRate = 10; // 10% APR
    uint256 public totalRewardsDistributed;
    
    struct Stake {
        uint256 amount;
        uint256 timestamp;
        uint256 lastRewardCalculation;
    }
    
    mapping(address => Stake) public stakes;
    uint256 public totalStaked;
    
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event RewardsAdded(uint256 amount);
    
    constructor(address _stakingToken) {
        stakingToken = IERC20(_stakingToken);
    }

    // Function to add rewards to the contract
    function addRewards(uint256 _amount) external {
        require(stakingToken.transferFrom(msg.sender, address(this), _amount), "Transfer failed");
        emit RewardsAdded(_amount);
    }
    
    function stake(uint256 _amount) external nonReentrant {
        require(_amount >= minimumStakingAmount, "Amount below minimum staking amount");
        require(stakingToken.transferFrom(msg.sender, address(this), _amount), "Transfer failed");
        
        if (stakes[msg.sender].amount > 0) {
            // Calculate and add pending rewards to stake
            uint256 reward = calculateReward(msg.sender);
            stakes[msg.sender].amount += reward;
        }
        
        stakes[msg.sender].amount += _amount;
        stakes[msg.sender].timestamp = block.timestamp;
        stakes[msg.sender].lastRewardCalculation = block.timestamp;
        totalStaked += _amount;
        
        emit Staked(msg.sender, _amount);
    }
    
    function withdraw(uint256 _amount) external nonReentrant {
        require(stakes[msg.sender].amount >= _amount, "Insufficient staked amount");
        
        // Calculate rewards before withdrawal
        uint256 reward = calculateReward(msg.sender);
        uint256 totalAmount = _amount + reward;
        
        // Update state before transfer
        stakes[msg.sender].amount -= _amount;
        totalStaked -= _amount;
        stakes[msg.sender].lastRewardCalculation = block.timestamp;
        totalRewardsDistributed += reward;
        
        // Ensure contract has enough balance
        require(stakingToken.balanceOf(address(this)) >= totalAmount, "Insufficient contract balance");
        require(stakingToken.transfer(msg.sender, totalAmount), "Transfer failed");
        
        emit Withdrawn(msg.sender, _amount);
        if (reward > 0) {
            emit RewardPaid(msg.sender, reward);
        }
    }
    
    function calculateReward(address _staker) public view returns (uint256) {
        if (stakes[_staker].amount == 0) return 0;
        
        uint256 stakingDuration = block.timestamp - stakes[_staker].lastRewardCalculation;
        uint256 reward = (stakes[_staker].amount * rewardRate * stakingDuration) / (365 days * 100);
        
        return reward;
    }
    
    function getStakeInfo(address _staker) external view returns (
        uint256 stakedAmount,
        uint256 stakingTime,
        uint256 pendingRewards
    ) {
        Stake memory stake = stakes[_staker];
        return (
            stake.amount,
            stake.timestamp,
            calculateReward(_staker)
        );
    }
    
    // Admin functions
    function setMinimumStakingAmount(uint256 _amount) external onlyOwner {
        minimumStakingAmount = _amount;
    }
    
    function setRewardRate(uint256 _rate) external onlyOwner {
        rewardRate = _rate;
    }
}
