import { expect } from "chai";
import { ethers } from "hardhat";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BaseToken, EthereumBridge, PolygonBridge } from "../typechain-types";
import BaseTokenJSON from "./../artifacts/contracts/BaseToken.sol/BaseToken.json";

describe("PolygonBridge", function () {

    let ethereumContract: BaseToken;

    let polygonBridgeFactory: any;
    let polygonBridge: PolygonBridge;

    let owner: SignerWithAddress;

    beforeEach(async () => {
        [owner] = await ethers.getSigners();

        const ERC20Contract = await ethers.getContractFactory("BaseToken");
        ethereumContract = await ERC20Contract.deploy("EthereumToken", "ETHTKN", ethers.utils.parseUnits("10000", 18));
        await ethereumContract.deployed();

        polygonBridgeFactory = await ethers.getContractFactory("PolygonBridge");
        polygonBridge = await polygonBridgeFactory.deploy();
        await polygonBridge.deployed();
    });

    it.only("Should claim", async function () {
        await polygonBridge.claimTokens(ethereumContract.address, "EthereumToken", "ETHTKN", ethers.utils.parseUnits("10000", 18));
        const polygonTokenAddress: string = await polygonBridge.token();
        const polygonToken: BaseToken = new ethers.Contract(polygonTokenAddress, BaseTokenJSON.abi, owner);
        console.log(await polygonToken.name());
    });


});
