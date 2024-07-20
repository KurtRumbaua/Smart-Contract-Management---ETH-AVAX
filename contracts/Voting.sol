// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Voting {
    address public admin;
    string[] public options;
    mapping(string => uint256) public votes;
    mapping(address => bool) public hasVoted;

    event OptionAdded(string option);
    event Voted(address voter, string option);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Caller is not the admin");
        _;
    }

    function addOption(string memory option) public onlyAdmin {
        options.push(option);
        votes[option] = 0;
        emit OptionAdded(option);
    }

    function vote(string memory option) public {
        require(!hasVoted[msg.sender], "Caller has already voted");
        require(bytes(option).length > 0, "Option cannot be empty");

        bool validOption = false;
        for (uint256 i = 0; i < options.length; i++) {
            if (keccak256(bytes(options[i])) == keccak256(bytes(option))) {
                validOption = true;
                break;
            }
        }
        require(validOption, "Option does not exist");

        votes[option]++;
        hasVoted[msg.sender] = true;
        emit Voted(msg.sender, option);
    }

    function getVotes(string memory option) public view returns (uint256) {
        return votes[option];
    }

    function getOptions() public view returns (string[] memory) {
        return options;
    }
}
