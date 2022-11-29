# evm-token-bridge
EVM Token Bridge - Transfers ERC20 tokens from source blockchain network to target network

## Create .env file

Create an `.env` file with the following structure 

```javascript I'm A tab
ETHEREUM_RPC_URL=YOUR ETHEREUM_RPC_URL HERE
MUMBAI_RPC_URL=YOUR MUMBAI_RPC_URL HERE
PRIVATE_KEY=YOUR PRIVATE_KEY HERE
ETHERSCAN_KEY=YOUR ETHERSCAN_KEY HERE
POLYGONSCAN_KEY=YOUR POLYGONSCAN_KEY HERE
```
## Deployment

First we have to deploy our ERC20 token on desired network. In our case we are going to deploy on Goerli.
Make sure you have some GoerliETH in your wallet.

`deploy-erc20-goerli` is a custom task implemented in `hardhat.config.ts`

```bash
  npx hardhat deploy-erc20-goerli --network goerli
```

Second we have to deploy and verify our `EthereumBridge` contract on Goerli

```bash
  npx hardhat deploy-ethbridge-goerli --network goerli
```
Third we have to deploy and verify our `PolygonBridge` contract on Mumbai
```bash
  npx hardhat deploy-polygonbridge-mumbai --network matic
```