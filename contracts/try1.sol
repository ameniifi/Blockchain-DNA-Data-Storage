// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract try1 {
    struct File {
        string filename;
        string ipfsHash;
        bytes binaryData;
        string dnaSequence;
    }

    mapping(string => File) private files;

    // Function to convert binary data to DNA sequence
    function binaryToDNA(bytes memory binaryData) internal pure returns (string memory) {
        bytes memory dnaSequence = new bytes(binaryData.length * 2);
        bytes1[16] memory hexSymbols = [
            bytes1('0'), bytes1('1'), bytes1('2'), bytes1('3'),
            bytes1('4'), bytes1('5'), bytes1('6'), bytes1('7'),
            bytes1('8'), bytes1('9'), bytes1('A'), bytes1('B'),
            bytes1('C'), bytes1('D'), bytes1('E'), bytes1('F')
        ];

        for (uint i = 0; i < binaryData.length; i++) {
            bytes1 b = binaryData[i];
            dnaSequence[2 * i] = hexSymbols[uint8(b >> 4)];
            dnaSequence[2 * i + 1] = hexSymbols[uint8(b & 0x0F)];
        }

        return string(dnaSequence);
    }

    function upload(string memory filename, string memory ipfsHash, bytes memory binaryData) public {
        require(bytes(files[filename].ipfsHash).length == 0, "File already exists");
        string memory dnaSequence = binaryToDNA(binaryData);
        files[filename] = File(filename, ipfsHash, binaryData, dnaSequence);
    } 

    function getIPFSHash(string memory filename) public view returns (string memory) {
        require(bytes(files[filename].ipfsHash).length > 0, "File not found");
        return files[filename].ipfsHash;
    }

    function isFileStored(string memory filename) public view returns (bool) {
        return bytes(files[filename].ipfsHash).length > 0; 
    }

    function getBinaryData(string memory filename) public view returns (bytes memory) {
        require(bytes(files[filename].ipfsHash).length > 0, "File not found");
        return files[filename].binaryData;
    }

    function getDNASequence(string memory filename) public view returns (string memory) {
        require(bytes(files[filename].ipfsHash).length > 0, "File not found");
        return files[filename].dnaSequence;
    }
}

