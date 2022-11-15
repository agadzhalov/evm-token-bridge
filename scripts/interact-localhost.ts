import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import PolygonBridgeJSON from "./../artifacts/contracts/PolygonBridge.sol/PolygonBridge.json";
import * as fs from 'fs';
import readLastLines from 'read-last-lines';
import { EthereumToken, PolygonBridge, PolygonToken } from '../typechain-types';

const interactLocalhost = async () => {
    let signer: SignerWithAddress;
    [signer] = await ethers.getSigners();
    console.log("Deployer: " + signer.address)

    /**
     * DEPLOY ETHEREUM TOKEN
     */
    const EthereumToken = await ethers.getContractFactory("EthereumToken");
    const ethereumToken: EthereumToken = await EthereumToken.deploy();
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
    writeLineToFile(ethereumToken.address, signer.address, ethers.utils.parseUnits('4700', 18));
    console.log("Balance Of Owner: " + await ethereumToken.balanceOf(signer.address));
    console.log("Balance Of Bridge: " + await ethereumToken.balanceOf(ethereumBridge.address));
}

export default interactLocalhost;

const writeLineToFile = (token: string, recipient: string, amount: any) => {
    let obj = {
        token: token,
        recipient: recipient,
        amount: amount
    }
    const data = JSON.stringify(obj) + '\n';
    fs.appendFile('./db/log.txt', data, (err) => {
        if (err) {
            console.log(err)
        } else {
            // done
        }
    })
}