
import React, { useState, useEffect, useCallback } from 'react';
import { ArrowDown, ArrowUpDown, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ChainSelector from './ChainSelector';
import AssetSelector from './AssetSelector';
import ConfirmationModal from './ConfirmationModal';
import TransactionStatusModal from './TransactionStatusModal';
import { toast } from "@/hooks/use-toast";
import usdcLogo from '../../public/usdc.jpg';
import { ethers } from "ethers";
import ConfirmTransactionModal from './confirmTransactionModal';
import TransactStatusModal from './TransactStatusModal';
import depositAbi from '../lib/depositAbi.json';
import axios from "axios";

interface BridgeProps {
  connectedAccount:string | null,
  isConnected: boolean;
  chainId: string | null;
  account: string | null;
}

const DepositTokenForm: React.FC<BridgeProps> = ({
  connectedAccount,
  isConnected, // Use prop for connection status
  chainId,
  account, 
}) => {
  // States for form values
  console.log(connectedAccount,'connectedAccount')
  const [amount, setAmount] = useState('');
  const [swapOnDestination, setSwapOnDestination] = useState(false);
  const [slippageTolerance, setSlippageTolerance] = useState(0.5);

  // Modal states
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending');
  
  // Mock transaction data
  const [sourceTransactionId, setSourceTransactionId] = useState('');
  const [destinationTransactionId, setDestinationTransactionId] = useState('');
  const [sourceBalance, setSourceBalance] = useState<string>('0.0');
  const [recieverAddress, setRecieverAddress] = useState<string>('');
  const assetInfo= {symbol: 'USDC', name: 'USD Coin (PoS)', logo: usdcLogo, isNative: false, contractAddress: '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8', decimals: 6 };
   
  const erc20Abi = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function name() view returns (string)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function approve(address spender, uint amount) returns (bool)",
];
  
 useEffect(()=>{
    fetchBalance();
 },[])
 const fetchBalance=async()=>{
    const usdcContractAddress = "0xbB739A6e04d07b08E38B66ba137d0c9Cd270c750";
    const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      console.log(network,"network")
    const usdcContract = new ethers.Contract(
      usdcContractAddress,
      [
        "function balanceOf(address owner) view returns (uint256)",
      ],
      provider
    );
    try {
      // Get the balance
      console.log(usdcContract,connectedAccount,"checks")
      const balance = await usdcContract.balanceOf(connectedAccount);
      setSourceBalance(ethers.utils.formatUnits(balance, 6));
      console.log("USDC Balance:", ethers.utils.formatUnits(balance, 6)); // USDC has 6 decimals
    } catch (error) {
      console.error("Error getting USDC balance:", error);
    }
    // Convert the raw balance to a user-friendly format

  }
  
  // Start bridge transaction
  const handleTransfer = async() => {
    console.log("test")
     const usdcContractAddress = "0xEa06d01bc05C26078906Ab01846a868e8BC6b6F2";
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(usdcContractAddress, depositAbi, provider);
       const checkValid= await contract.initializedAddress(connectedAccount);
       if(!checkValid){
       const getArr=await axios.get('http://127.0.0.1:5000/secret_share/1000');
       console.log(getArr.data,"getArr");
       const signer = await provider.getSigner();
       const contract = new ethers.Contract(usdcContractAddress, depositAbi, signer);
      //  const val0=ethers.FixedNumber.fromString(getArr.data[0]);
      //  const val1=ethers.FixedNumber.fromString(getArr.data[1]);
      //  const val2=ethers.FixedNumber.fromString(getArr.data[2]);
      // console.log(val0,val1,val2,"val")
       const tx = await contract.intializeAddress(ethers.BigNumber.from(getArr.data[0]), ethers.BigNumber.from(getArr.data[1]), ethers.BigNumber.from(getArr.data[2]),{
        value: 1 // Attach the native currency value here (as BigInt)
        
    });
       console.log(`Transaction sent! Hash: ${tx.hash}`);

       }
       const getArrNew=await axios.get(`http://127.0.0.1:5000/secret_share/${amount}`);
       const signer = await provider.getSigner();
       const contractnew = new ethers.Contract(usdcContractAddress, depositAbi, signer);
       console.log(getArrNew,"getarr")
       const tx1 = await contractnew.deposit(amount,ethers.BigNumber.from(getArrNew.data[0]), ethers.BigNumber.from(getArrNew.data[1]), ethers.BigNumber.from(getArrNew.data[2]));
       console.log(`Transaction sent! Hash: ${tx1.hash}`);
    // Validation checks before opening confirmation modal

    if (!recieverAddress) {
      toast({
        title: "Address Required",
        description: "Please add reciever addresss",
        variant: "destructive"
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to send",
        variant: "destructive"
      });
      return;
    }
  
    // Mock validation for available balance
    // if (parseFloat(amount) > parseFloat(fromAsset.balance)) {
    //   toast({
    //     title: "Insufficient Balance",
    //     description: `You don't have enough ${fromAsset.symbol}`,
    //     variant: "destructive"
    //   });
    //   return;
    // }
console.log("test")
    // If all validations pass, open confirmation modal
    setIsConfirmModalOpen(true);
  };

  const handleChange = (e:any) =>{
    setRecieverAddress(e.target.value);
    console.log(e.target.value,"eeee")
   }

  // Confirm bridge transaction
  const handleConfirmTransaction = () => {
    setIsConfirmModalOpen(false);
    
    // Mock transaction process
    // In a real app, this would involve wallet signing and API calls
    
    // Generate mock transaction IDs
    const sourceTxId = `0x${Math.random().toString(16).substr(2, 64)}`;
    setSourceTransactionId(sourceTxId);
    
    // Set initial status and show status modal
    setTransactionStatus('pending');
    setIsStatusModalOpen(true);
    
    // Simulate transaction progression
    toast({
      title: "Transaction Submitted",
      description: "Your bridge transaction has been submitted"
    });
    
    // Simulate transaction confirmations with timeouts
    setTimeout(() => {
      setTransactionStatus('processing');
      toast({
        title: "Transaction Confirmed",
        description: "Your transaction has been confirmed on the source chain"
      });
      
      setTimeout(() => {
        const destinationTxId = `0x${Math.random().toString(16).substr(2, 64)}`;
        setDestinationTransactionId(destinationTxId);
        
        // 80% chance of success for demo purposes
        if (Math.random() > 0.2) {
          setTransactionStatus('completed');
          toast({
            title: "Bridge Completed",
            description: "Your assets have been successfully bridged",
            variant: "success"
          });
        } else {
          setTransactionStatus('failed');
          toast({
            title: "Bridge Failed",
            description: "There was an error processing your bridge transaction",
            variant: "destructive"
          });
        }
      }, 5000); // Simulate destination chain confirmation time
    }, 3000); // Simulate source chain confirmation time
  };

  return (
    <div className="jumper-card p-5 w-full max-w-md mx-auto rounded-xl animate-scale-in shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <Button variant="action" className="rounded-full">
            Send
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <ChevronDown />
        </Button>
      </div>
      
      <div className="space-y-6">
        {/* From Chain and Asset Section */}
        <div className="asset-input-card">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">You deposit</span>
           
              <div className="flex items-center">
                <span className="text-sm text-gray-400">Balance: {sourceBalance}</span>
               
              </div>
          
          </div>
          
          <div className="flex items-center justify-between">
            <input
              type="text"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
                  setAmount(value);
                }
              }}
              className="text-3xl font-bold bg-transparent border-none outline-none w-full"
            />
            
         {/* <input placeholder='Deposit Address' type="text" onChange={handleChange} /> */}
          </div>
          
    
        </div>
        
       
        
        {/* Transaction Info Component */}
        {/* <TransactionInfo
          fromChain={'fromChainname' || null}
          toChain={'fromChainname'  || null}
          amount={amount}
          swapOnDestination={swapOnDestination}
          onSwapToggle={setSwapOnDestination}
          slippageTolerance={slippageTolerance}
          onSlippageChange={setSlippageTolerance}
        /> */}
        
        {/* Bridge Button */}
        <Button 
          onClick={handleTransfer}
          className="w-full py-6 text-base font-medium gradient-button rounded-xl"
          variant="action"
          disabled={!amount}
        >
          {'Deposit'}
        </Button>
      </div>
      
      {/* Confirmation Modal */}
      <ConfirmTransactionModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmTransaction} 
        amount={amount}
        connectedAccount={connectedAccount}
        receiverAddress={recieverAddress}
        fee="0.002 ETH"
        estimatedTime="5-10 minutes"
      />
      
      {/* Transaction Status Modal */}
      <TransactStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        recieverAddress={recieverAddress}
        status={transactionStatus}
        destinationTransactionId={destinationTransactionId}
      />
    </div>
  );
};

export default DepositTokenForm;
