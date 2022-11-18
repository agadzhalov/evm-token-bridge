// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

import "hardhat/console.sol";
import "./EthereumToken.sol";

contract ERC20TokenFactory {
    
    event DeployedEvent(address addr, uint256 salt);

    function getByteCode(string memory _name, string memory _symbol, uint256 _amount) public pure returns (bytes memory) {
        bytes memory bytecode = type(EthereumToken).creationCode;
        return abi.encodePacked(bytecode, abi.encode(_name, _symbol, _amount));
    }

    function getAddress(bytes memory bytecode, uint _salt) public view returns (address) {
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff),
                address(this),
                _salt,
                keccak256(bytecode)
            )
        );
        return address(uint160(uint256(hash)));
    }

    function deploy(bytes memory bytecode, uint _salt) public payable {
       address addr;

       assembly {
        addr := create2(
            callvalue(),
            add(bytecode, 0x20),
            mload(bytecode),
            _salt
        )
        if iszero(extcodesize(addr)) {
            revert(0, 0)
        }
        
       }
       emit DeployedEvent(addr, _salt);
    }
}