pragma solidity ^0.8.0;

contract Poll {
    struct Option {
        uint id;
        string name;
    }
    
    Option[] public options;
    mapping(uint => uint) public votes;
    mapping(address => bool) public voters;
    
    event OptionAdded(uint optionId);
    event Vote(uint indexed optionId);
    event WinnerDeclared(uint optionId);

    function getOptionsLength() public view returns (uint) {
        return options.length;
    }
    
    function addOption(string memory _name) public {
        uint optionId = options.length;
        options.push(Option(optionId, _name));
        votes[optionId] = 0;
        emit OptionAdded(optionId);
    }
    
    function vote(uint _optionId) public {
        require(!voters[msg.sender], "Address has already voted.");
        require(_optionId < options.length, "Invalid option.");
        
        voters[msg.sender] = true;
        votes[_optionId]++;
        
        emit Vote(_optionId);
    }
    
    function countVotesAndDeclareWinner() public returns (string memory) {
        uint winningOptionId;
        uint maxVotes = 0;
        
        for (uint i = 0; i < options.length; i++) {
            if (votes[i] > maxVotes) {
                maxVotes = votes[i];
                winningOptionId = i;
            }
        }
        
        string memory winnerName = options[winningOptionId].name;
        emit WinnerDeclared(winningOptionId);
        return winnerName;
    }
}