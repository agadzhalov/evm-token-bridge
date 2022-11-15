// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

import "hardhat/console.sol";


contract PolygonToken is ERC20 {

    constructor(string memory _name, string memory _symbol) ERC20(string.concat("w", _name), string.concat("w", _symbol)) {}

    function mint(uint _amount) external {
        _mint(msg.sender, _amount);
    }

}