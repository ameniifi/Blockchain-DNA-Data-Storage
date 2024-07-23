import web3 from './web3';
import try1 from '../build/contracts/try1.json';

const CONTRACT_ADDRESS = "0xe5520b4D8dE2F1e4105491979f123b69a55C99Bc";

const instance = new web3.eth.Contract(
  try1.abi,
  CONTRACT_ADDRESS
);

export default instance;
