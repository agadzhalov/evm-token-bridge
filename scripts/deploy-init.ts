import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ERC20TokenFactory, EthereumToken } from '../typechain-types';
import BaseTokenJSON from "./../artifacts/contracts/BaseToken.sol/BaseToken.json";

const deployInit = async () => {
    let signer: SignerWithAddress;
    [signer] = await ethers.getSigners();

    console.log("Deployer: " + signer.address)

    /** DEPLOY ERC20 TOKEN FACTORY */
    const erc20Factory = await deployContract("ERC20TokenFactory");

    /** DEPLOY TOKEN */
    await deployAndGetToken(erc20Factory, signer, "RandomToken", "RDKTKN", "10000");

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

const deployAndGetToken = async(erc20Factory: ERC20TokenFactory, signer: any,
                                name: string, symbol: string, amount: any): Promise<EthereumToken> => {
    /** DEPLOYMENT OF TOKEN */
    const bytecode = await erc20Factory.getByteCode(name, symbol, ethers.utils.parseUnits(amount, 18));
    await erc20Factory.deploy(bytecode, 777);
    
    /** TRANSFER TO OWNER WALLET */
    const address = await erc20Factory.getAddress(bytecode, 777);
    await erc20Factory.transferToDeployer(address, ethers.utils.parseUnits(amount, 18));
    
    /** INFO TOKEN */
    const ethereumToken: EthereumToken = new ethers.Contract(address, BaseTokenJSON.abi, signer);
    console.log("Token deployed: ", await ethereumToken.name(), await ethereumToken.symbol(), ethereumToken.address);

    return ethereumToken;
}