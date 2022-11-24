// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

import "hardhat/console.sol";
import "./BaseToken.sol";

contract Bridge {

    BaseToken public token;

    mapping(address => mapping(address => uint256)) accountBalances; // account -> token -> amount 
    mapping(address => bool) internal mapTokenDeployedOnNetwork;
    mapping(address => address) internal mapSourceToTagetTokens;

    event LockTokens(address _sourceToken, address _spender, uint256 _amount);
    event DeployedNewToken(string _name, string _symbol, uint _amount);
    event MintTokens(string _name, string _symbol, uint _amount);
    event BurntTokens(string _name, string _symbol, uint256 _amount);

    function lock(address _sourceToken, uint256 _amount) external {
        token = BaseToken(_sourceToken);
        require(token.balanceOf(msg.sender) >= _amount, "Insufficient amount of tokens");
        token.transferFrom(msg.sender, address(this), _amount);
        accountBalances[msg.sender][address(token)] += _amount;
        emit LockTokens(_sourceToken, msg.sender, _amount);
    }

    function unlock(address _targetToken, uint256 _amount) external {
        require(accountBalances[msg.sender][_targetToken] >= _amount, "Unable to unlock tokens");
        accountBalances[msg.sender][address(token)] -= _amount;
        token = BaseToken(_targetToken);
        token.transfer(msg.sender, _amount);
    }

    function claimTokens(address _sourceToken, string memory _name, string memory _symbol, uint256 _amount) external {
        if (isTokenOnNetwork(_sourceToken)) {
            mintExistingToken(_sourceToken, _amount);
        } else {
            deployNewToken(_sourceToken, _name, _symbol, _amount);
        }
    }

    function destroyTokens(address _sourceAddress, uint _amount) external {
        token = BaseToken(mapSourceToTagetTokens[_sourceAddress]);
        require(token.totalSupply() >= _amount, "Can't destroy more tokens than the total supply");
        require(token.balanceOf(msg.sender) >= _amount, "Owner doesn't have enough tokens to destroy");
        token.burnFrom(msg.sender, _amount);
        emit BurntTokens(token.name(), token.symbol(), _amount);
    }

    function mintExistingToken(address _sourceToken, uint _amount) private {
        token = BaseToken(mapSourceToTagetTokens[_sourceToken]);
        token.mint(_amount);
        token.transfer(msg.sender, _amount);
        emit MintTokens(token.name(), token.symbol(), _amount);
    }

    function deployNewToken(address _sourceToken, string memory _name, string memory _symbol, uint _amount) private {
        token = new BaseToken(string.concat("W", _name), string.concat("W", _symbol), _amount);
        token.transfer(msg.sender, _amount);
        setTokenOnNetwork(_sourceToken, address(token));
        emit DeployedNewToken(_name, _symbol, _amount);
    }
    
    function setTokenOnNetwork(address _sourceToken, address _targetToken) internal {
        mapTokenDeployedOnNetwork[_sourceToken] = true;
        mapSourceToTagetTokens[_sourceToken] = _targetToken;
    }

    function isTokenOnNetwork(address _tokenAddress) public view returns(bool) {
        return mapTokenDeployedOnNetwork[_tokenAddress];
    }

    function getTargetTokenFromSource(address _sourceAddress) public view returns(address) {
        return mapSourceToTagetTokens[_sourceAddress];
    }

}