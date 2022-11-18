import { expect } from "chai";
import { ethers } from "hardhat";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ERC20TokenFactory, EthereumBridge,  EthereumToken } from "../typechain-types";
import EthereumTokenJSON from "./../artifacts/contracts/EthereumToken.sol/EthereumToken.json";

describe("ERC20Factory", function () {
    
    let ERC20Factory: any;
    let erc20Factory: ERC20TokenFactory;

    let owner: SignerWithAddress;

    beforeEach(async () => {
        [owner] = await ethers.getSigners();

        ERC20Factory = await ethers.getContractFactory("ERC20TokenFactory");
        erc20Factory = await ERC20Factory.deploy();
        await erc20Factory.deployed();
    });

    it("Should deploy ERC20 token", async function () {
        const bytecode = await erc20Factory.getByteCode("Random", "RDK", ethers.utils.parseUnits("10000", 18));
        await erc20Factory.deploy(bytecode, 777);

        const address = await erc20Factory.getERC20Address(0);
        const ethereumToken = new ethers.Contract(address, EthereumTokenJSON.abi, erc20Factory.signer);
        
    });

});
