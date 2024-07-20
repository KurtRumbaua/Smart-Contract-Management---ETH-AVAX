# Voting Contract - ETH + AVAX

## Description

The project involves developing a smart contract with voting functionality. The smart contract allows users to vote on predefined options and keeps track of votes. The frontend of the application displays the voting options and their respective vote counts.

## Getting Started

To get the project running on your local machine, follow these steps:

### Prerequisites

- Node.js and npm installed on your machine
- Git installed on your machine

### Executing the Program

1. **Clone the repository**, install dependencies, run local blockchain node, deploy smart contracts, and launch the frontend:

   ```bash
   git clone https://github.com/KurtRumbaua/Smart-Contract-Management---ETH-AVAX.git
   cd Smart-Contract-Management---ETH-AVAX
   npm install
   npx hardhat node
   # Open another terminal in VS Code
   npx hardhat run --network localhost scripts/deploy.js
   # Open another terminal in VS Code
   npm run dev

2. **Install the MetaMask extension** in your web browser:

Add a network manually in your MetaMask with these fields:

Name: (can be anything you would like)
RPC URL: http://127.0.0.1:8545/
Chain ID: 31337
Currency Symbol: ETH
Click "Save" and switch to your created network.

Go back to the terminal where you entered npx hardhat node and copy the private key of Account 0. Import the account to MetaMask.

After completing these steps, you will be able to use the program by navigating to the link provided after running npm run dev. It should look something like this image. Open the http://localhost:3000 link using your web browser and you can now use the Voting application!

### Help
Be sure to use Account 0 as it is the owner.
If you encounter an error where your nonce is too high, go to MetaMask, select Settings -> Advanced, and clear the activity tab data. This error occurs when you use your account, close the application, and then use the account again.

### Authors
Kurt Ian Rumbaua(kirrumbaua@mymail.mapua.edu.ph)

### License
This project is licensed under the Kurt Ian Rumbaua License - see the LICENSE.md file for details
