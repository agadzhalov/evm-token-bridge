// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract BaseToken is ERC20 {

    constructor(string memory _name, string memory _symbol, uint _amount) ERC20(_name, _symbol) {
        _mint(msg.sender, _amount);
    }

    function mint(uint _amount) external {
        _mint(msg.sender, _amount);
    }

    function burn(uint _amout) external {
        _burn(msg.sender, _amout);
    }

}