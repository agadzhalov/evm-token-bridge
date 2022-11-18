import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import EthereumTokenJSON from "./../artifacts/contracts/EthereumToken.sol/EthereumToken.json";
import EthereumBridgeJSON from "./../artifacts/contracts/EthereumBridge.sol/EthereumBridge.json";
import ERC20TokenFactoryJSON from "./../artifacts/contracts/ERC20TokenFactory.sol/ERC20TokenFactory.json";
import * as fs from 'fs';
import { ERC20TokenFactory, EthereumBridge, EthereumToken, PolygonBridge, PolygonToken } from '../typechain-types';

const interactLocalhost = async () => {
    let signer: SignerWithAddress;
    [signer] = await ethers.getSigners();

    console.log("----------------------ETHEREUM-----------------------");
    const erc20Factory: ERC20TokenFactory = new ethers.Contract("0x5FbDB2315678afecb367f032d93F642f64180aa3", ERC20TokenFactoryJSON.abi, signer);
    const erc20Address = await erc20Factory.getERC20Address(0);
    
    const ethereumToken: EthereumToken = new ethers.Contract(erc20Address, EthereumTokenJSON.abi, signer);
    const ethereumBridge: EthereumBridge = new ethers.Contract("0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9", EthereumBridgeJSON.abi, signer);

    /*** APPROVE & DEPOSIT/LOCK*/
    await ethereumToken.approve(ethereumBridge.address, ethers.utils.parseUnits('10000', 18));
    console.log("Approve and deposit:", ethers.utils.parseUnits('4700', 18));
    await ethereumBridge.depositERC20(ethereumToken.address, 4700);

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