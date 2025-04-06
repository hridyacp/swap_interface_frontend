
import React from 'react';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

interface TransactionInfoProps {
  fromChain: string | null;
  toChain: string | null;
  amount: string;
  swapOnDestination: boolean;
  onSwapToggle: (value: boolean) => void;
  slippageTolerance: number;
  onSlippageChange: (value: number) => void;
}

const TransactionInfo: React.FC<TransactionInfoProps> = ({
  fromChain,
  toChain,
  amount,
  swapOnDestination,
  onSwapToggle,
  slippageTolerance,
  onSlippageChange,
}) => {
  // Mock data - in a real app, these would be calculated based on the selected chains, assets, and amount
  const estimatedFee = "0.002 ETH";
  const estimatedTime = "5-10 minutes";
  
  // This would be calculated based on historical data or API in a real app
  const estimatedGas = {
    source: "0.001 ETH",
    destination: "0.001 MATIC",
  };

  if (!fromChain || !toChain || !amount) {
    return (
      <div className="glass-card p-4 space-y-3 animate-fade-in">
        <h3 className="text-sm font-medium text-gray-300">Transaction Info</h3>
        <p className="text-xs text-gray-400">
          Select chains, assets, and enter an amount to see transaction details
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-4 space-y-4 animate-fade-in">
      <h3 className="text-sm font-medium text-gray-300">Transaction Info</h3>
      
      {/* Estimated fees */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-gray-300">Estimated Fee</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle size={14} className="text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">
                    This is the total estimated fee for your transaction, including gas on both chains and bridge fees.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <span className="text-sm font-medium">{estimatedFee}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-gray-300">Estimated Time</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle size={14} className="text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">
                    Estimated time for transaction completion depends on network conditions and confirmation times.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <span className="text-sm font-medium">{estimatedTime}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300">Source Chain Gas</span>
          <span className="text-sm font-medium">{estimatedGas.source}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300">Destination Chain Gas</span>
          <span className="text-sm font-medium">{estimatedGas.destination}</span>
        </div>
      </div>
      
      <div className="border-t border-gray-700 my-2"></div>
      
      {/* Swap on destination toggle */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-gray-300">Swap on Destination</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle size={14} className="text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">
                  Automatically swap your bridged tokens to another asset on the destination chain.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Switch 
          checked={swapOnDestination} 
          onCheckedChange={onSwapToggle}
          className="data-[state=checked]:bg-bridge-purple"
        />
      </div>
      
      {/* Slippage tolerance - only show when swap is enabled */}
      {swapOnDestination && (
        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-gray-300">Slippage Tolerance</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle size={14} className="text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-xs">
                      Your transaction will revert if the price changes unfavorably by more than this percentage.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-sm font-medium">{slippageTolerance}%</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Slider
              defaultValue={[slippageTolerance]}
              min={0.1}
              max={5}
              step={0.1}
              onValueChange={(value) => onSlippageChange(value[0])}
              className="flex-grow"
            />
            <div className="flex gap-2">
              {[0.5, 1, 3].map((value) => (
                <button
                  key={value}
                  onClick={() => onSlippageChange(value)}
                  className={`px-2 py-1 text-xs rounded ${
                    slippageTolerance === value
                      ? 'bg-bridge-purple text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {value}%
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionInfo;
