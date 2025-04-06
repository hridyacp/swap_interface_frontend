
import React, { useState } from 'react';
import { Check, Clock, XCircle, ChevronDown, ArrowUpRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Transaction {
  id: string;
  date: string;
  fromChain: {
    name: string;
    icon: string;
  };
  toChain: {
    name: string;
    icon: string;
  };
  asset: {
    symbol: string;
    icon: string;
  };
  amount: string;
  status: 'pending' | 'completed' | 'failed';
  sourceTransactionId: string;
  destinationTransactionId?: string;
}

const TransactionHistory: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Mock transaction data
  const transactions: Transaction[] = [
    {
      id: '1',
      date: '2025-04-05 09:45',
      fromChain: { name: 'Ethereum', icon: '/eth.png' },
      toChain: { name: 'Polygon', icon: '/polygon.png' },
      asset: { symbol: 'USDC', icon: '/usdc.png' },
      amount: '500.00',
      status: 'completed',
      sourceTransactionId: '0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234',
      destinationTransactionId: '0xabcdef123456789abcdef123456789abcdef123456789abcdef123456789abc',
    },
    {
      id: '2',
      date: '2025-04-04 18:20',
      fromChain: { name: 'Polygon', icon: '/polygon.png' },
      toChain: { name: 'Arbitrum', icon: '/arbitrum.png' },
      asset: { symbol: 'ETH', icon: '/eth.png' },
      amount: '0.25',
      status: 'pending',
      sourceTransactionId: '0x23456789abcdef123456789abcdef123456789abcdef123456789abcdef12345',
    },
    {
      id: '3',
      date: '2025-04-03 14:10',
      fromChain: { name: 'Ethereum', icon: '/eth.png' },
      toChain: { name: 'Optimism', icon: '/optimism.png' },
      asset: { symbol: 'DAI', icon: '/dai.png' },
      amount: '200.00',
      status: 'failed',
      sourceTransactionId: '0x3456789abcdef123456789abcdef123456789abcdef123456789abcdef123456',
    },
  ];

  // Helper to render status icon
  const renderStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check size={16} className="text-green-400" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-400" />;
      case 'failed':
        return <XCircle size={16} className="text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full glass-card overflow-hidden rounded-xl mt-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full flex justify-between items-center p-4 hover:bg-gray-800/50"
          >
            <span className="font-medium">Transaction History</span>
            <ChevronDown
              size={18}
              className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            />
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          {transactions.length > 0 ? (
            <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
              {transactions.map((tx) => (
                <div key={tx.id} className="bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <img 
                          src={tx.asset.icon} 
                          alt={tx.asset.symbol}
                          className="w-5 h-5 rounded-full"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            const nextSibling = target.nextSibling as HTMLElement;
                            if (nextSibling) {
                              nextSibling.style.display = 'flex';
                            }
                          }}
                        />
                        <div style={{display: 'none'}} className="w-5 h-5 rounded-full bg-gradient-purple flex items-center justify-center text-white text-xs font-bold">
                          {tx.asset.symbol.charAt(0)}
                        </div>
                      </div>
                      <span className="font-medium">{tx.amount} {tx.asset.symbol}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {renderStatusIcon(tx.status)}
                      <span className="text-xs capitalize">{tx.status}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <img 
                          src={tx.fromChain.icon} 
                          alt={tx.fromChain.name}
                          className="w-4 h-4 rounded-full"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            const nextSibling = target.nextSibling as HTMLElement;
                            if (nextSibling) {
                              nextSibling.style.display = 'flex';
                            }
                          }}
                        />
                        <div style={{display: 'none'}} className="w-4 h-4 rounded-full bg-gradient-purple flex items-center justify-center text-white text-xs font-bold">
                          {tx.fromChain.name.charAt(0)}
                        </div>
                      </div>
                      <span className="text-xs">→</span>
                      <div className="flex items-center">
                        <img 
                          src={tx.toChain.icon} 
                          alt={tx.toChain.name}
                          className="w-4 h-4 rounded-full"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            const nextSibling = target.nextSibling as HTMLElement;
                            if (nextSibling) {
                              nextSibling.style.display = 'flex';
                            }
                          }}
                        />
                        <div style={{display: 'none'}} className="w-4 h-4 rounded-full bg-gradient-purple flex items-center justify-center text-white text-xs font-bold">
                          {tx.toChain.name.charAt(0)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{tx.date}</span>
                      <a
                        href={`https://etherscan.io/tx/${tx.sourceTransactionId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-bridge-purple hover:text-opacity-80"
                      >
                        <ArrowUpRight size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400">
              <p>No transactions yet</p>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default TransactionHistory;
