import { expect } from "chai";
import { ethers } from "hardhat";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { EthereumBridge,  EthereumToken } from "../typechain-types";

describe("EthereumBridge", function () {
    
    let ethTokenFactory: any;
    let ethToken: EthereumToken;

    let ethBridgeFactory: any;
    let ethBridge: EthereumBridge;

    let owner: SignerWithAddress;

    beforeEach(async () => {
        [owner] = await ethers.getSigners();

        ethTokenFactory = await ethers.getContractFactory("EthereumToken");
        ethToken = await ethTokenFactory.deploy();
        await ethToken.deployed();

        ethBridgeFactory = await ethers.getContractFactory("EthereumBridge");
        ethBridge = await ethBridgeFactory.deploy(ethToken.address);
        await ethBridge.deployed();
    });

    it("Should deposit 4700 ERC20 tokens to EthereumBridge", async function () {
        await ethToken.approve(ethBridge.address, ethers.utils.parseUnits('10000', 18));
        const depositTx = await ethBridge.depositERC20(4700);
        await depositTx.wait();

        expect(await ethToken.balanceOf(ethBridge.address)).to.equal(ethers.utils.parseUnits('4700', 18));
        expect(await ethToken.balanceOf(owner.address)).to.equal(ethers.utils.parseUnits('5300', 18));
        await expect(depositTx).to.emit(ethBridge, 'DepositTokens').withArgs(ethBridge.address, owner.address, ethers.utils.parseUnits('4700', 18));
    });

    it("Should throw on trying to deposit more tokens than available", async function () {
        await ethToken.approve(ethBridge.address, ethers.utils.parseUnits('10000', 18));

        const depositTx = await ethBridge.depositERC20(10000);
        await depositTx.wait();

        await expect(ethBridge.depositERC20(5001)).to.be.revertedWith("Insufficient amount of tokens");
    });

});
