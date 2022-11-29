import { expect } from "chai";
import { ethers } from "hardhat";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BaseToken, PolygonBridge } from "../typechain-types";
import BaseTokenABI from "./../artifacts/contracts/BaseToken.sol/BaseToken.json";

describe("PolygonBridge", function () {

    let token: BaseToken;

    let bridgeFactory: any;
    let bridge: PolygonBridge;

    let owner: SignerWithAddress;
    let addr1: SignerWithAddress;

    beforeEach(async () => {
        [owner, addr1] = await ethers.getSigners();

        const ERC20Contract = await ethers.getContractFactory("BaseToken");
        token = await ERC20Contract.deploy("Gosho", "GOTKN", ethers.utils.parseUnits("10000", 18));
        await token.deployed();

        bridgeFactory = await ethers.getContractFactory("PolygonBridge");
        bridge = await bridgeFactory.deploy();
        await bridge.deployed();
    });
    
    it("Should throw when trying to claim tokens with an unsigned/wrong message", async function () {
        const TOKEN_AMOUNT = ethers.utils.parseUnits("5000", 18);
        const messageHash = ethers.utils.solidityKeccak256(['string'], ["signed message to claim tokens"]);
        const arrayfiedHash = ethers.utils.arrayify(messageHash);
        const signature = await owner.signMessage(arrayfiedHash);
        
        const sig = ethers.utils.splitSignature(signature);
        await expect(bridge.connect(addr1).
            claimTokens(token.address, await token.name(), await token.symbol(), TOKEN_AMOUNT, messageHash, sig.v, sig.r, sig.s))
            .to.be.revertedWith("The message was not signed by the caller");
    });

    it("Should deploy new token on Claim when one is not existing", async function () {
        const TOKEN_AMOUNT = ethers.utils.parseUnits("5000", 18);
        const messageHash = ethers.utils.solidityKeccak256(['string'], ["signed message to claim tokens"]);
        const arrayfiedHash = ethers.utils.arrayify(messageHash);
        const signature = await owner.signMessage(arrayfiedHash);
        
        const sig = ethers.utils.splitSignature(signature);
        const claimTx = await bridge.claimTokens(token.address, await token.name(), await token.symbol(), TOKEN_AMOUNT, messageHash, sig.v, sig.r, sig.s);
        claimTx.wait();

        // check new token with W (wrapped)
        const wrappedTokenAddress = await bridge.getTargetTokenFromSource(token.address);
        const wrappedToken = new ethers.Contract(wrappedTokenAddress, BaseTokenABI.abi, owner);
        expect(await wrappedToken.name()).to.be.equal("WGosho");
        expect(await wrappedToken.symbol()).to.be.equal("WGOTKN");
        
        // check token transfer 
        expect(await wrappedToken.balanceOf(owner.address)).to.be.equal(TOKEN_AMOUNT);

        // check is token on network
        expect(await bridge.isTokenOnNetwork(token.address)).to.be.equal(true);

        // check event emitted
        await expect(claimTx).to.emit(bridge, 'DeployedNewToken').withArgs("WGosho", "WGOTKN", TOKEN_AMOUNT);
    });

    it("Should mint new tokens on Claim when there's already deployed one", async function () {
        const TOKEN_AMOUNT = ethers.utils.parseUnits("5000", 18);
        const messageHash = ethers.utils.solidityKeccak256(['string'], ["signed message to claim tokens"]);
        const arrayfiedHash = ethers.utils.arrayify(messageHash);
        const signature = await owner.signMessage(arrayfiedHash);
        
        const sig = ethers.utils.splitSignature(signature);
        const claimDeployTx = await bridge.claimTokens(token.address, await token.name(), await token.symbol(), TOKEN_AMOUNT, messageHash, sig.v, sig.r, sig.s);
        claimDeployTx.wait();

        // check new token with W (wrapped)
        const wrappedTokenAddress = await bridge.getTargetTokenFromSource(token.address);
        const wrappedToken = new ethers.Contract(wrappedTokenAddress, BaseTokenABI.abi, owner);
        
        // check mint
        const claimMintTx = await bridge.claimTokens(token.address, await token.name(), await token.symbol(), TOKEN_AMOUNT, messageHash, sig.v, sig.r, sig.s);
        claimMintTx.wait();

        const EXPECTED_TOTAL_AMOUNT = ethers.utils.parseUnits("10000", 18);
        expect(await wrappedToken.totalSupply()).to.be.equal(EXPECTED_TOTAL_AMOUNT);

        // check transfer 
        const EXPECTED_ACCOUNT_AMOUNT = ethers.utils.parseUnits("10000", 18);
        expect(await wrappedToken.balanceOf(owner.address)).to.be.equal(EXPECTED_ACCOUNT_AMOUNT);

        // emit event 
        await expect(claimMintTx).to.emit(bridge, 'MintTokens').withArgs("WGosho", "WGOTKN", TOKEN_AMOUNT);
    });

    it("Should destroy tokens", async function () {
        const TOKEN_AMOUNT = ethers.utils.parseUnits("5000", 18);
        const messageHash = ethers.utils.solidityKeccak256(['string'], ["signed message to claim tokens"]);
        const arrayfiedHash = ethers.utils.arrayify(messageHash);
        const signature = await owner.signMessage(arrayfiedHash);
        
        const sig = ethers.utils.splitSignature(signature);
        const claimDeployTx = await bridge.claimTokens(token.address, await token.name(), await token.symbol(), TOKEN_AMOUNT, messageHash, sig.v, sig.r, sig.s);
        claimDeployTx.wait();

        const wrappedTokenAddress = await bridge.getTargetTokenFromSource(token.address);
        const wrappedToken = new ethers.Contract(wrappedTokenAddress, BaseTokenABI.abi, owner);

        // should throw when trying to burn more tokens than total supply
        const AMOUNT_TO_BE_DELETED = ethers.utils.parseUnits("5001", 18);
        await expect(bridge.destroyTokens(wrappedToken.address, AMOUNT_TO_BE_DELETED))
            .to.be.revertedWith("Can't destroy more tokens than the total supply");

        // should throw if user doesn't have enough tokens to burn
        const AMOUNT_TO_BE_DELETED2 = ethers.utils.parseUnits("500", 18);
        await expect(bridge.connect(addr1).destroyTokens(wrappedToken.address, AMOUNT_TO_BE_DELETED2))
            .to.be.revertedWith("Owner doesn't have enough tokens to destroy");

        // check burn
        const AMOUNT_TO_BE_DESTROYED = ethers.utils.parseUnits("3000", 18);
        await wrappedToken.approve(bridge.address, AMOUNT_TO_BE_DESTROYED);
        const destroyTokensTx = await bridge.destroyTokens(wrappedToken.address, AMOUNT_TO_BE_DESTROYED);

        const AMOUNT_TO_BE_LEFT = ethers.utils.parseUnits("2000", 18);
        expect(await wrappedToken.balanceOf(owner.address)).to.be.equal(AMOUNT_TO_BE_LEFT);

        // check emit event
        await expect(destroyTokensTx).to.emit(bridge, 'BurntTokens').withArgs("WGosho", "WGOTKN", AMOUNT_TO_BE_DESTROYED);
    });

});
