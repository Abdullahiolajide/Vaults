// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title A decentralized prediction vault
/// @author Gemini
/// @dev This contract handles a single prediction event, managing stakes and payouts.
contract PredictionVault {
    // --- State Variables ---
    string public question;
    address public creator;
    string public teamA;
    string public teamB;

    // Mapping to track the amount staked by each address on each outcome
    mapping(address => uint) public stakesA;
    mapping(address => uint) public stakesB;

    // The total amount staked on each outcome
    uint public poolA;
    uint public poolB;
    uint public totalPool;

    bool public isResolved;
    string public winningOutcome;

    // A mapping to track if a winner has already claimed their winnings.
    mapping(address => bool) public hasClaimed;

    // --- Events ---
    // A new event to log when a bet is placed.
    // The `indexed` keyword allows us to efficiently search for events by this value.
    event BetPlaced(address indexed staker, string outcome, uint amount);
    event VaultResolved(string winningOutcome);
    event Payout(address indexed winner, uint amount);

    // --- Constructor ---
    constructor(string memory _question, string memory _teamA, string memory _teamB) {
        question = _question;
        creator = msg.sender;
        teamA = _teamA;
        teamB = _teamB;
        isResolved = false;
    }

    // --- Core Functions ---
    /// @notice Allows a user to place a bet on a specified outcome.
    /// @dev This is a payable function, so it can receive BDAG.
    /// @param _outcome The outcome the user is betting on (e.g., "Yes" or "No").
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

        // Emit the event to log the bet.
        emit BetPlaced(msg.sender, _outcome, msg.value);
    }

    /// @notice Resolves the vault.
    /// @dev This can only be called by the vault's creator.
    /// @param _winningOutcome The final outcome (e.g., "Yes" or "No").
    function resolveVault(string memory _winningOutcome) public {
        require(msg.sender == creator, "Only the creator can resolve the vault.");
        require(!isResolved, "Vault has already been resolved.");
        
        // This is a crucial step: store the total pool amount so we can calculate payouts later.
        totalPool = poolA + poolB;

        isResolved = true;
        winningOutcome = _winningOutcome;

        // Emit an event to log the resolution
        emit VaultResolved(winningOutcome);
    }

    /// @notice Allows a winner to claim their winnings.
    /// @dev This function calculates and sends the proportional payout to the winner.
    function claim() public {
        // First, check if the vault has been resolved.
        require(isResolved, "Vault is not yet resolved.");
        // Next, check that the user has not already claimed.
        require(!hasClaimed[msg.sender], "You have already claimed your winnings.");

        uint winningPool;
        uint userStake;
        
        // Check which team won and get the relevant pool and user stake
        if (keccak256(abi.encodePacked(winningOutcome)) == keccak256(abi.encodePacked(teamA))) {
            require(stakesA[msg.sender] > 0, "You did not bet on the winning outcome.");
            winningPool = poolA;
            userStake = stakesA[msg.sender];
        } else if (keccak256(abi.encodePacked(winningOutcome)) == keccak256(abi.encodePacked(teamB))) {
            require(stakesB[msg.sender] > 0, "You did not bet on the winning outcome.");
            winningPool = poolB;
            userStake = stakesB[msg.sender];
        } else {
            revert("Invalid winning outcome.");
        }

        // The payout calculation is now much cleaner and more efficient.
        // It's the user's stake divided by the total winning pool, multiplied by the entire pool.
        uint payout = (userStake * totalPool) / winningPool;
        
        // Mark that the user has claimed to prevent double-claiming.
        hasClaimed[msg.sender] = true;
        
        // Send the BDAG to the winner.
        (bool success,) = msg.sender.call{value: payout}("");
        require(success, "Payout failed.");

        emit Payout(msg.sender, payout);
    }
}
