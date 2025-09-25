// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title A decentralized prediction vault
contract PredictionVault {
    // --- State Variables ---
    string public question;
    address public creator;
    string public teamA;
    string public teamB;
    string public category; // NEW: category

    // Mapping to track the amount staked by each address on each outcome
    mapping(address => uint) public stakesA;
    mapping(address => uint) public stakesB;

    // The total amount staked on each outcome
    uint public poolA;
    uint public poolB;
    uint public totalPool;

    bool public isResolved;
    string public winningOutcome;

    mapping(address => bool) public hasClaimed;

    // --- Events ---
    event BetPlaced(address indexed staker, string outcome, uint amount);
    event VaultResolved(string winningOutcome);
    event Payout(address indexed winner, uint amount);
    event VaultFunded(address indexed funder, uint amount); // NEW

    // --- Constructor ---
    constructor(
        string memory _question,
        string memory _teamA,
        string memory _teamB,
        string memory _category // NEW
    ) {
        question = _question;
        creator = msg.sender;
        teamA = _teamA;
        teamB = _teamB;
        category = _category; // store category
        isResolved = false;
    }

    // --- Funding ---
    /// @notice Allows vault to receive initial BDAG funding from factory or creator.
    receive() external payable {
        require(!isResolved, "Vault already resolved.");
        require(msg.value > 0, "Must send BDAG");

        totalPool += msg.value; // counts as unallocated liquidity
        emit VaultFunded(msg.sender, msg.value);
    }

    // --- Core Functions ---
    function placeBet(string memory _outcome) public payable {
        require(!isResolved, "Vault has already been resolved.");
        require(msg.value > 0, "Bet amount must be greater than zero.");
        
        if (keccak256(abi.encodePacked(_outcome)) == keccak256(abi.encodePacked(teamA))) {
            stakesA[msg.sender] += msg.value;
            poolA += msg.value;
        } else if (keccak256(abi.encodePacked(_outcome)) == keccak256(abi.encodePacked(teamB))) {
            stakesB[msg.sender] += msg.value;
            poolB += msg.value;
        } else {
            revert("Invalid outcome. Please bet on either teamA or teamB.");
        }

        emit BetPlaced(msg.sender, _outcome, msg.value);
    }

    function resolveVault(string memory _winningOutcome) public {
        require(msg.sender == creator, "Only the creator can resolve the vault.");
        require(!isResolved, "Vault has already been resolved.");
        
        totalPool = poolA + poolB + totalPool; // include funding + bets

        isResolved = true;
        winningOutcome = _winningOutcome;

        emit VaultResolved(winningOutcome);
    }

    function claim() public {
        require(isResolved, "Vault is not yet resolved.");
        require(!hasClaimed[msg.sender], "Already claimed.");

        uint winningPool;
        uint userStake;
        
        if (keccak256(abi.encodePacked(winningOutcome)) == keccak256(abi.encodePacked(teamA))) {
            require(stakesA[msg.sender] > 0, "No winning bet.");
            winningPool = poolA;
            userStake = stakesA[msg.sender];
        } else if (keccak256(abi.encodePacked(winningOutcome)) == keccak256(abi.encodePacked(teamB))) {
            require(stakesB[msg.sender] > 0, "No winning bet.");
            winningPool = poolB;
            userStake = stakesB[msg.sender];
        } else {
            revert("Invalid winning outcome.");
        }

        uint payout = (userStake * totalPool) / winningPool;
        hasClaimed[msg.sender] = true;
        
        (bool success,) = msg.sender.call{value: payout}("");
        require(success, "Payout failed.");

        emit Payout(msg.sender, payout);
    }
}
