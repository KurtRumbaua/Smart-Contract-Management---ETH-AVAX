import { useState, useEffect } from "react";
import { ethers } from "ethers";
import votingAbi from "../artifacts/contracts/Voting.sol/Voting.json";
import { Container, Button, TextField, Typography, Box, Card, CardContent, Alert, List, ListItem } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const theme = createTheme();

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [voting, setVoting] = useState(undefined);
  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState("");
  const [voteOption, setVoteOption] = useState("");
  const [results, setResults] = useState({});

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const votingABI = votingAbi.abi;

  const getWallet = async () => {
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

  const connectAccount = async () => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }

    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);

    getVotingContract();
  };

  const getVotingContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const votingContract = new ethers.Contract(contractAddress, votingABI, signer);

    setVoting(votingContract);
  }

  const addOption = async () => {
    if (voting && newOption) {
      let tx = await voting.addOption(newOption);
      await tx.wait();
      setNewOption("");
      loadOptions();
    }
  }

  const vote = async () => {
    if (voting && voteOption) {
      let tx = await voting.vote(voteOption);
      await tx.wait();
      setVoteOption("");
      loadResults();
    }
  }

  const loadOptions = async () => {
    if (voting) {
      const options = await voting.getOptions();
      setOptions(options);
    }
  }

  const loadResults = async () => {
    if (voting) {
      let results = {};
      for (let option of options) {
        const count = await voting.getVotes(option);
        results[option] = count.toNumber();
      }
      setResults(results);
    }
  }

  const initUser = () => {
    if (!ethWallet) {
      return <Alert severity="warning">Please install MetaMask to use this wallet.</Alert>;
    }

    if (!account) {
      return <Button variant="contained" color="primary" onClick={connectAccount}>Connect MetaMask Wallet</Button>;
    }

    if (options.length === 0) {
      loadOptions();
    }

    return (
      <Card variant="outlined" sx={{ mt: 4, p: 2 }}>
        <CardContent>
          <Typography variant="h6">Your Account: {account}</Typography>
          <Box mt={2}>
            <TextField
              label="New Option"
              variant="outlined"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              fullWidth
            />
            <Button variant="contained" color="primary" onClick={addOption} sx={{ mt: 2 }}>Add Option</Button>
          </Box>
          <Box mt={2}>
            <TextField
              label="Vote Option"
              variant="outlined"
              value={voteOption}
              onChange={(e) => setVoteOption(e.target.value)}
              fullWidth
            />
            <Button variant="contained" color="secondary" onClick={vote} sx={{ mt: 2 }}>Vote</Button>
          </Box>
          <Box mt={4}>
            <Typography variant="h6">Options:</Typography>
            <List>
              {options.map((option, index) => (
                <ListItem key={index}>{option}</ListItem>
              ))}
            </List>
          </Box>
          <Box mt={4}>
            <Typography variant="h6">Results:</Typography>
            <List>
              {Object.keys(results).map((option, index) => (
                <ListItem key={index}>{option}: {results[option]} votes</ListItem>
              ))}
            </List>
          </Box>
        </CardContent>
      </Card>
    );
  }

  useEffect(() => { getWallet(); }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1">Welcome to the Voting System!</Typography>
        {initUser()}
      </Container>
    </ThemeProvider>
  );
}
