import { expect } from "chai";
import { ethers } from "hardhat";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BaseToken, EthereumBridge, PolygonBridge } from "../typechain-types";
import BaseTokenJSON from "./../artifacts/contracts/BaseToken.sol/BaseToken.json";

describe("PolygonBridge", function () {

    let ethereumToken: BaseToken;

    let polygonBridgeFactory: any;
    let polygonBridge: PolygonBridge;

    let owner: SignerWithAddress;

    beforeEach(async () => {
        [owner] = await ethers.getSigners();

        const ERC20Contract = await ethers.getContractFactory("BaseToken");
        ethereumToken = await ERC20Contract.deploy("EthereumToken", "ETHTKN", ethers.utils.parseUnits("10000", 18));
        await ethereumToken.deployed();

        polygonBridgeFactory = await ethers.getContractFactory("PolygonBridge");
        polygonBridge = await polygonBridgeFactory.deploy();
        await polygonBridge.deployed();
    });

    it("Should mint and increase if token already exists", async function () {
        const claimDeployTx = await polygonBridge.claimTokens(ethereumToken.address, await ethereumToken.name(), await ethereumToken.symbol(), ethers.utils.parseUnits("10000", 18));
        claimDeployTx.wait();

        const polygonTokenAddress: string = await polygonBridge.token();
        const polygonToken: BaseToken = new ethers.Contract(polygonTokenAddress, BaseTokenJSON.abi, owner);
        
        const claimMintTx = await polygonBridge.claimTokens(ethereumToken.address, await ethereumToken.name(), await ethereumToken.symbol(), ethers.utils.parseUnits("5000", 18));
        claimMintTx.wait();
        
        expect(await polygonToken.balanceOf(owner.address)).to.equal(ethers.utils.parseUnits("15000", 18));
    });

    it("Should deploy new token and mint new tokens", async function () {
        await polygonBridge.claimTokens(ethereumToken.address, "EthereumToken", "ETHTKN", ethers.utils.parseUnits("10000", 18));
        const polygonTokenAddress: string = await polygonBridge.token();
        const polygonToken: BaseToken = new ethers.Contract(polygonTokenAddress, BaseTokenJSON.abi, owner);
        expect(await polygonToken.balanceOf(owner.address)).to.equal(ethers.utils.parseUnits("10000", 18));
    });


});