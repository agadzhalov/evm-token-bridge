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

        console.log("Owner: " + owner.address);

        ethTokenFactory = await ethers.getContractFactory("EthereumToken");
        ethToken = await ethTokenFactory.deploy();
        await ethToken.deployed();

        console.log("EthToken: " + ethToken.address);

        ethBridgeFactory = await ethers.getContractFactory("EthereumBridge");
        ethBridge = await ethBridgeFactory.deploy(ethToken.address);
        await ethBridge.deployed();

        console.log("EthBridge: " + ethBridge.address);
    });

    it("Should deposit 4700 ERC20 tokens to EthereumBridge", async function () {
        await ethToken.approve(ethBridge.address, ethers.utils.parseUnits('10000', 18));
        console.log("Allowance: " + await ethToken.allowance(owner.address, ethBridge.address));
        await ethBridge.depositERC20(4700);
        console.log("Balance Of Bridge: " + await ethToken.balanceOf(ethBridge.address));
        console.log("Balance Of Owner: " + await ethToken.balanceOf(owner.address));

        expect(await ethToken.balanceOf(ethBridge.address)).to.equal(ethers.utils.parseUnits('4700', 18));
        expect(await ethToken.balanceOf(owner.address)).to.equal(ethers.utils.parseUnits('5300', 18));
    });

});
