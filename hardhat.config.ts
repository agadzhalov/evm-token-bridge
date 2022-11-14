import { HardhatUserConfig, task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import "@nomicfoundation/hardhat-toolbox";
import deployLocalhost from "./scripts/deploy-localhost";

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
};

export default config;

task("deploy-localhost", "Deploys contract on Goerli network")
  .setAction(async(args: any, hre: HardhatRuntimeEnvironment) => {
    await deployLocalhost();
  });