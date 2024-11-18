import React from 'react';
import { Paper, Typography, Box, Grid } from '@mui/material';

function StakeInfo({ stakeInfo, tokenBalance, account }) {
  const formatDate = (timestamp) => {
    if (timestamp === '0') return 'Not staking';
    return new Date(parseInt(timestamp) * 1000).toLocaleString();
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Account Info
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {account.slice(0, 6)}...{account.slice(-4)}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Token Balance
            </Typography>
            <Typography variant="h6">
              {parseFloat(tokenBalance).toFixed(4)} STK
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Staked Amount
            </Typography>
            <Typography variant="h6">
              {parseFloat(stakeInfo.stakedAmount).toFixed(4)} STK
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Staking Since
            </Typography>
            <Typography variant="h6">
              {formatDate(stakeInfo.stakingTime)}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Pending Rewards
            </Typography>
            <Typography variant="h6" color="success.main">
              {parseFloat(stakeInfo.pendingRewards).toFixed(4)} STK
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default StakeInfo;
