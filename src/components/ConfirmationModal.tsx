
import React from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fromChain: { name: string; icon: string } | null;
  toChain: { name: string; icon: string } | null;
  asset: { symbol: string; icon: string } | null;
  amount: string;
  fee: string;
  estimatedTime: string;
  swapOnDestination: boolean;
  destinationAsset?: { symbol: string; icon: string } | null;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  fromChain,
  toChain,
  asset,
  amount,
  fee,
  estimatedTime,
  swapOnDestination,
  destinationAsset,
}) => {
  if (!fromChain || !toChain || !asset) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Confirm Bridge</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Chain and Asset Flow */}
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                <img 
                  src={fromChain.icon} 
                  alt={fromChain.name}
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
                <div style={{display: 'none'}} className="w-8 h-8 rounded-full bg-gradient-purple flex items-center justify-center text-white text-xs font-bold">
                  {fromChain.name.charAt(0)}
                </div>
              </div>
              <span className="text-sm mt-1">{fromChain.name}</span>
            </div>
            
            <ArrowRight className="mx-4" size={24} />
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                <img 
                  src={toChain.icon} 
                  alt={toChain.name}
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
                <div style={{display: 'none'}} className="w-8 h-8 rounded-full bg-gradient-purple flex items-center justify-center text-white text-xs font-bold">
                  {toChain.name.charAt(0)}
                </div>
              </div>
              <span className="text-sm mt-1">{toChain.name}</span>
            </div>
          </div>
          
          {/* Amount */}
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <img 
                src={asset.icon} 
                alt={asset.symbol}
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
                {asset.symbol.charAt(0)}
              </div>
              <span className="font-bold text-lg">{amount} {asset.symbol}</span>
            </div>
            
            {swapOnDestination && destinationAsset && (
              <div className="flex items-center justify-center mt-2">
                <div className="px-3 py-1 bg-gray-700 rounded-full text-xs flex items-center gap-1">
                  <span>Swap to</span>
                  <img 
                    src={destinationAsset.icon} 
                    alt={destinationAsset.symbol}
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
                    {destinationAsset.symbol.charAt(0)}
                  </div>
                  <span>{destinationAsset.symbol}</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Transaction Details */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Bridge Fee</span>
              <span className="text-sm font-medium">{fee}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Estimated Time</span>
              <span className="text-sm font-medium">{estimatedTime}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Receiving Address</span>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">0x7F5...4Ad1</span>
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

export default ConfirmationModal;
