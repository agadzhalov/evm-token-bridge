import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ERC20TokenFactory, EthereumToken } from '../typechain-types';
import BaseTokenJSON from "./../artifacts/contracts/BaseToken.sol/BaseToken.json";

const deployInit = async () => {
    let signer: SignerWithAddress;
    [signer] = await ethers.getSigners();

    console.log("Deployer: " + signer.address)

    /** DEPLOY TOKEN */
    await deployERC20Token("EthToken", "ETHTKN", "10000");

    /** DEPLOY ETHEREUM BRIDGE */
    await deployContract("EthereumBridge");

    /** DEPLOY POLYGON BRIDGE */
    await deployContract("PolygonBridge");
}

export default deployInit;

const deployContract = async(...args: any[]): Promise<any> => {
    const AbstractContract = await ethers.getContractFactory(args[0]);
    const contract = await AbstractContract.deploy();
    await contract.deployed();
    console.log(args[0], "deployed to:", contract.address);
    return contract;
}

const deployERC20Token = async(name: string, symbol: string, amount: string) => {
    const ERC20Contract = await ethers.getContractFactory("BaseToken");
    const contract = await ERC20Contract.deploy(name, symbol, ethers.utils.parseUnits(amount, 18));
    await contract.deployed();
    console.log("BaseToken", "deployed to:", contract.address);
    return contract;
}