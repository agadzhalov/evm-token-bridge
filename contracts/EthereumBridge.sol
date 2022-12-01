// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

import "hardhat/console.sol";
import "./BaseToken.sol";

contract EthereumBridge {

    mapping(address => mapping(address => uint256)) private accountBalances; // account -> token -> amount 

    event LockTokens(address _sourceToken, address _spender, uint256 _amount);
    event UnlockTokens(string name, string symbol, uint256 _amount);

    function lock(address _sourceToken, uint256 _amount) external {
        BaseToken token = BaseToken(_sourceToken);
        require(token.balanceOf(msg.sender) >= _amount, "Insufficient amount of tokens");
        token.transferFrom(msg.sender, address(this), _amount);
        accountBalances[msg.sender][_sourceToken] += _amount;
        emit LockTokens(_sourceToken, msg.sender, _amount);
    }

    function unlock(address _targetToken, uint256 _amount) external {
        require(accountBalances[msg.sender][_targetToken] >= _amount, "Insufficient amount of locked tokens");
        accountBalances[msg.sender][_targetToken] -= _amount;
        BaseToken token = BaseToken(_targetToken);
        token.transfer(msg.sender, _amount);
        emit UnlockTokens(token.name(), token.symbol(), _amount);
    }

}