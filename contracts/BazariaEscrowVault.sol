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

    event Deposited(address indexed user, uint256 amount, bytes32 indexed referenceId);
    event Released(address indexed user, uint256 amount, bytes32 indexed referenceId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    constructor(address _bazToken, address _serverSigner) {
        require(_bazToken != address(0), "Invalid token address");
        require(_serverSigner != address(0), "Invalid signer address");
        bazToken = _bazToken;
        serverSigner = _serverSigner;
        owner = msg.sender;
    }

    // We can expand our escrow locking/releasing logic functions right here tonight!
}
