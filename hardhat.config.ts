import { HardhatUserConfig, task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import "@nomicfoundation/hardhat-toolbox";
import interactLocalhost from "./scripts/interact-localhost";
import deployPolygonBridge from "./scripts/deploy-polygon-bridge";
import interactPolygonLocalhost from "./scripts/interact-polygon-local";

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

task("interact-localhost", "Deploys contract on Goerli network")
  .setAction(async(args: any, hre: HardhatRuntimeEnvironment) => {
    await interactLocalhost();
    await interactPolygonLocalhost();
  });

task("deploy-polygon-bridge-localhost", "Deploys contract on Goerli network")
  .setAction(async (args: any, hre: HardhatRuntimeEnvironment) => {
    await deployPolygonBridge();
  });