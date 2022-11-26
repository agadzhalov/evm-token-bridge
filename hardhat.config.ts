import { HardhatUserConfig, task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import "@nomicfoundation/hardhat-toolbox";
import interactLocalhost from "./scripts/interact-localhost";
import interactPolygonLocalhost from "./scripts/interact-polygon-local";
import deployInit from "./scripts/deploy-init";
import deployERC20TokenGoerli from "./scripts/deploy-erc20-goerli";

import * as dotenv from "dotenv";
import deployEthereumBridgeGoerli from "./scripts/deploy-ethbridge-goerli";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.17",
      }],
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    }
  },
  networks: {
    goerli: {
      url: process.env.RPC_URL || "",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : []
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY || ""
  }
};

export default config;

task("deploy-erc20-goerli", "Deploys EthereumToken, EthereumBrdige and PolygonBridge")
  .setAction(async (args: any, hre: HardhatRuntimeEnvironment) => {
    await deployERC20TokenGoerli(args, hre);
  });

task("deploy-ethbridge-goerli", "Deploys EthereumToken, EthereumBrdige and PolygonBridge")
  .setAction(async (args: any, hre: HardhatRuntimeEnvironment) => {
    await deployEthereumBridgeGoerli(args, hre);
  });


task("deploy-init", "Deploys EthereumToken, EthereumBrdige and PolygonBridge")
  .setAction(async (args: any, hre: HardhatRuntimeEnvironment) => {
    await deployInit();
  });

task("interact-localhost", "Deploys contract on Goerli network")
  .setAction(async(args: any, hre: HardhatRuntimeEnvironment) => {
    await interactLocalhost();
    await interactPolygonLocalhost();
  });
