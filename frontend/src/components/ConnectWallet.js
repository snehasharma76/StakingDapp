import React from 'react';
import { Button, Box } from '@mui/material';

function ConnectWallet({ onConnect }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={onConnect}
        size="large"
      >
        Connect Wallet
      </Button>
    </Box>
  );
}

export default ConnectWallet;
