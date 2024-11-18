# Solidity Staking Platform

A decentralized staking platform built with Solidity, Hardhat, and React.

## Features

- Token staking with minimum amount requirement (100 tokens)
- 10% Annual Percentage Rate (APR) rewards
- Real-time reward calculation
- User-friendly React frontend
- MetaMask integration
- Secure smart contract implementation

## Tech Stack

- Solidity ^0.8.19
- Hardhat
- React
- Ethers.js
- Web3Modal
- Material-UI

## Smart Contracts

- `StakingPlatform.sol`: Main staking contract with reward distribution
- `StakingToken.sol`: ERC20 token for staking

## Prerequisites

- Node.js >= 14
- MetaMask wallet
- Git

## Installation

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

3. Create a .env file in the frontend directory:
```
REACT_APP_STAKING_CONTRACT_ADDRESS=your_contract_address
REACT_APP_TOKEN_CONTRACT_ADDRESS=your_token_address
```

## Development

1. Start local Hardhat node:
```bash
npx hardhat node
```

2. Deploy contracts:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

3. Start frontend:
```bash
cd frontend
npm start
```

## Testing

```bash
# Run contract tests
npx hardhat test
```

## MetaMask Configuration

1. Network Name: Localhost 8545
2. RPC URL: http://127.0.0.1:8545
3. Chain ID: 1337
4. Currency Symbol: ETH

## Security

- ReentrancyGuard implementation
- Ownable pattern for admin functions
- Safe math operations through Solidity 0.8
- Comprehensive input validation

## License

MIT
