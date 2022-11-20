// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

import "hardhat/console.sol";

contract EthereumBridge {

    address internal owner;
    IERC20 public token;
    mapping(address => mapping(address => uint)) private ownerToTokenToAmount;

    event DepositTokens(address _from, address _recipient, uint _amount);

    constructor() {
        owner = msg.sender;
    }

    function depositERC20(address _tokenAddress, uint _amount) external {
        token = IERC20(_tokenAddress);
        require(token.balanceOf(msg.sender) >= _amount, "Insufficient amount of tokens");
        token.transferFrom(msg.sender, address(this), _amount);
        emit DepositTokens(address(this), msg.sender, _amount);
    }

}