// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
pragma abicoder v2;

import "hardhat/console.sol";

contract PolygonBridge {

    mapping(address => bool) internal mapTokenOnPolygon;
    mapping(address => address) internal mapRepresantativeToken; // ethToken -> maticToken

    function setTokenOnPolygon(address _sourceToken, address _targetToken) external {
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