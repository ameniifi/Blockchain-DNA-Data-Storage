// utils/dnaStorage.js
import web3 from './web3';
import DNAStorage from '../build/contracts/DNAStorage.json';

const CONTRACT_ADDRESS = "0x5d825b652B7e226784536f63c890aB8671C3DE14"; 

const instance = new web3.eth.Contract(
  DNAStorage.abi,
  CONTRACT_ADDRESS
);

export default instance;
