# Solidity Staking Platform

A festive Christmas-themed decentralized staking platform built with Solidity, Hardhat, and React. This platform allows users to stake tokens and earn rewards with an engaging holiday-themed UI.

## Features

- Token staking with minimum amount requirement (100 tokens)
- 10% Annual Percentage Rate (APR) rewards
- Real-time reward calculation
- Festive Christmas-themed UI with animations
- Interactive staking interface with custom slider
- MetaMask integration
- Secure smart contract implementation

## Tech Stack

- Solidity ^0.8.19
- Hardhat
- React 18
- Ethers.js
- Web3Modal
- Tailwind CSS
- Christmas-themed UI components

## Smart Contracts

- `StakingPlatform.sol`: Main staking contract with reward distribution
- `Token.sol`: ERC20 token for staking

## Prerequisites

- Node.js >= 14
- MetaMask wallet
- Git

## Step-by-Step Testing Guide

### 1. Local Development Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd solidity-staking-platform
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
```

3. Create a `.env` file in the frontend directory:
```
REACT_APP_STAKING_CONTRACT_ADDRESS=your_contract_address
REACT_APP_TOKEN_CONTRACT_ADDRESS=your_token_address
```

### 2. Start Local Blockchain

1. Open a terminal and start the local Hardhat node:
```bash
npx hardhat node
```
Keep this terminal running.

2. In a new terminal, deploy the contracts:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

3. Copy the deployed contract addresses and update your `.env` file.

### 3. Configure MetaMask

1. Open MetaMask and add the local network:
   - Network Name: Localhost 8545
   - New RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - Currency Symbol: ETH

2. Import a test account:
   - Copy a private key from the Hardhat node terminal
   - In MetaMask, click "Import Account"
   - Paste the private key

### 4. Start the Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Start the development server:
```bash
npm start
```

3. Open http://localhost:3000 in your browser

### 5. Testing the Application

1. **Connect Wallet**
   - Click "Connect Wallet" button
   - Select MetaMask
   - Approve the connection

2. **Get Test Tokens**
   - The deployer account has initial tokens
   - Use the contract's transfer function to send tokens to test accounts

3. **Stake Tokens**
   - Enter the amount you want to stake
   - Use the slider or input field
   - Click "Stake Tokens"
   - Approve the transaction in MetaMask

4. **View Staked Amount**
   - Your staked amount will be displayed
   - Watch the UI update in real-time

5. **Withdraw Tokens**
   - Click "Unstake" to withdraw
   - Confirm the transaction in MetaMask
   - Check your token balance

### 6. Testing Contract Functions

Run the test suite:
```bash
npx hardhat test
```

This will run all contract tests, including:
- Deployment
- Staking functionality
- Reward calculations
- Withdrawal mechanisms

## Troubleshooting

1. **MetaMask Issues**
   - Reset your account if transactions are stuck
   - Network > Advanced > Reset Account

2. **Contract Interaction Errors**
   - Ensure you have enough ETH for gas
   - Check if you approved token spending
   - Verify contract addresses in .env

3. **Frontend Issues**
   - Clear browser cache
   - Reset MetaMask connection
   - Check console for errors

## Deployed Version

You can also test the deployed version at: [Your Vercel URL]
- Network: [Specify Network]
- Contract Addresses:
  - Staking: [Address]
  - Token: [Address]

## Security Notes

- All contract functions are tested and audited
- Frontend uses secure Web3 connection
- Real-time error handling and validation
- Safe math operations through Solidity 0.8

## License

MIT
