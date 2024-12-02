import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Button } from "./ui/button";
import { CandyCane } from './ui/CandyCane';
import TokenFaucetABI from '../contracts/TokenFaucet.json';

export default function TokenFaucet({ signer, account }) {
  const [loading, setLoading] = useState(false);

  const requestTokens = async () => {
    try {
      setLoading(true);
      const faucetContract = new ethers.Contract(
        process.env.REACT_APP_FAUCET_CONTRACT_ADDRESS,
        TokenFaucetABI.abi,
        signer
      );
      const tx = await faucetContract.requestTokens();
      await tx.wait();
    } catch (error) {
      console.error("Error requesting tokens:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={requestTokens}
      disabled={loading}
      className="bg-red-500 hover:bg-red-600 text-white"
    >
      <CandyCane className="w-5 h-5 mr-2" />
      {loading ? "Requesting..." : "Free Tokens"}
    </Button>
  );
}
