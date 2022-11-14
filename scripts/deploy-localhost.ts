import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import EthereumToken from "./../artifacts/contracts/EthereumToken.sol/EthereumToken.json";
import EthereumBridge from "./../artifacts/contracts/EthereumBridge.sol/EthereumBridge.json";

const deployLocalhost = async () => {
    let signer: SignerWithAddress;
    [signer] = await ethers.getSigners();
    console.log("Deployer: " + signer.address)

    /**
     * DEPLOY ETHEREUM TOKEN
     */
    const EthereumToken = await ethers.getContractFactory("EthereumToken");
    const ethereumToken = await EthereumToken.deploy();
    await ethereumToken.deployed();
    console.log("EthereumToken deployed to:", ethereumToken.address);

    /**
     * DEPLOY ETHEREUM BRIDGE
     */
    const EthereumBridge = await ethers.getContractFactory("EthereumBridge");
    const ethereumBridge = await EthereumBridge.deploy(ethereumToken.address);
    await ethereumBridge.deployed();
    console.log("EthereumBridge deployed to:", ethereumBridge.address);

    console.log("Owner: " + await ethereumToken.balanceOf(signer.address));
    /**
     * APPROVE & DEPOSIT/LOCK
     */
    await ethereumToken.approve(ethereumBridge.address, ethers.utils.parseUnits('10000', 18));
    await ethereumBridge.depositERC20(4700);

    console.log("Balance Of Owner: " + await ethereumToken.balanceOf(signer.address));
    console.log("Balance Of Bridge: " + await ethereumToken.balanceOf(ethereumBridge.address));      
}


export default deployLocalhost;