// contracts/DNAStorage.sol
pragma solidity ^0.8.0;

contract DNAStorage {
    struct Request {
        address user;
        string dataHash;
        string status;
    }

    mapping(uint => Request) public requests;
    uint public requestCount;

    function createRequest(string memory dataHash) public {
        requests[requestCount] = Request(msg.sender, dataHash, "Pending");
        requestCount++;
    }

    function updateRequest(uint requestId, string memory status) public {
        Request storage request = requests[requestId];
        require(msg.sender == request.user, "Not authorized");
        request.status = status;
    }
}
