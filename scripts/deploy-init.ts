import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { EthereumToken } from '../typechain-types';

const deployInit = async () => {
    let signer: SignerWithAddress;
    [signer] = await ethers.getSigners();

    console.log("Deployer: " + signer.address)

    /*** DEPLOY ETHEREUM TOKEN*/
    const EthereumToken = await ethers.getContractFactory("EthereumToken");
    const ethereumToken: EthereumToken = await EthereumToken.deploy();
    await ethereumToken.deployed();
    console.log("EthereumToken deployed to:", ethereumToken.address);

    /*** DEPLOY ETHEREUM BRIDGE */
    const EthereumBridge = await ethers.getContractFactory("EthereumBridge");
    const ethereumBridge = await EthereumBridge.deploy(ethereumToken.address);
    await ethereumBridge.deployed();
    console.log("EthereumBridge deployed to:", ethereumBridge.address);

    /*** DEPLOY POLYGON BRIDGE */
    const PolygonBridge = await ethers.getContractFactory("PolygonBridge");
    const polygonBridge = await PolygonBridge.deploy();
    await polygonBridge.deployed();
    console.log("PolygonBridge deployed to:", polygonBridge.address);
}

export default deployInit;