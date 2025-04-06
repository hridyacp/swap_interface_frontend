
import React from 'react';
import { CheckCircle, XCircle, Clock, ArrowUpRight, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed';

interface TransactionStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: TransactionStatus;
  fromChain: { name: string; icon: string } | null;
  toChain: { name: string; icon: string } | null;
  sourceTransactionId?: string;
  destinationTransactionId?: string;
}

const TransactionStatusModal: React.FC<TransactionStatusModalProps> = ({
  isOpen,
  onClose,
  status,
  fromChain,
  toChain,
  sourceTransactionId,
  destinationTransactionId,
}) => {
  if (!fromChain || !toChain) return null;

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Clock size={48} className="text-yellow-400" />;
      case 'processing':
        return <Loader2 size={48} className="animate-spin text-blue-400" />;
      case 'completed':
        return <CheckCircle size={48} className="text-green-400" />;
      case 'failed':
        return <XCircle size={48} className="text-red-400" />;
      default:
        return <Clock size={48} className="text-yellow-400" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Transaction Pending';
      case 'processing':
        return 'Processing Bridge';
      case 'completed':
        return 'Bridge Completed';
      case 'failed':
        return 'Bridge Failed';
      default:
        return 'Transaction Status';
    }
  };

  const getStatusDescription = () => {
    switch (status) {
      case 'pending':
        return 'Your transaction has been submitted and is waiting to be confirmed on the source chain.';
      case 'processing':
        return 'Your transaction has been confirmed on the source chain and is now being processed on the destination chain.';
      case 'completed':
        return 'Your bridge transaction has been successfully completed on both chains.';
      case 'failed':
        return 'Your transaction has failed. Please check the details and try again.';
      default:
        return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">{getStatusText()}</DialogTitle>
        </DialogHeader>

        <div className="py-4 flex flex-col items-center space-y-4">
          <div className="p-2 rounded-full">
            {getStatusIcon()}
          </div>
          
          <p className="text-center text-sm text-gray-300 max-w-xs">
            {getStatusDescription()}
          </p>
          
          {/* Transaction links */}
          <div className="w-full space-y-3 mt-4">
            <div className="flex justify-between items-center bg-gray-800 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <img 
                  src={fromChain.icon} 
                  alt={fromChain.name}
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
                  {fromChain.name.charAt(0)}
                </div>
                <span className="text-sm">{fromChain.name} Transaction</span>
              </div>
              
              {sourceTransactionId && (
                <a
                  href={`https://etherscan.io/tx/${sourceTransactionId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bridge-purple hover:text-opacity-80 flex items-center gap-1"
                >
                  <span className="text-xs">View</span>
                  <ArrowUpRight size={14} />
                </a>
              )}
            </div>
            
            <div className="flex justify-between items-center bg-gray-800 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <img 
                  src={toChain.icon} 
                  alt={toChain.name}
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
                  {toChain.name.charAt(0)}
                </div>
                <span className="text-sm">{toChain.name} Transaction</span>
              </div>
              
              {destinationTransactionId && (
                <a
                  href={`https://polygonscan.com/tx/${destinationTransactionId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bridge-purple hover:text-opacity-80 flex items-center gap-1"
                >
                  <span className="text-xs">View</span>
                  <ArrowUpRight size={14} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button 
            variant={status === 'failed' ? 'default' : 'outline'}
            onClick={onClose}
            className={status === 'failed' 
              ? 'gradient-button w-full'
              : 'w-1/2 border-gray-700 text-gray-300 hover:text-white'
            }
          >
            {status === 'failed' ? 'Try Again' : 'Close'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionStatusModal;
