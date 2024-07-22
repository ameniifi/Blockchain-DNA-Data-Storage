// pages/index.js
import { useState, useEffect } from 'react';
import web3 from '../utils/web3'; // Ensure this path matches your project's structure
import dnaStorage from '../utils/dnaStorage'; // Ensure this path matches your project's structure

export default function Home() {
  const [dataHash, setDataHash] = useState('');
  const [status, setStatus] = useState('');
  const [requests, setRequests] = useState([]);
  const [account, setAccount] = useState('');

  useEffect(() => {
    async function load() {
      // Get the user's accounts
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      // Load existing requests
      const requestCount = await dnaStorage.methods.requestCount().call();
      const requests = [];
      for (let i = 0; i < requestCount; i++) {
        const request = await dnaStorage.methods.requests(i).call();
        requests.push(request);
      }
      setRequests(requests);
    }
    load();
  }, []);

  const createRequest = async () => {
    await dnaStorage.methods.createRequest(dataHash).send({ from: account });
    // Reload requests after creating a new request
    const requestCount = await dnaStorage.methods.requestCount().call();
    const requests = [];
    for (let i = 0; i < requestCount; i++) {
      const request = await dnaStorage.methods.requests(i).call();
      requests.push(request);
    }
    setRequests(requests);
    setDataHash(''); // Clear input field
  };

  const updateRequest = async (id) => {
    await dnaStorage.methods.updateRequest(id, status).send({ from: account });
    // Reload requests after updating
    const updatedRequest = await dnaStorage.methods.requests(id).call();
    setRequests(requests.map((r, index) => (index === id ? updatedRequest : r)));
    setStatus(''); // Clear input field
  };

  return (
    <div>
      <h1>DNA Storage Platform</h1>
      
      <h2>Create a Request</h2>
      <input
        type="text"
        value={dataHash}
        onChange={(e) => setDataHash(e.target.value)}
        placeholder="Data Hash"
      />
      <button onClick={createRequest}>Create Request</button>
      
      <h2>Update a Request</h2>
      <input
        type="number"
        placeholder="Request ID"
        onChange={(e) => setStatus(e.target.value)}
      />
      <input
        type="text"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        placeholder="Status"
      />
      <button onClick={() => updateRequest(parseInt(status))}>Update Request</button>

      <h2>Existing Requests</h2>
      <ul>
        {requests.map((request, index) => (
          <li key={index}>
            ID: {index}, User: {request.user}, Data Hash: {request.dataHash}, Status: {request.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
