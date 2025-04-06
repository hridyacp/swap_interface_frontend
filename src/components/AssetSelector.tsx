
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Asset {
  id: string;
  symbol: string;
  name: string;
  icon: string;
  balance: string;
  usdValue: string;
}

interface AssetSelectorProps {
  selectedAsset: Asset | null;
  chainId: string | null;
  onSelectAsset: (asset: Asset) => void;
}

const AssetSelector: React.FC<AssetSelectorProps> = ({
  selectedAsset,
  chainId,
  onSelectAsset
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock asset data - in a real app, this would come from an API based on the chainId
  const assets: Asset[] = chainId ? [
    { id: 'eth', symbol: 'ETH', name: 'Ethereum', icon: '/eth.png', balance: '0.45', usdValue: '1,012.50' },
    { id: 'usdc', symbol: 'USDC', name: 'USD Coin', icon: '/usdc.png', balance: '1,250.00', usdValue: '1,250.00' },
    { id: 'usdt', symbol: 'USDT', name: 'Tether', icon: '/usdt.png', balance: '500.00', usdValue: '500.00' },
    { id: 'wbtc', symbol: 'WBTC', name: 'Wrapped Bitcoin', icon: '/wbtc.png', balance: '0.03', usdValue: '825.00' },
    { id: 'dai', symbol: 'DAI', name: 'Dai', icon: '/dai.png', balance: '750.00', usdValue: '750.00' },
  ] : [];

  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAsset = (asset: Asset) => {
    onSelectAsset(asset);
    setIsOpen(false);
  };

  // Placeholder icon for assets without images
  const PlaceholderIcon = ({ symbol }: { symbol: string }) => (
    <div className="w-6 h-6 rounded-full bg-gradient-purple flex items-center justify-center text-white text-xs font-bold">
      {symbol.charAt(0)}
    </div>
  );

  if (!chainId) {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Asset
        </label>
        <div className="w-full glass-card p-3 opacity-60 cursor-not-allowed">
          <span className="text-gray-400">Select a chain first</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-400 mb-2">
        Asset
      </label>
      
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full glass-card p-3 flex items-center justify-between hover:opacity-90 transition-all"
      >
        {selectedAsset ? (
          <div className="flex items-center gap-2">
            {selectedAsset.icon ? (
              <img 
                src={selectedAsset.icon} 
                alt={selectedAsset.name} 
                className="w-6 h-6 rounded-full"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const nextSibling = target.nextSibling as HTMLElement;
                  if (nextSibling) {
                    nextSibling.style.display = 'flex';
                  }
                }}
              />
            ) : null}
            <div style={{display: 'none'}} className="w-6 h-6 rounded-full bg-gradient-purple flex items-center justify-center text-white text-xs font-bold">
              {selectedAsset.symbol.charAt(0)}
            </div>
            <div className="flex flex-col items-start">
              <span>{selectedAsset.symbol}</span>
              <span className="text-xs text-gray-400">{selectedAsset.name}</span>
            </div>
          </div>
        ) : (
          <span className="text-gray-400">Select an asset</span>
        )}
        <ChevronDown size={18} className="text-gray-400" />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="glass-card max-w-md max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-center">Select Asset</DialogTitle>
          </DialogHeader>
          
          <div className="mb-4 mt-2">
            <Input
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-800 border-gray-700 focus:ring-bridge-purple"
            />
          </div>
          
          <div className="overflow-y-auto flex-grow pr-2">
            <div className="grid grid-cols-1 gap-2">
              {filteredAssets.map((asset) => (
                <button
                  key={asset.id}
                  className="chain-selector"
                  onClick={() => handleSelectAsset(asset)}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      {asset.icon ? (
                        <img 
                          src={asset.icon} 
                          alt={asset.name} 
                          className="w-6 h-6 rounded-full"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            const nextSibling = target.nextSibling as HTMLElement;
                            if (nextSibling) {
                              nextSibling.style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      <div style={{display: 'none'}} className="w-6 h-6 rounded-full bg-gradient-purple flex items-center justify-center text-white text-xs font-bold">
                        {asset.symbol.charAt(0)}
                      </div>
                      <div className="flex flex-col items-start">
                        <span>{asset.symbol}</span>
                        <span className="text-xs text-gray-400">{asset.name}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span>{asset.balance}</span>
                      <span className="text-xs text-gray-400">${asset.usdValue}</span>
                    </div>
                  </div>
                </button>
              ))}
              
              {filteredAssets.length === 0 && (
                <div className="p-4 text-center text-gray-400">
                  No assets found matching "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssetSelector;
