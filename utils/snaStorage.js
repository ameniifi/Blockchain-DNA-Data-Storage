// utils/dnaStorage.js
import web3 from './web3';
import DNAStorage from '../build/contracts/DNAStorage.json';

const instance = new web3.eth.Contract(
  DNAStorage.abi,
  'DEPLOYED_CONTRACT_ADDRESS' // Replace with your contract's deployed address
);

export default instance;
