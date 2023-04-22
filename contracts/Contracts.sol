// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.9.0;

contract SimpleStorage {
    uint storedData;

    function set(uint x) public {
        storedData = x;
    }

    function get() public view returns (uint) {
        return storedData;
    }
}

contract BusinessNetworkContract {
    struct Transaction {
        address sender;
        address receiver;
        int amount;
        string subject;
        uint timestamp;
    }

    struct Corp {
        address id;
        string name;
        int balance;
        Transaction[] transactions;
        bool isParticipant;
    }

    mapping(address=>Corp) corps;

    uint totalParticipants = 0;

    modifier onlyParticipant() {
        require(isParticipant());
        _;
    }

    function isParticipant() public view returns (bool) {
        if(corps[msg.sender].isParticipant == true) {
            return true;
        } else {
            return false;
        }
    }

    function joinNetwork(int balance, string memory name) public {
        Transaction[] memory emptyTransactionArray;
        corps[msg.sender] = Corp(msg.sender, name, balance, emptyTransactionArray, true);
        totalParticipants++;
    }

    function leaveNetwork() public onlyParticipant {
        delete corps[msg.sender];
        totalParticipants--;
    }

    function getMyCorpDetails() public view onlyParticipant returns (Corp memory) {
        return corps[msg.sender];
    }

    function setName(string memory name) public onlyParticipant {
        corps[msg.sender].name = name;
    }

    function addAmountToBalance(address id, int x) internal {
        corps[id].balance += x;
    }

    function addTransaction(address receiver, int amount, string memory subject, uint timestamp) public onlyParticipant {
        addAmountToBalance(msg.sender, -amount);
        addAmountToBalance(receiver, amount);
        corps[msg.sender].transactions.push(Transaction(msg.sender, receiver, amount, subject, timestamp));
        corps[receiver].transactions.push(Transaction(msg.sender, receiver, amount, subject, timestamp));
    }
}
