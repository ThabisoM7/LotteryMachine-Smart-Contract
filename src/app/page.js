'use client';

import { useState } from "react";
import Web3 from "web3";
import ABI from "./Contract/abi.json"

const ContractAddress = "";

export default function Home() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState();
  const [balance, setBalance] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.requestAccounts();
        setAccounts(accounts);

        const contractInstance = new web3Instance.eth.Contract(ABI, ContractAddress);
        setContract(contractInstance);
        
        const contractBalance = await contractInstance.methods.getBalance().call();
        setBalance(web3Instance.utils.fromWei(contractBalance, 'ether'));
      } catch (error) {
        setError('Failed to connect wallet: ' + error.message);
        console.error(error);
      }
    } else {
      setError('Please install MetaMask to use this application');
    }
  };

  const enterSweepstake = async () => {
    if (!contract || !accounts[0]) return;
    
    try {
      setLoading(true);
      setError('');
      
      await contract.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei('0.01', 'ether')
      });

      const newBalance = await contract.methods.getBalance().call();
      setBalance(web3.utils.fromWei(newBalance, 'ether'));
    } catch (error) {
      setError('Failed to enter sweepstake: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8">Sweepstake</h1>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                {error}
              </div>
            )}

            {!web3 ? (
              <button
                onClick={connectWallet}
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="space-y-4">
                <p className="text-sm">Connected: {accounts[0]}</p>
                <p className="text-xl font-bold">Prize Pool: {balance} ETH</p>
                <button
                  onClick={enterSweepstake}
                  disabled={loading}
                  className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Enter Sweepstake (0.01 ETH)'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
