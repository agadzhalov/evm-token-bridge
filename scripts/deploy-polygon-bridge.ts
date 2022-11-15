import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

const deployPolygonBridge = async () => {
    let signer: SignerWithAddress;
    [signer] = await ethers.getSigners();

    console.log("Deployer: " + signer.address)

    /*** DEPLOY ETHEREUM TOKE */
    const PolygonBridge = await ethers.getContractFactory("PolygonBridge");
    const polygonBridge = await PolygonBridge.deploy();
    await polygonBridge.deployed();
    console.log("PolygonBridge deployed to:", polygonBridge.address);
}

export default deployPolygonBridge;