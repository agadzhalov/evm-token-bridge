// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./BaseToken.sol";
import "hardhat/console.sol";

contract PolygonBridge {

    IERC20 public token;
    mapping(address => bool) internal mapTokenOnPolygon;
    mapping(address => address) internal mapRepresantativeToken; // ethToken -> maticToken

    event DeployedNewToken(string _name, string _symbol, uint _amount);

    function claimTokens(address _tokenAddress, string memory _name, string memory _symbol, uint _amount) external {
        if (isTokenOnPolygon(_tokenAddress)) {
            // mint
            token = IERC20(_tokenAddress);
        } else {
            // deploy new contract
            dpeloyNewToken(_tokenAddress, _name, _symbol, _amount);
        }
    }

    function dpeloyNewToken(address _tokenAddress, string memory _name, string memory _symbol, uint _amount) private {
        token = new BaseToken(string.concat("W", _name), string.concat("W", _symbol), _amount);
        token.transfer(msg.sender, _amount);
        setTokenOnPolygon(_tokenAddress, address(token));
        emit DeployedNewToken(_name, _symbol, _amount);
    }
    
    function setTokenOnPolygon(address _sourceToken, address _targetToken) internal {
        mapTokenOnPolygon[_sourceToken] = true;
        mapRepresantativeToken[_sourceToken] = _targetToken;
    }

    function getRepresentativeToken(address _sourceToken) external view returns(address) {
        return mapRepresantativeToken[_sourceToken];
    }

    function isTokenOnPolygon(address _tokenAddress) public view returns(bool) {
        return mapTokenOnPolygon[_tokenAddress];
    }
    
}