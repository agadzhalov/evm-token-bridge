import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ERC20TokenFactory, EthereumToken } from '../typechain-types';
import EthereumTokenJSON from "./../artifacts/contracts/EthereumToken.sol/EthereumToken.json";

const deployInit = async () => {
    let signer: SignerWithAddress;
    [signer] = await ethers.getSigners();

    console.log("Deployer: " + signer.address)

    /*** DEPLOY TOKEN FACTORY */
    const ERC20Factory = await ethers.getContractFactory("ERC20TokenFactory");
    const erc20Factory: ERC20TokenFactory = await ERC20Factory.deploy();
    await erc20Factory.deployed();
    console.log("ERC20Factory deployed to:", erc20Factory.address);
    const ethereumToken: EthereumToken = await deployAndGetToken(erc20Factory, signer, "RandomToken", "RdkToken", "10000");
    console.log(await ethereumToken.address, await ethereumToken.name(), await ethereumToken.symbol());

    // await ethereumTokenFactory.createEthereumToken("222", "2222", ethers.utils.parseUnits('10000', 18));
    // const address2 = await ethereumTokenFactory.tokens(1);
    // const ethereumToken2: EthereumToken = new ethers.Contract(address2, EthereumTokenJSON.abi, signer);
    // console.log(await ethereumToken2.name())

    /*** DEPLOY ETHEREUM BRIDGE */
    // const EthereumBridge = await ethers.getContractFactory("EthereumBridge");
    // const ethereumBridge = await EthereumBridge.deploy(ethereumToken.address);
    // await ethereumBridge.deployed();
    // console.log("EthereumBridge deployed to:", ethereumBridge.address);

    /*** DEPLOY POLYGON BRIDGE */
    // const PolygonBridge = await ethers.getContractFactory("PolygonBridge");
    // const polygonBridge = await PolygonBridge.deploy();
    // await polygonBridge.deployed();
    // console.log("PolygonBridge deployed to:", polygonBridge.address);
}

export default deployInit;

const deployAndGetToken = async(erc20Factory: ERC20TokenFactory, signer: any,
                                name: string, symbol: string, amount: any): Promise<EthereumToken> => {
    const bytecode = await erc20Factory.getByteCode(name, symbol, ethers.utils.parseUnits(amount, 18));
    await erc20Factory.deploy(bytecode, 777);
    const address = await erc20Factory.getAddress(bytecode, 777);

    const ethereumToken: EthereumToken = new ethers.Contract(address, EthereumTokenJSON.abi, signer);
    return ethereumToken;
}