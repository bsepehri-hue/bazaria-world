// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
}

contract BazariaEscrowVault {
    address public bazToken;
    address public serverSigner;
    address public owner;

    constructor(address _bazToken, address _serverSigner) {
        bazToken = _bazToken;
        serverSigner = _serverSigner;
        owner = msg.sender;
    }
    
    // ... vault / escrow logic goes here
}
