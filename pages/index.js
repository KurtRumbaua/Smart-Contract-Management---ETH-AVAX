import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atmAbi from "../artifacts/contracts/Assessment.sol/Assessment.json";
import { Container, Button, TextField, Typography, Box, Card, CardContent, Alert } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const theme = createTheme();

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [funds, setFunds] = useState(undefined);
  const [newAdmin, setNewAdmin] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atmAbi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account && account.length > 0) {
      setAccount(account[0]);
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }

    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);

    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  }
  const getFunds = async() => {
    if (atm) {
      const fundsBigNumber = await atm.getFunds();
      setFunds(ethers.utils.formatEther(fundsBigNumber));
    }
  }
  
  const deposit = async() => {
    if (atm && depositAmount) {
      let tx = await atm.addFunds(ethers.utils.parseEther(depositAmount));
      await tx.wait();
      getFunds();
      setDepositAmount(""); // Clear the input field
    }
  }

  const withdraw = async() => {
    if (atm && withdrawAmount) {
      let tx = await atm.removeFunds(ethers.utils.parseEther(withdrawAmount));
      await tx.wait();
      getFunds();
      setWithdrawAmount(""); // Clear the input field
    }
  }

  const changeAdmin = async() => {
    if (atm && newAdmin) {
      let tx = await atm.changeAdmin(newAdmin);
      await tx.wait();
      setNewAdmin("");
    }
  }

  const initUser = () => {
    if (!ethWallet) {
      return <Alert severity="warning">Please install MetaMask to use this wallet.</Alert>;
    }

    if (!account) {
      return <Button variant="contained" color="primary" onClick={connectAccount}>Connect MetaMask Wallet</Button>;
    }

    if (funds === undefined) {
      getFunds();
    }

    return (
      <Card variant="outlined" sx={{ mt: 4, p: 2 }}>
        <CardContent>
          <Typography variant="h6">Your Account: {account}</Typography>
          <Typography variant="h6">Your Funds: {funds} ETH</Typography>
          <Box mt={2}>
            <TextField
              label="Deposit Amount (ETH)"
              variant="outlined"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              fullWidth
            />
            <Button variant="contained" color="primary" onClick={deposit} sx={{ mt: 2 }}>Deposit ETH</Button>
          </Box>
          <Box mt={2}>
            <TextField
              label="Withdraw Amount (ETH)"
              variant="outlined"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              fullWidth
            />
            <Button variant="contained" color="secondary" onClick={withdraw} sx={{ mt: 2 }}>Withdraw ETH</Button>
          </Box>
          <Box mt={2}>
            <TextField
              label="New Admin Address"
              variant="outlined"
              value={newAdmin}
              onChange={(e) => setNewAdmin(e.target.value)}
              fullWidth
            />
            <Button variant="contained" color="warning" onClick={changeAdmin} sx={{ mt: 2 }}>Change Admin</Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  useEffect(() => { getWallet(); }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1">Welcome to the Crypto Wallet!</Typography>
        {initUser()}
      </Container>
    </ThemeProvider>
  );
}
