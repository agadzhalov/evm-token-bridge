// import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
// import PolygonBridgeJSON from "./../artifacts/contracts/PolygonBridge.sol/PolygonBridge.json";
// import BaseTokenJSON from "./../artifacts/contracts/BaseToken.sol/BaseToken.json";
// import readLastLines from 'read-last-lines';
// import { BaseToken, EthereumToken, PolygonBridge, PolygonToken } from '../typechain-types';

// const interactPolygonLocalhost = async () => {
//     let signer: SignerWithAddress;
//     [signer] = await ethers.getSigners();
    
//     /*** LISTEN FOR EVENT AND SAVE DATA*/
//     console.log("----------------------POLYGON-----------------------");

//     let localStorage: any;
//     await readLastLines.read('./db/log.txt', 1).then((lines: any) => localStorage=lines);
//     const ethereumData = JSON.parse(localStorage);

//     const polygonBridge: PolygonBridge = new ethers.Contract("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0", PolygonBridgeJSON.abi, signer);
//     const ethereumToken: EthereumToken = new ethers.Contract(ethereumData.token, BaseTokenJSON.abi, signer);
    
//     /*** DEPLOY TOKEN ON POLYGON*/
//     const isTokenOnPolygon = await polygonBridge.isTokenOnPolygon(ethereumToken.address);
//     console.log("Checks if token is on Polygon: " + isTokenOnPolygon);
//     if (!isTokenOnPolygon) {
//         const ethTokenName = await ethereumToken.name();
//         const ethTokenSymbol = await ethereumToken.symbol();
//         console.log("Deploys new Polygon Token as a representative OF:", ethTokenName, ethTokenSymbol);
    
//         const PolygonToken = await ethers.getContractFactory("BaseToken");
//         const polygonToken: BaseToken = await PolygonToken.deploy(ethTokenName, ethTokenSymbol, ethereumData.amount);
//         await polygonToken.deployed();

//         await polygonBridge.setTokenOnPolygon(ethereumToken.address, polygonToken.address);
//         console.log("Set ethToken on Polygon:", await polygonBridge.isTokenOnPolygon(ethereumToken.address))
//         console.log("PolygonToken deployed to:", await polygonToken.name(), await polygonToken.symbol(), polygonToken.address);

//         console.log("Minted PolygonTokens for Owner: " + await polygonToken.balanceOf(signer.address));
//     } else {
//         const polygonTokenAddress = await polygonBridge.getRepresentativeToken(ethereumData.token);
//         const polygonToken: PolygonToken = new ethers.Contract(polygonTokenAddress, BaseTokenJSON.abi, signer);
//         await polygonToken.mint(ethereumData.amount);
//         console.log("Minted PolygonTokens for Owner: " + await polygonToken.balanceOf(signer.address));
//     }
    
// }

// export default interactPolygonLocalhost;
