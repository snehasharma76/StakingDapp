// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract TokenFaucet is Ownable, ReentrancyGuard {
    IERC20 public token;
    uint256 public amountPerRequest;
    uint256 public lockTime;
    mapping(address => uint256) public lastRequestTime;

    event TokensDispensed(address indexed recipient, uint256 amount);

    constructor(
        address _token,
        uint256 _amountPerRequest,
        uint256 _lockTime
    ) {
        token = IERC20(_token);
        amountPerRequest = _amountPerRequest;
        lockTime = _lockTime;
    }

    function requestTokens() external nonReentrant {
        require(
            block.timestamp >= lastRequestTime[msg.sender] + lockTime,
            "Please wait before requesting again"
        );
        require(
            token.balanceOf(address(this)) >= amountPerRequest,
            "Insufficient tokens in faucet"
        );

        lastRequestTime[msg.sender] = block.timestamp;
        require(token.transfer(msg.sender, amountPerRequest), "Transfer failed");

        emit TokensDispensed(msg.sender, amountPerRequest);
    }

    function setAmountPerRequest(uint256 _amount) external onlyOwner {
        amountPerRequest = _amount;
    }

    function setLockTime(uint256 _lockTime) external onlyOwner {
        lockTime = _lockTime;
    }

    // Allow the owner to withdraw tokens if needed
    function withdrawTokens(uint256 _amount) external onlyOwner {
        require(token.transfer(owner(), _amount), "Transfer failed");
    }
}
