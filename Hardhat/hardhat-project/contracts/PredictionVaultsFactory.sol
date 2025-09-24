// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./PredictionVault.sol";

/// @title A factory contract to deploy new prediction vaults.
/// @author Gemini
/// @dev This contract creates and keeps a registry of all prediction vault contracts.
contract PredictionVaultsFactory {
    // An array to store the addresses of all deployed prediction vaults.
    address[] public allVaults;

    // A mapping to track the vaults created by a specific address.
    mapping(address => address[]) public vaultsByCreator;

    // Event emitted when a new vault is created.
    event VaultCreated(address indexed newVaultAddress, address indexed creator);

    /// @notice Creates a new prediction vault.
    /// @dev This function deploys a new `PredictionVault` contract with the given parameters.
    /// @param _question The prediction question.
    /// @param _teamA The first possible outcome.
    /// @param _teamB The second possible outcome.
    function createVault(string memory _question, string memory _teamA, string memory _teamB) public {
        // Create the new vault contract and pass the three required constructor arguments.
        PredictionVault newVault = new PredictionVault(_question, _teamA, _teamB);

        // Store the address of the new vault.
        allVaults.push(address(newVault));
        vaultsByCreator[msg.sender].push(address(newVault));

        // Emit an event to log the creation of the new vault.
        emit VaultCreated(address(newVault), msg.sender);
    }
    function getAllVaults() public view returns (address[] memory) {
    return allVaults;
}
}
