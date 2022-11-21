import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import BaseTokenJSON from "./../artifacts/contracts/BaseToken.sol/BaseToken.json";
import EthereumBridgeJSON from "./../artifacts/contracts/EthereumBridge.sol/EthereumBridge.json";
import * as fs from 'fs';
import { EthereumBridge, BaseToken } from '../typechain-types';

const interactLocalhost = async () => {
    let signer: SignerWithAddress;
    [signer] = await ethers.getSigners();

    console.log("----------------------ETHEREUM-----------------------");

    const ethereumToken: BaseToken = new ethers.Contract("0x5FbDB2315678afecb367f032d93F642f64180aa3", BaseTokenJSON.abi, signer);
    const ethereumBridge: EthereumBridge = new ethers.Contract("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", EthereumBridgeJSON.abi, signer);

    /*** APPROVE & DEPOSIT/LOCK*/
    await ethereumToken.approve(ethereumBridge.address, ethers.utils.parseUnits('10000', 18));
    console.log("Approve and deposit:", ethers.utils.parseUnits('4700', 18));
    await ethereumBridge.depositERC20(ethereumToken.address, ethers.utils.parseUnits('4700', 18));

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