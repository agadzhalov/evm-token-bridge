import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import * as fs from 'fs';

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
    writeLineToFile(ethereumToken.address, signer.address, ethers.utils.parseUnits('4700', 18));
    console.log("Balance Of Owner: " + await ethereumToken.balanceOf(signer.address));
    console.log("Balance Of Bridge: " + await ethereumToken.balanceOf(ethereumBridge.address));

    /**
     * LISTEN FOR EVENT AND SAVE DATA
     */
}

export default deployLocalhost;

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