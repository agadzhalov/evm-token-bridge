import { expect } from "chai";
import { ethers } from "hardhat";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BaseToken } from "../typechain-types";
import { EthereumBridge } from "../typechain-types/contracts/EthereumBridge.sol";

describe("EthereumBridge", function () {

    let token: BaseToken;

    let bridgeFactory: any;
    let bridge: EthereumBridge;

    let owner: SignerWithAddress;
    let addr1: SignerWithAddress;

    beforeEach(async () => {
        [owner, addr1] = await ethers.getSigners();

        const ERC20Contract = await ethers.getContractFactory("BaseToken");
        token = await ERC20Contract.deploy("Gosho", "GOTKN", ethers.utils.parseUnits("10000", 18));
        await token.deployed();

        bridgeFactory = await ethers.getContractFactory("EthereumBridge");
        bridge = await bridgeFactory.deploy();
        await bridge.deployed();
    });
    
    it("Should lock 5000 tokens and emit event", async function () {
        const TOKEN_AMOUNT = ethers.utils.parseUnits("5000", 18);``
        token.approve(bridge.address, TOKEN_AMOUNT);

        const lockTx = await bridge.lock(token.address, TOKEN_AMOUNT);
        lockTx.wait();

        expect(await token.balanceOf(bridge.address)).to.equal(TOKEN_AMOUNT);
        await expect(lockTx).to.emit(bridge, 'LockTokens').withArgs(token.address, owner.address, TOKEN_AMOUNT);
    });

    it("Should throw when trying to lock more tokens than available", async function () {
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

    it("Should throw when trying to unlock more tokens than available", async function () {
        const TOKEN_AMOUNT = ethers.utils.parseUnits("5000", 18);
        token.approve(bridge.address, TOKEN_AMOUNT);

        const lockTx = await bridge.lock(token.address, TOKEN_AMOUNT);
        lockTx.wait();

        const MORE_TOKEN_AMOUNT = ethers.utils.parseUnits("6000", 18);
        await expect(bridge.unlock(token.address, MORE_TOKEN_AMOUNT)).to.be.revertedWith("Insufficient amount of locked tokens");
    });

});
