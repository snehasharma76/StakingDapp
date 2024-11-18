import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import StakingPlatform from './contracts/StakingPlatform.json';
import StakingToken from './contracts/StakingToken.json';
import StakeForm from './components/StakeForm';
import StakeInfo from './components/StakeInfo';
import ConnectWallet from './components/ConnectWallet';

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState('');
  const [stakingContract, setStakingContract] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [stakeInfo, setStakeInfo] = useState({
    stakedAmount: '0',
    stakingTime: '0',
    pendingRewards: '0'
  });
  const [tokenBalance, setTokenBalance] = useState('0');

  const connectWallet = async () => {
    try {
      const web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions: {}
      });
      
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const account = await signer.getAddress();

      setProvider(provider);
      setSigner(signer);
      setAccount(account);

      // Initialize contracts
      const stakingContract = new ethers.Contract(
        process.env.REACT_APP_STAKING_CONTRACT_ADDRESS,
        StakingPlatform.abi,
        signer
      );
      const tokenContract = new ethers.Contract(
        process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS,
        StakingToken.abi,
        signer
      );

      setStakingContract(stakingContract);
      setTokenContract(tokenContract);

      // Load initial data
      await updateStakeInfo(stakingContract, account);
      await updateTokenBalance(tokenContract, account);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const updateStakeInfo = async (contract, account) => {
    try {
      const info = await contract.getStakeInfo(account);
      setStakeInfo({
        stakedAmount: ethers.utils.formatEther(info.stakedAmount),
        stakingTime: info.stakingTime.toString(),
        pendingRewards: ethers.utils.formatEther(info.pendingRewards)
      });
    } catch (error) {
      console.error("Error updating stake info:", error);
    }
  };

  const updateTokenBalance = async (contract, account) => {
    try {
      const balance = await contract.balanceOf(account);
      setTokenBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error("Error updating token balance:", error);
    }
  };

  useEffect(() => {
    if (stakingContract && account) {
      const interval = setInterval(() => {
        updateStakeInfo(stakingContract, account);
        updateTokenBalance(tokenContract, account);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [stakingContract, tokenContract, account]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Staking Platform
        </Typography>
        
        {!account ? (
          <ConnectWallet onConnect={connectWallet} />
        ) : (
          <>
            <StakeInfo 
              stakeInfo={stakeInfo} 
              tokenBalance={tokenBalance} 
              account={account} 
            />
            <StakeForm 
              stakingContract={stakingContract}
              tokenContract={tokenContract}
              onStakeComplete={() => {
                updateStakeInfo(stakingContract, account);
                updateTokenBalance(tokenContract, account);
              }}
            />
          </>
        )}
      </Box>
    </Container>
  );
}

export default App;
