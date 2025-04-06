
import React, { useState, useEffect, useCallback } from 'react';
import { ArrowDown, ArrowUpDown, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ChainSelector from './ChainSelector';
import AssetSelector from './AssetSelector';
import TransactionInfo from './TransactionInfo';
import ConfirmationModal from './ConfirmationModal';
import TransactionStatusModal from './TransactionStatusModal';
import { toast } from "@/hooks/use-toast";
import usdcLogo from '../../public/usdc.jpg';
import { ethers } from "ethers";

interface Chain {
  id: string;
  name: string;
  icon: string;
}

interface Asset {
  id: string;
  symbol: string;
  name: string;
  icon: string;
  balance: string;
  usdValue: string;
}

interface BridgeProps {
  connectedAccount:string | null,
  isConnected: boolean;
  chainId: string | null;
  account: string | null;
}

const BridgeForm: React.FC<BridgeProps> = ({
  connectedAccount,
  isConnected, // Use prop for connection status
  chainId,
  account, 
}) => {
  // States for form values
  const [fromChain, setFromChain] = useState<Chain | null>(null);
  const [toChain, setToChain] = useState<Chain | null>(null);
  const [fromAsset, setFromAsset] = useState<Asset | null>(null);
  const [toAsset, setToAsset] = useState<Asset | null>(null);
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
  const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(false);
  const assetInfo= {symbol: 'USDC', name: 'USD Coin (PoS)', logo: usdcLogo, isNative: false, contractAddress: '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8', decimals: 6 };
   
  const erc20Abi = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function name() view returns (string)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function approve(address spender, uint amount) returns (bool)",
];
  // Auto-select chain and asset when component loads (for demo purposes)
  useEffect(() => {
    // Simulate loading default chain data
    fetchBalance(chainId,assetInfo);
    setTimeout(() => {
      if (!fromChain) {
        setFromChain({
          id: 'rootStock',
          name: 'RootStock',
          icon: '/rootstock.jpeg'
        });
      }
      
      if (!toChain) {
        setToChain({
          id: 'celo',
          name: 'Celo',
          icon: '/celo.png'
        });
      }
    }, 500);
  }, []);

  // Effect to load assets when chains are selected
  useEffect(() => {
    if (fromChain && !fromAsset) {
     fetchBalance(chainId,assetInfo);
      setFromAsset({
        id: 'usdc',
        symbol: 'USDC',
        name: 'USD Coin',
        icon: '/usdc.jpg',
        balance: '00.00',
        usdValue: '00.00'
      });
    }
    
    if (toChain && !toAsset) {
      // Auto-select USDC on destination chain
      setToAsset({
        id: 'usdc',
        symbol: 'USDC',
        name: 'USD Coin',
        icon: '/usdc.jpg',
        balance: '00.00',
        usdValue: '00.00'
      });
    }
  }, [fromChain, toChain, fromAsset, toAsset]);

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
  
  
  const handleSetMaxAmount = () => {
    if (fromAsset) {
      setAmount(fromAsset.balance);
      toast({
        title: "Maximum Amount Set",
        description: `Set to ${fromAsset.balance} ${fromAsset.symbol}`,
        variant: "default"
      });
    }
  };

  // Swap chains function
  const handleSwapChains = () => {
    if (fromChain && toChain) {
      const tempChain = fromChain;
      const tempAsset = fromAsset;
      
      setFromChain(toChain);
      setToChain(tempChain);
      
      // Don't swap assets as they might not be available on the other chain
      setFromAsset(null);
      setToAsset(null);
      
      // Clear amount when chains are swapped
      setAmount('');
      
      toast({
        title: "Chains Swapped",
        description: `Swapped ${fromChain.name} and ${toChain.name}`,
        variant: "default"
      });
    }
  };

  // Start bridge transaction
  const handleStartBridge = () => {
    console.log("test")
    // Validation checks before opening confirmation modal
    if (!fromChain || !toChain) {
      toast({
        title: "Chains Required",
        description: "Please select both source and destination chains",
        variant: "destructive"
      });
      return;
    }

    if (!fromAsset) {
      toast({
        title: "Asset Required",
        description: "Please select an asset to bridge",
        variant: "destructive"
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to bridge",
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

  // Confirm bridge transaction
  const handleConfirmBridge = () => {
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
            Bridge
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
            <span className="text-sm text-gray-400">You pay</span>
            {fromAsset && (
              <div className="flex items-center">
                <span className="text-sm text-gray-400">Balance: {fromAsset.balance}</span>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="p-0 ml-1 h-auto text-xs text-bridge-purple" 
                  onClick={handleSetMaxAmount}
                >
                  MAX
                </Button>
              </div>
            )}
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
            
            <button 
              onClick={() => {
                if (fromChain) {
                  setIsConfirmModalOpen(true);
                } else {
                  toast({
                    title: "Select Chain First",
                    description: "Please select a source chain before selecting an asset",
                    variant: "destructive"
                  });
                }
              }}
              className="coin-badge hover-scale"
            >
              {fromAsset ? (
                <>
                  <img 
                    src={fromAsset.icon} 
                    alt={fromAsset.symbol}
                    className="w-5 h-5 rounded-full"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <span>{fromAsset.symbol}</span>
                </>
              ) : (
                <span>Select</span>
              )}
              <ChevronDown size={15} />
            </button>
          </div>
          
          <ChainSelector 
            direction="from" 
            selectedChain={fromChain} 
            onSelectChain={setFromChain}
            className="mt-4"
          />
        </div>
        
        {/* Chain Swap Button */}
        <div className="relative flex justify-center">
          <button 
            className="swap-button z-10"
            onClick={handleSwapChains}
            aria-label="Swap chains"
          >
            <ArrowUpDown size={18} className="text-gray-400" />
          </button>
        </div>
        
        {/* To Chain and Asset Section */}
        <div className="asset-input-card">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">You receive</span>
            {toAsset && <span className="text-sm text-gray-400">Balance: {toAsset.balance}</span>}
          </div>
          
          <div className="flex items-center justify-between">
            <input
              type="text"
              placeholder="0.00"
              value={amount}
              disabled
              className="text-3xl font-bold bg-transparent border-none outline-none w-full"
            />
            
            <button 
              onClick={() => {
                if (toChain) {
                  // In a real app, this would open an asset selector modal for the destination chain
                  toast({
                    title: "Coming Soon",
                    description: "Asset selection for destination chain is not available in demo",
                    variant: "default"
                  });
                } else {
                  toast({
                    title: "Select Chain First",
                    description: "Please select a destination chain before selecting an asset",
                    variant: "destructive"
                  });
                }
              }}
              className="coin-badge hover-scale"
            >
              {toAsset ? (
                <>
                  <img 
                    src={toAsset.icon} 
                    alt={toAsset.symbol}
                    className="w-5 h-5 rounded-full"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <span>{toAsset.symbol}</span>
                </>
              ) : (
                <span>Select</span>
              )}
              <ChevronDown size={15} />
            </button>
          </div>
          
          <ChainSelector 
            direction="to" 
            selectedChain={toChain} 
            onSelectChain={setToChain}
            className="mt-4"
          />
        </div>
        
        {/* Transaction Info Component */}
        <TransactionInfo
          fromChain={fromChain?.name || null}
          toChain={toChain?.name || null}
          amount={amount}
          swapOnDestination={swapOnDestination}
          onSwapToggle={setSwapOnDestination}
          slippageTolerance={slippageTolerance}
          onSlippageChange={setSlippageTolerance}
        />
        
        {/* Bridge Button */}
        <Button 
          onClick={handleStartBridge}
          className="w-full py-6 text-base font-medium gradient-button rounded-xl"
          variant="action"
          disabled={!fromChain || !toChain || !fromAsset || !amount}
        >
          {'Bridge'}
        </Button>
      </div>
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmBridge}
        fromChain={fromChain}
        toChain={toChain}
        asset={fromAsset}
        amount={amount}
        fee="0.002 ETH"
        estimatedTime="5-10 minutes"
        swapOnDestination={swapOnDestination}
        destinationAsset={toAsset}
      />
      
      {/* Transaction Status Modal */}
      <TransactionStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        status={transactionStatus}
        fromChain={fromChain}
        toChain={toChain}
        sourceTransactionId={sourceTransactionId}
        destinationTransactionId={destinationTransactionId}
      />
    </div>
  );
};

export default BridgeForm;
