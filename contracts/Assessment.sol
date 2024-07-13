// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public admin;
    uint256 public funds;

    event Deposited(uint256 amount);
    event Withdrawn(uint256 amount);
    event AdminChanged(address indexed oldAdmin, address indexed newAdmin);

    constructor(uint initialFunds) payable {
        admin = payable(msg.sender);
        funds = initialFunds;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Caller is not the admin");
        _;
    }

    function getFunds() public view returns(uint256) {
        return funds;
    }

    function addFunds(uint256 amount) public payable onlyAdmin {
        uint previousFunds = funds;
        funds += amount;
        assert(funds == previousFunds + amount);
        emit Deposited(amount);
    }

    error InsufficientFunds(uint256 availableFunds, uint256 requestedAmount);

    function removeFunds(uint256 amount) public onlyAdmin {
        uint previousFunds = funds;
        if (funds < amount) {
            revert InsufficientFunds({
                availableFunds: funds,
                requestedAmount: amount
            });
        }
        funds -= amount;
        assert(funds == previousFunds - amount);
        emit Withdrawn(amount);
    }

    function changeAdmin(address payable newAdmin) public onlyAdmin {
        require(newAdmin != address(0), "New admin address is zero");
        emit AdminChanged(admin, newAdmin);
        admin = newAdmin;
    }
}
