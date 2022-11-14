// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

import "hardhat/console.sol";


contract EthereumToken is ERC20 {

    constructor() ERC20('Ethereum Token', 'ETHTKN') {
        _mint(msg.sender, 10000*10**18);
    }

}