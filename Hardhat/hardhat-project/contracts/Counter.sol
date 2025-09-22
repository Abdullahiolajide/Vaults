// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title A simple counter contract for testing
/// @author Gemini
/// @dev This contract demonstrates basic state variable management and function calls.
contract Counter {
    // A state variable to store the counter's value.
    // The `public` keyword automatically creates a getter function to read this value.
    uint public count;

    // The constructor is executed once when the contract is deployed.
    constructor() {
        count = 0;
    }

    /// @notice Increments the counter by 1.
    /// @dev This is a state-changing function.
    function increment() public {
        count += 1;
    }

    /// @notice Decrements the counter by 1, with a check to prevent it from going below zero.
    /// @dev This is a state-changing function.
    function decrement() public {
        // `require` is used to validate conditions before execution.
        // If the condition is false, the transaction is reverted.
        require(count > 0, "Counter: Cannot decrement below zero");
        count -= 1;
    }
}
