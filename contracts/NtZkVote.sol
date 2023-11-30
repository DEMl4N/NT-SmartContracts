// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "zk-merkle-tree/contracts/ZKTree.sol";
import "@quant-finance/solidity-datetime/contracts/DateTime.sol";

contract NtZkVote is ZKTree {
    struct VotingPeriod {
        uint beginning;
        uint deadline;
    }

    struct CandidateDetail {
        string name;
        string description;
    }

    address public owner;
    mapping(address => bool) public validators;
    mapping(uint256 => bool) uniqueHashes;
    uint8 numOptions = 0;
    mapping(uint => uint) optionCounter;
    CandidateDetail[] public candidates;

    VotingPeriod public votingPeriod;

    event candidateRegistered(uint8 indexed option, CandidateDetail detail);

    constructor(
        uint32 _levels,
        IHasher _hasher,
        IVerifier _verifier,
        uint8 _numOptions
    ) ZKTree(_levels, _hasher, _verifier) {
        owner = msg.sender;
        numOptions = _numOptions;
    }

    function setBeginning(uint16 year, uint8 month, uint8 day, uint8 hour) public returns (bool) {
        require(msg.sender == owner, "Only owner can add candidate!");
        require(votingPeriod.beginning == 0, "Already set");
        votingPeriod.beginning = DateTime.timestampFromDateTime(year, month, day, hour, 0, 0);
        return true;
    }

    function setDeadline(uint16 year, uint8 month, uint8 day, uint8 hour) public returns (bool) {
        require(msg.sender == owner, "Only owner can add candidate!");
        require(votingPeriod.deadline == 0, "Already set");
        votingPeriod.deadline = DateTime.timestampFromDateTime(year, month, day, hour, 0, 0);
        return true;
    }

    function registerCandidate(string memory _name, string memory _description) public returns (bool) {
        require(msg.sender == owner, "Only owner can add candidate!");
        require(block.timestamp < votingPeriod.beginning, "Too late to register a candidate");
        CandidateDetail memory newCandidate = CandidateDetail(_name, _description);
        candidates.push(newCandidate);
        optionCounter[numOptions] = 0;

        emit candidateRegistered(numOptions++, newCandidate);

        return true;
    }

    function registerValidator(address _validator) external {
        require(msg.sender == owner, "Only owner can add validator!");
        validators[_validator] = true;
    }

    function registerCommitment(
        uint256 _uniqueHash,
        uint256 _commitment
    ) external {
        require(validators[msg.sender], "Only validator can commit!");
        require(
            !uniqueHashes[_uniqueHash],
            "This unique hash is already used!"
        );
        _commit(bytes32(_commitment));
        uniqueHashes[_uniqueHash] = true;
    }

    function vote(
        uint _option,
        uint256 _nullifier,
        uint256 _root,
        uint[2] memory _proof_a,
        uint[2][2] memory _proof_b,
        uint[2] memory _proof_c
    ) external {
        require(_option <= numOptions, "Invalid option!");
        _nullify(
            bytes32(_nullifier),
            bytes32(_root),
            _proof_a,
            _proof_b,
            _proof_c
        );
        optionCounter[_option] = optionCounter[_option] + 1;
    }

    function getOptionCounter(uint _option) external view returns (uint) {
        return optionCounter[_option];
    }
}