"use client"; // This directive marks the file as a client component

import { useState, useEffect, ChangeEvent, MouseEvent } from 'react';
import web3 from '../utils/web3';
import dnaStorage from '../utils/dnaStorage';
import try1 from '../utils/try1';
import '../styles/globals.css';

interface Request {
  user: string;
  dataHash: string;
  status: string;
}

export default function Home() {
  const [dataHash, setDataHash] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [requests, setRequests] = useState<Request[]>([]);
  const [message, setMessage] = useState<string>('');
  const [newMessage, setNewMessage] = useState<string>('');
  const [account, setAccount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        // Request account access if needed
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const requestCount = await dnaStorage.methods.requestCount().call();
        const requestsArray: Request[] = [];
        for (let i = 0; i < requestCount; i++) {
          const request = await dnaStorage.methods.requests(i).call();
          requestsArray.push(request);
        }
        setRequests(requestsArray);

        const currentMessage = await try1.methods.getMessage().call();
        setMessage(currentMessage);
      } catch (err) {
        console.error(err);
        setError('Failed to load data.');
      }
    }
    load();
  }, []);

  const createRequest = async () => {
    try {
      await dnaStorage.methods.createRequest(dataHash).send({ from: account });
      const requestCount = await dnaStorage.methods.requestCount().call();
      const requestsArray: Request[] = [];
      for (let i = 0; i < requestCount; i++) {
        const request = await dnaStorage.methods.requests(i).call();
        requestsArray.push(request);
      }
      setRequests(requestsArray);
      setDataHash('');
    } catch (err) {
      console.error(err);
      setError('Failed to create request.');
    }
  };

  const updateRequest = async (id: number) => {
    try {
      await dnaStorage.methods.updateRequest(id, status).send({ from: account });
      const updatedRequest = await dnaStorage.methods.requests(id).call();
      setRequests(requests.map((r, index) => (index === id ? updatedRequest : r)));
      setStatus('');
    } catch (err) {
      console.error(err);
      setError('Failed to update request.');
    }
  };

  const updateMessage = async () => {
    try {
      await try1.methods.setMessage(newMessage).send({ from: account });
      const updatedMessage = await try1.methods.getMessage().call();
      setMessage(updatedMessage);
      setNewMessage('');
    } catch (err) {
      console.error(err);
      setError('Failed to update message.');
    }
  };

  const handleChangeStatus = (e: ChangeEvent<HTMLInputElement>) => setStatus(e.target.value);
  const handleChangeDataHash = (e: ChangeEvent<HTMLInputElement>) => setDataHash(e.target.value);
  const handleChangeNewMessage = (e: ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value);

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h1>DNA Storage Platform</h1>
      <h2>Create a Request</h2>
      <input
        type="text"
        value={dataHash}
        onChange={handleChangeDataHash}
        placeholder="Data Hash"
      />
      <button onClick={createRequest}>Create Request</button>
      <h2>Update a Request</h2>
      <input
        type="number"
        placeholder="Request ID"
        onChange={handleChangeStatus}
      />
      <input
        type="text"
        value={status}
        onChange={handleChangeStatus}
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
      <h1>Another Contract Interaction</h1>
      <p>Current Message: {message}</p>
      <input
        type="text"
        value={newMessage}
        onChange={handleChangeNewMessage}
        placeholder="New Message"
      />
      <button onClick={updateMessage}>Update Message</button>
    </div>
  );
}
