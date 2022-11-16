// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

import "./EthereumToken.sol";
import "hardhat/console.sol";

contract EthereumBridge {

    address internal owner;
    EthereumToken public ETHToken;

    event DepositTokens(address _from, address _recipient, uint _amount);

    constructor(address _tokenAddress) {
        ETHToken = EthereumToken(_tokenAddress);
        owner = msg.sender;
    }

    function depositERC20(uint _amount) external {
        uint amount = _amount * 10 ** 18;
        require(ETHToken.balanceOf(msg.sender) >= amount, "Insufficient amount of tokens");
        ETHToken.transferFrom(msg.sender, address(this), amount);
        emit DepositTokens(address(this), msg.sender, amount);
    }

}