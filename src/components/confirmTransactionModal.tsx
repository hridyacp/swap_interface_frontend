
import React, { useEffect } from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import user from '../../public/user.png';
import usdc from '../../public/usdc.jpg';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  receiverAddress: string| null;
  connectedAccount: string | null;
  amount: string;
  fee: string;
  estimatedTime: string;
}

const ConfirmTransactionModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  receiverAddress,
  connectedAccount,
  amount,
  fee,
  estimatedTime,
}) => {
  let trunAccount;
 if(connectedAccount){
  trunAccount= '...'+connectedAccount.slice(-5);
 }
 
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Confirm Transaction</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Chain and Asset Flow */}
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                <img 
                  src={user}
                  alt={'user'}
                  className="w-8 h-8 rounded-full"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const nextSibling = target.nextSibling as HTMLElement;
                    if (nextSibling) {
                      nextSibling.style.display = 'flex';
                    }
                  }}
                />
                </div>
                <span className="text-sm mt-1">{connectedAccount?trunAccount:''}</span>
            </div>
            
            <ArrowRight className="mx-4" size={24} />
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                <img 
                  src={user}
                  alt={'user'}
                  className="w-8 h-8 rounded-full"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const nextSibling = target.nextSibling as HTMLElement;
                    if (nextSibling) {
                      nextSibling.style.display = 'flex';
                    }
                  }}
                />
    
              </div>
              <span className="text-sm mt-1">{receiverAddress}</span>
            </div>
          </div>
          
          {/* Amount */}
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <img 
                src={usdc} 
                alt={usdc}
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
                {'USDC'}
              </div>
              <span className="font-bold text-lg">{amount} {'USDC'}</span>
            </div>
            
        
          </div>
          
          {/* Transaction Details */}
          <div className="space-y-3">
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Estimated Time</span>
              <span className="text-sm font-medium">{estimatedTime}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Receiving Address</span>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">{receiverAddress}</span>
                <a href="#" className="text-bridge-purple">
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="w-full sm:w-1/2 border-gray-700 text-gray-300 hover:text-white"
          >
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            className="w-full sm:w-1/2 gradient-button"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmTransactionModal;
