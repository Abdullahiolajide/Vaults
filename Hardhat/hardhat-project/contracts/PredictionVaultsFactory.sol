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

    // Optional: mapping to keep vault category
    mapping(address => string) public vaultCategory;

    // Event emitted when a new vault is created.
    event VaultCreated(
        address indexed newVaultAddress,
        address indexed creator,
        string category,
        uint initialLiquidity
    );

    /// @notice Creates a new prediction vault.
    /// @dev This function deploys a new `PredictionVault` contract with the given parameters.
    /// @param _question The prediction question.
    /// @param _teamA The first possible outcome.
    /// @param _teamB The second possible outcome.
    /// @param _category The category of the vault (e.g., Sports, Celebrities, etc.).
    function createVault(
        string memory _question,
        string memory _teamA,
        string memory _teamB,
        string memory _category
    ) public payable {
        // Deploy a new vault
        PredictionVault newVault = new PredictionVault(_question, _teamA, _teamB, _category);

        // Store the address of the new vault
        allVaults.push(address(newVault));
        vaultsByCreator[msg.sender].push(address(newVault));

        // Save category for this vault
        vaultCategory[address(newVault)] = _category;

        // If creator wants to add initial liquidity
        if (msg.value > 0) {
            (bool success,) = address(newVault).call{value: msg.value}("");
            require(success, "Funding vault failed");
        }

        // Emit the event
        emit VaultCreated(address(newVault), msg.sender, _category, msg.value);
    }

    /// @notice Returns all deployed vault addresses.
    function getAllVaults() public view returns (address[] memory) {
        return allVaults;
    }

    /// @notice Returns all vaults created by a given creator.
    function getVaultsByCreator(address _creator) public view returns (address[] memory) {
        return vaultsByCreator[_creator];
    }

    /// @notice Get the category of a vault.
    function getVaultCategory(address _vault) public view returns (string memory) {
        return vaultCategory[_vault];
    }
}
