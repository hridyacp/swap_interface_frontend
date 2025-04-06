
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AmountInputProps {
  selectedAsset: {
    symbol: string;
    balance: string;
    usdValue: string;
  } | null;
  amount: string;
  onAmountChange: (amount: string) => void;
}

const AmountInput: React.FC<AmountInputProps> = ({
  selectedAsset,
  amount,
  onAmountChange
}) => {
  const [isUsdMode, setIsUsdMode] = useState(false);
  
  // In a real app, this would use a proper decimal handling library
  const handleMaxClick = () => {
    if (selectedAsset) {
      onAmountChange(selectedAsset.balance);
    }
  };

  // Currency conversion would be handled with real rates in a production app
  const toggleMode = () => {
    setIsUsdMode(!isUsdMode);
  };

  if (!selectedAsset) {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Amount
        </label>
        <div className="w-full glass-card p-3 opacity-60 cursor-not-allowed flex items-center justify-between">
          <Input
            type="text"
            placeholder="0.00"
            disabled
            className="bg-transparent border-0 p-0 text-lg focus-visible:ring-0"
          />
          <span className="text-gray-400">Select an asset first</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <label className="block text-sm font-medium text-gray-400">
          Amount
        </label>
        <div className="text-sm text-gray-400">
          Balance: {selectedAsset.balance} {selectedAsset.symbol}
        </div>
      </div>
      
      <div className="w-full glass-card p-3 flex items-center justify-between">
        <Input
          type="text"
          placeholder="0.00"
          value={amount}
          onChange={(e) => {
            // Simple validation to allow only numbers and decimals
            const value = e.target.value;
            if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
              onAmountChange(value);
            }
          }}
          className="bg-transparent border-0 p-0 text-lg focus-visible:ring-0"
        />
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleMaxClick}
            className="text-xs h-7 px-2 border-gray-700 text-gray-300 hover:text-white"
          >
            MAX
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMode}
            className="bg-gray-800 text-gray-300 hover:text-white h-7 px-2 font-medium"
          >
            {isUsdMode ? `${selectedAsset.symbol}` : 'USD'}
          </Button>
        </div>
      </div>
      
      <div className="mt-1 text-right text-sm text-gray-400">
        {isUsdMode ? (
          `≈ ${amount ? Number(amount).toFixed(2) : '0.00'} USD`
        ) : (
          `≈ $${amount ? (Number(amount) * (Number(selectedAsset.usdValue) / Number(selectedAsset.balance))).toFixed(2) : '0.00'}`
        )}
      </div>
    </div>
  );
};

export default AmountInput;
