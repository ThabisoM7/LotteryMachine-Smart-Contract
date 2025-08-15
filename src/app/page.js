// Import the JSON file of your contract

import Image from "next/image";
import { useState } from "react";
import Web3 from "web3";
import ABI from "./Contract/abi.json"

const ContractAddress = "0xd7F7a17E1fA4F27B180414edB7d3a246030Cce31";

export default function Home() {
  const [web3 , setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState();
  const [balance, setBalance] = useState();


const connectWallet = async () => {
    if (window.ethereum){
      try {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.requestAccounts();
        setAccounts(accounts);

        const ContractInstance = new web3Instance.eth.Contract(ABI, ContractAddress);
        setContract(ContractInstance);
        
        
        const Contractbalance = await instance.methods.getBalance().call();
        setBalance(Contractbalance);
    

      } catch (error) {
        console.error(error)
      }
    }else{
      console.error("web3 not found or install metamask")
        }
      }
      return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
       <h1>Sweepstake</h1>
       { web3 ? (
         
          <p>Connected: {accounts[0]}</p>
       ):(
       <button onClick={connectWallet}>Connect Wallet</button>
       )}

       <div>
        <p>Sweepstake Balance: {balance}</p>
        <button onClick={enterSweepstake}>Enter</button>
       </div>
    </div>
  );
  }
