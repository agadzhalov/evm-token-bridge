import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import PolygonBridgeJSON from "./../artifacts/contracts/PolygonBridge.sol/PolygonBridge.json";
import EthereumTokenJSON from "./../artifacts/contracts/EthereumToken.sol/EthereumToken.json";
import readLastLines from 'read-last-lines';
import { EthereumToken, PolygonBridge, PolygonToken } from '../typechain-types';

const interactPolygonLocalhost = async () => {
    let signer: SignerWithAddress;
    [signer] = await ethers.getSigners();
    console.log("Deployer: " + signer.address)
    /**
     * LISTEN FOR EVENT AND SAVE DATA
     */
    console.log("----------------------POLYGON-----------------------");

    let localStorage: any;
    await readLastLines.read('./db/log.txt', 1).then((lines: any) => localStorage=lines);
    const ethereumData = JSON.parse(localStorage);

    const polygonBridge: PolygonBridge = new ethers.Contract("0x33E45b187da34826aBCEDA1039231Be46f1b05Af", PolygonBridgeJSON.abi, signer);
    const ethereumToken: EthereumToken = new ethers.Contract(ethereumData.token, EthereumTokenJSON.abi, signer);
    
    console.log("Checks if token is on Polygon: " + await polygonBridge.isTokenOnPolygon(ethereumToken.address));
    const ethTokenName = await ethereumToken.name();
    const ethTokenSymbol = await ethereumToken.symbol();
    console.log("Deploys new Polygon Token as a representative OF:", ethTokenName, ethTokenSymbol);

    /**
     * DEPLOY TOKEN ON POLYGON
     */
    const PolygonToken = await ethers.getContractFactory("PolygonToken");
    const polygonToken: PolygonToken = await PolygonToken.deploy(ethTokenName, ethTokenSymbol);
    await polygonToken.deployed();
    console.log("PolygonToken deployed to:", await polygonToken.name(), await polygonToken.symbol(), polygonToken.address);

    await polygonToken.mint(ethereumData.amount); // comes from reading the event data
    console.log("Minted PolygonTokens for Owner: " + await polygonToken.balanceOf(signer.address));
}

export default interactPolygonLocalhost;
