import React, { useState } from 'react';
import { 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { ethers } from 'ethers';

function StakeForm({ stakingContract, tokenContract, onStakeComplete }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleStake = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Convert amount to wei
      const amountWei = ethers.utils.parseEther(amount);

      // First approve the staking contract to spend tokens
      const approveTx = await tokenContract.approve(stakingContract.address, amountWei);
      await approveTx.wait();

      // Then stake the tokens
      const stakeTx = await stakingContract.stake(amountWei);
      await stakeTx.wait();

      setSuccess('Successfully staked tokens!');
      setAmount('');
      if (onStakeComplete) onStakeComplete();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Convert amount to wei
      const amountWei = ethers.utils.parseEther(amount);

      // Withdraw tokens
      const withdrawTx = await stakingContract.withdraw(amountWei);
      await withdrawTx.wait();

      setSuccess('Successfully withdrawn tokens!');
      setAmount('');
      if (onStakeComplete) onStakeComplete();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Stake or Withdraw Tokens
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        disabled={loading}
        sx={{ mb: 2 }}
      />

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleStake}
          disabled={loading || !amount}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : 'Stake'}
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleWithdraw}
          disabled={loading || !amount}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : 'Withdraw'}
        </Button>
      </Box>
    </Paper>
  );
}

export default StakeForm;
