import { expect } from "chai";
import { ethers } from "hardhat";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ERC20TokenFactory, EthereumBridge,  EthereumToken } from "../typechain-types";
import EthereumTokenJSON from "./../artifacts/contracts/EthereumToken.sol/EthereumToken.json";

describe("EthereumBridge", function () {

    let ethBridgeFactory: any;
    let ethBridge: EthereumBridge;

    let ERC20Factory: any;
    let erc20Factory: ERC20TokenFactory;

    let owner: SignerWithAddress;

    beforeEach(async () => {
        [owner] = await ethers.getSigners();

        ERC20Factory = await ethers.getContractFactory("ERC20TokenFactory");
        erc20Factory = await ERC20Factory.deploy();
        await erc20Factory.deployed();

        const bytecode = await erc20Factory.getByteCode("Random", "RDK", ethers.utils.parseUnits("10000", 18));
        await erc20Factory.deploy(bytecode, 777);

        ethBridgeFactory = await ethers.getContractFactory("EthereumBridge");
        ethBridge = await ethBridgeFactory.deploy();
        await ethBridge.deployed();
    });

    it.only("Should deposit 4700 ERC20 tokens to EthereumBridge", async function () {
        const address = await erc20Factory.getERC20Address(0);
        
        await erc20Factory.transferToDeployer(address, ethers.utils.parseUnits("10000", 18));
        const ethereumToken = new ethers.Contract(address, EthereumTokenJSON.abi, owner);

        await ethereumToken.approve(ethBridge.address, ethers.utils.parseUnits('10000', 18));

        const depositTx = await ethBridge.depositERC20(ethereumToken.address, 4700);
        await depositTx.wait();

        expect(await ethereumToken.balanceOf(ethBridge.address)).to.equal(ethers.utils.parseUnits('4700', 18));
        expect(await ethereumToken.balanceOf(owner.address)).to.equal(ethers.utils.parseUnits('5300', 18));
        await expect(depositTx).to.emit(ethBridge, 'DepositTokens').withArgs(ethBridge.address, owner.address, ethers.utils.parseUnits('4700', 18));
    });

    // it("Should deposit 4700 ERC20 tokens to EthereumBridge", async function () {
    //     await ethToken.approve(ethBridge.address, ethers.utils.parseUnits('10000', 18));
    //     const depositTx = await ethBridge.depositERC20(4700);
    //     await depositTx.wait();

    //     expect(await ethToken.balanceOf(ethBridge.address)).to.equal(ethers.utils.parseUnits('4700', 18));
    //     expect(await ethToken.balanceOf(owner.address)).to.equal(ethers.utils.parseUnits('5300', 18));
    //     await expect(depositTx).to.emit(ethBridge, 'DepositTokens').withArgs(ethBridge.address, owner.address, ethers.utils.parseUnits('4700', 18));
    // });

    // it("Should throw on trying to deposit more tokens than available", async function () {
    //     await ethToken.approve(ethBridge.address, ethers.utils.parseUnits('10000', 18));

    //     const depositTx = await ethBridge.depositERC20(10000);
    //     await depositTx.wait();

    //     await expect(ethBridge.depositERC20(5001)).to.be.revertedWith("Insufficient amount of tokens");
    // });

});
