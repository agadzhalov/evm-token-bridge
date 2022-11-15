// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
pragma abicoder v2;

import "hardhat/console.sol";

contract PolygonBridge {

    mapping(address => bool) internal mapTokenOnPolygon;

    function setTokenOnPolygon(address _tokenAddress) internal {
        mapTokenOnPolygon[_tokenAddress] = true;
    }

    function isTokenOnPolygon(address _tokenAddress) public view returns(bool) {
        return mapTokenOnPolygon[_tokenAddress];
    }

}