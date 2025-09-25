// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./PredictionVault.sol";

contract VaultFactory {
    address[] public allVaults;
    mapping(address => address[]) public vaultsByCreator;

    event VaultCreated(address indexed vault, address indexed creator, string category, uint256 initialFunding);

    function createVault(
    string memory _question,
    string memory _teamA,
    string memory _teamB,
    string memory _category
) public payable {
    PredictionVault newVault = new PredictionVault(_question, _teamA, _teamB, _category);

    // forward initial liquidity (if any) to the vault
    if (msg.value > 0) {
        (bool success,) = payable(address(newVault)).call{value: msg.value}("");
        require(success, "Liquidity funding failed");
    }

    allVaults.push(address(newVault));
    vaultsByCreator[msg.sender].push(address(newVault));

    emit VaultCreated(address(newVault), msg.sender);
}

    function getAllVaults() public view returns (address[] memory) {
        return allVaults;
    }

    function getVaultsByCreator(address _creator) public view returns (address[] memory) {
        return vaultsByCreator[_creator];
    }
}
