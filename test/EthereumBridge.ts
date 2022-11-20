import { expect } from "chai";
import { ethers } from "hardhat";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BaseToken, EthereumBridge } from "../typechain-types";
import BaseTokenJSON from "./../artifacts/contracts/BaseToken.sol/BaseToken.json";

describe("EthereumBridge", function () {

    let tokenContract: BaseToken;

    let ethBridgeFactory: any;
    let ethBridge: EthereumBridge;

    let owner: SignerWithAddress;

    beforeEach(async () => {
        [owner] = await ethers.getSigners();

        const ERC20Contract = await ethers.getContractFactory("BaseToken");
        tokenContract = await ERC20Contract.deploy("EthereumToken", "ETHTKN", ethers.utils.parseUnits("10000", 18));
        await tokenContract.deployed();

        ethBridgeFactory = await ethers.getContractFactory("EthereumBridge");
        ethBridge = await ethBridgeFactory.deploy();
        await ethBridge.deployed();
    });

    it.only("Should deposit 4700 ERC20 tokens to EthereumBridge", async function () {
        const tokenAddress = await tokenContract.address;
        
        const ethereumToken: BaseToken = new ethers.Contract(tokenAddress, BaseTokenJSON.abi, owner);
        
        const approveTx = await ethereumToken.approve(ethBridge.address, ethers.utils.parseUnits('10000', 18));
        approveTx.wait();

        await expect(approveTx).to.emit(tokenContract, 'Approval').withArgs(owner.address, ethBridge.address, ethers.utils.parseUnits('10000', 18));

        const depositTx = await ethBridge.depositERC20(ethereumToken.address, ethers.utils.parseUnits('4700', 18));
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
