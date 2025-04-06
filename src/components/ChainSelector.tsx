
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from '@/lib/utils';

interface Chain {
  id: string;
  name: string;
  icon: string;
}

interface ChainSelectorProps {
  direction: 'from' | 'to';
  selectedChain: Chain | null;
  onSelectChain: (chain: Chain) => void;
  className?: string;
}

const ChainSelector: React.FC<ChainSelectorProps> = ({
  direction,
  selectedChain,
  onSelectChain,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock chain data - in a real app, this would come from an API
  const chains: Chain[] = [
    { id: 'rootstock', name: 'RootStock', icon: '/rootstock.jpeg' },
    { id: 'celo', name: 'Celo', icon: '/celo.png' },
    { id: 'sepolia', name: 'Sepolia', icon: '/sepolia.jpeg' },
  ];

  const filteredChains = chains.filter(chain => 
    chain.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectChain = (chain: Chain) => {
    onSelectChain(chain);
    setIsOpen(false);
  };

  return (
    <div className={cn("w-full", className)}>
      <button 
        onClick={() => setIsOpen(true)}
        className="coin-badge hover-scale w-auto"
      >
        {selectedChain ? (
          <div className="flex items-center gap-2">
            <img 
              src={selectedChain.icon} 
              alt={selectedChain.name} 
              className="w-4 h-4 rounded-full"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="text-sm">{selectedChain.name}</span>
            <ChevronDown size={14} className="text-gray-400" />
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-400">Select Network</span>
            <ChevronDown size={14} className="text-gray-400" />
          </div>
        )}
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="jumper-card max-w-md max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-center">Select Chain</DialogTitle>
          </DialogHeader>
          
          <div className="mb-4 mt-2">
            <Input
              placeholder="Search chains..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-800 border-gray-700 focus:ring-orange-500"
            />
          </div>
          
          <div className="overflow-y-auto flex-grow pr-2">
            <div className="grid grid-cols-1 gap-2">
              {filteredChains.map((chain) => (
                <button
                  key={chain.id}
                  className="chain-selector"
                  onClick={() => handleSelectChain(chain)}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={chain.icon} 
                      alt={chain.name} 
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
                    <div style={{display: 'none'}} className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold">
                      {chain.name.charAt(0)}
                    </div>
                    <span>{chain.name}</span>
                  </div>
                </button>
              ))}
              
              {filteredChains.length === 0 && (
                <div className="p-4 text-center text-gray-400">
                  No chains found matching "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChainSelector;
