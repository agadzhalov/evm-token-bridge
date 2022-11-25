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
        const messageHash = ethers.utils.solidityKeccak256(['string'], ["random message"]);
        const arrayfiedHash = ethers.utils.arrayify(messageHash);
        const signature = await owner.signMessage(arrayfiedHash);
        
        const sig = ethers.utils.splitSignature(signature);
        await expect(bridge.connect(addr1).
            claimTokens(token.address, await token.name(), await token.symbol(), TOKEN_AMOUNT, messageHash, sig.v, sig.r, sig.s))
            .to.be.revertedWith("The message was not signed by the caller");
    });

    it("Should deploy new token on Claim one is not existing", async function () {
        const TOKEN_AMOUNT = ethers.utils.parseUnits("5000", 18);
        const messageHash = ethers.utils.solidityKeccak256(['string'], ["random message"]);
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

});
