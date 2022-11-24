import { expect } from "chai";
import { ethers } from "hardhat";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BaseToken, Bridge } from "../typechain-types";
import BaseTokenJSON from "./../artifacts/contracts/BaseToken.sol/BaseToken.json";

describe("Bridge", function () {

    let token: BaseToken;

    let bridgeFactory: any;
    let bridge: Bridge;

    let owner: SignerWithAddress;
    let addr1: SignerWithAddress;

    beforeEach(async () => {
        [owner, addr1] = await ethers.getSigners();

        const ERC20Contract = await ethers.getContractFactory("BaseToken");
        token = await ERC20Contract.deploy("Gosho", "GOTKN", ethers.utils.parseUnits("10000", 18));
        await token.deployed();

        bridgeFactory = await ethers.getContractFactory("Bridge");
        bridge = await bridgeFactory.deploy();
        await bridge.deployed();
    });
    
    it("Should lock 5000 tokens and emit event", async function () {
        const TOKEN_AMOUNT = ethers.utils.parseUnits("5000", 18);
        token.approve(bridge.address, TOKEN_AMOUNT);

        const lockTx = await bridge.lock(token.address, TOKEN_AMOUNT);
        lockTx.wait();

        expect(await token.balanceOf(bridge.address)).to.equal(TOKEN_AMOUNT);
        await expect(lockTx).to.emit(bridge, 'LockTokens').withArgs(token.address, owner.address, TOKEN_AMOUNT);
    });

    it("Should lock 5000 tokens and emit event", async function () {
        const MORE_TOKEN_AMOUNT = ethers.utils.parseUnits("10001", 18);
        token.approve(bridge.address, MORE_TOKEN_AMOUNT);
        await expect(bridge.lock(token.address, MORE_TOKEN_AMOUNT)).to.be.revertedWith("Insufficient amount of tokens");
    });
    
    it("Should lock and unlock 5000 tokens without minting", async function () {
        const TOKEN_AMOUNT = ethers.utils.parseUnits("5000", 18);
        token.approve(bridge.address, TOKEN_AMOUNT);

        const lockTx = await bridge.lock(token.address, TOKEN_AMOUNT);
        lockTx.wait();

        const unlockTx = await bridge.unlock(token.address, TOKEN_AMOUNT);
        unlockTx.wait();

        expect(await token.balanceOf(bridge.address)).to.equal(ethers.utils.parseUnits("0", 18));
        expect(await token.balanceOf(owner.address)).to.equal(ethers.utils.parseUnits("10000", 18));
    });

    it.only("Should throw when trying to claim tokens with an unsigned/wrong message", async function () {
        const TOKEN_AMOUNT = ethers.utils.parseUnits("5000", 18);
        const messageHash = ethers.utils.solidityKeccak256(['string'], ["random message"]);
        const arrayfiedHash = ethers.utils.arrayify(messageHash);
        const signature = await owner.signMessage(arrayfiedHash);
        
        const sig = ethers.utils.splitSignature(signature);
        await expect(bridge.connect(addr1).
            claimTokens(token.address, await token.name(), await token.symbol(), TOKEN_AMOUNT, messageHash, sig.v, sig.r, sig.s))
            .to.be.revertedWith("The message was not signed by the caller");
        //const claimTx = 
    });

});
