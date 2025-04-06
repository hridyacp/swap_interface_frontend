import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button"; // Assuming shadcn/ui
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"; // Assuming custom hook
import btchyperLogo from '../../public/Logoooo.png';
import { ethers } from "ethers";
import { useNavigate } from 'react-router-dom';

// Helper function
const isMetaMaskInstalled = (): boolean => {
  // Ensure window.ethereum is accessed safely after type declaration
  // Requires global.d.ts setup for window.ethereum
  return Boolean(typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask);
};

// Define the props the Header will receive from its parent (e.g., App.js)
interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  connectedAccount:string | null,
  isConnected: boolean;
  chainId: string | null;
  account: string | null;
  isQROpen: boolean;
  onConnect: (account: string, chainId: string) => void; // Callback on successful connect
  onDisconnect: () => void; // Callback on disconnect
  onAccountChange: (account: string) => void; // Callback on account switch
  onChainChange: (chainId: string) => void; // Callback on network switch
  onError: (errorMessage: string) => void; // Callback for reporting errors
}

const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  toggleTheme,
  connectedAccount,
  isConnected, // Use prop for connection status
  chainId,
  account, 
  isQROpen,
  onConnect,
  onDisconnect,
  onAccountChange,
  onChainChange,
  onError,
}) => {
  // Local state for UI elements within the Header
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [metaMaskInstalled, setMetaMaskInstalled] = useState(false);
 
  const { toast } = useToast();
  let navigate =useNavigate();
  const handleTransferTok =()=>{
navigate('/private')
  }
  const handleBridgeTok =()=>{
    navigate('/bridge')
      }

  // --- Effect for MetaMask Detection, Initial Connection Check, and Listeners ---
  useEffect(() => {
    if (typeof window === 'undefined') return; // Guard against SSR

    const installed = isMetaMaskInstalled();
    setMetaMaskInstalled(installed);

    if (installed) {
      // Ensure ethereum object and necessary methods exist before using them
      const ethereum = window.ethereum;
      if (!ethereum || !ethereum.request || !ethereum.on || !ethereum.removeListener) {
        console.warn("MetaMask provider found, but expected methods (request, on, removeListener) are missing.");
        onError("Incompatible Ethereum provider detected.");
        return;
      }


      // --- Helper to get chain ID ---
      const getChainId = async (): Promise<string | null> => {
        try {
          const currentChainId = await ethereum.request({ method: 'eth_chainId' }) as string;
          return currentChainId;
        } catch (err: any) {
          console.error("Error getting chain ID:", err);
          onError(`Could not get network chain ID: ${err.message || 'Unknown error'}`);
          return null;
        }
      };

      // --- Check initial connection ---
      const checkConnection = async () => {
        try {
          const accounts = await ethereum.request({ method: 'eth_accounts' }) as string[];
          if (accounts.length > 0) {
            const currentChainId = await getChainId();
            if (currentChainId) {
              console.log('Wallet already connected:', accounts[0], 'on chain:', currentChainId);
              // Call parent's connect handler only if state differs or not yet connected
               if (!isConnected || accounts[0].toLowerCase() !== account?.toLowerCase()) {
                 onConnect(accounts[0], currentChainId);
               }
            } else if(isConnected) {
                // If we were connected but couldn't get chainId, disconnect app state
                onDisconnect();
            }
          } else {
            console.log('Wallet not connected initially.');
            // Call parent's disconnect handler only if parent thinks it's connected
             if (isConnected) {
                onDisconnect();
             }
          }
        } catch (err: any) {
          console.error("Error checking initial connection:", err);
          onError(`Could not check wallet connection: ${err.message || 'Unknown error'}`);
           if (isConnected) onDisconnect(); // Disconnect app state if check fails while connected
        }
      };
      checkConnection(); // Run check on mount

      // --- Event Listeners ---
      const handleAccountsChanged = (accounts: unknown) => { // Ethers might pass unknown[]
        const accountsArray = accounts as string[]; // Assert type
        if (accountsArray.length === 0) {
          console.log('Wallet disconnected or locked.');
          toast({ title: "Wallet Disconnected", description: "Please connect again if needed.", variant: "destructive" });
          onDisconnect(); // Call parent's disconnect handler
        } else if (accountsArray[0].toLowerCase() !== account?.toLowerCase()) { // Case-insensitive compare
          console.log('Account changed:', accountsArray[0]);
          toast({ title: "Account Switched", description: `Connected to ${shortenAddress(accountsArray[0])}` });
          onAccountChange(accountsArray[0]); // Call parent's account change handler
           // Fetch chain ID again when account changes
           getChainId().then(newChainId => {
               if (newChainId) onChainChange(newChainId);
           });
        }
      };

      const handleChainChanged = (chainIdHex: unknown) => { // Ethers might pass unknown
        const newChainId = chainIdHex as string; // Assert type
        console.log('Network changed:', newChainId);
        toast({ title: "Network Switched", description: `Switched to chain ID ${newChainId}` });
        onChainChange(newChainId); // Call parent's chain change handler
         // Recheck account as chain change might affect it
         checkConnection();
      };

      // Add listeners
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);

      // Clean up listeners
      return () => {
        // Check if removeListener exists before calling
        if (ethereum?.removeListener) {
            ethereum.removeListener('accountsChanged', handleAccountsChanged);
            ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };

    } else {
      // MetaMask not installed
      if (isConnected) { // If app thinks it's connected but MM is now gone, disconnect state
          onDisconnect();
      }
    }
    // Dependencies: Include props that callbacks depend on if they aren't stable (useCallback helps)
    // Also include account and isConnected to re-run checks if parent state changes unexpectedly
  }, [isConnected, account, onConnect, onDisconnect, onAccountChange, onChainChange, onError]); // Added dependencies


  // --- Connect Wallet Action ---
  const connectWalletAction = async () => {
    if (!isMetaMaskInstalled() || !window.ethereum?.request) { // Check request method existence too
      onError('MetaMask is not installed or is incompatible.'); // Use onError prop
      toast({
        title: "MetaMask Not Found",
        description: "Please install the MetaMask browser extension.",
        variant: "destructive", // Use destructive variant for errors
        action: <Button variant="outline" size="sm" onClick={() => window.open('https://metamask.io/download/', '_blank')}>Install</Button>
      });
      return;
    }

    // Clear previous errors before attempting connection
    onError('');

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' }) as string;

      if (accounts.length > 0 && currentChainId) {
        console.log('Wallet connected via button:', accounts[0], 'on chain:', currentChainId);
        onConnect(accounts[0], currentChainId); // Call parent's connect handler
        toast({
            title: "Wallet Connected",
            description: `Connected to ${shortenAddress(accounts[0])}`,
        });
      } else {
         throw new Error("MetaMask did not return accounts or chain ID after request.");
      }
    } catch (err: any) { // Catch specific error types if needed
      console.error("Error connecting wallet:", err);
      let message = `Failed to connect wallet: ${err.message || 'Unknown error'}`;
      if (err.code === 4001) { // Standard EIP-1193 user rejected request error
        message = 'Connection request rejected by user.';
      } else if (err.code === -32002) { // Request already pending error
         message = 'Connection request already pending. Please check MetaMask.';
      }
      onError(message); // Report error to parent
      toast({ title: "Connection Failed", description: message, variant: "destructive" });
      // Don't automatically disconnect here, let the checkConnection handle state if needed
    }
  };

  // --- Disconnect Wallet Action (Updates App State) ---
   const handleDisconnectClick = () => {
     console.log("Disconnect button clicked - updating app state.");
     onDisconnect(); // Call parent's disconnect handler
     toast({
       title: "Wallet Disconnected",
       description: "Your wallet connection state in the app has been cleared.",
       variant: "info" // Use info variant as it's a user action
     });
   };


  const shortenAddress = (address: string | null): string => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // --- Render Logic uses props: isConnected and account ---
  return (
    <header className="w-full py-4 px-6 md:px-10 flex items-center justify-between shadow-sm dark:shadow-md">
      <div className="flex items-center">
        <img src={btchyperLogo} alt="logo" width={"100px"} height={"50px"} />
        {/* <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-500 to-teal-400 bg-clip-text text-transparent">
          Interchain Bridge {/* Your App Name 
        </h1> */}
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-6">
        <nav className="flex items-center space-x-6">
          {/* Links */}
          <a href="#" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-teal-400 transition-colors">
            Bridge
          </a>
          <a href="#" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-teal-400 transition-colors">
            History
          </a>
          <a href="#" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-teal-400 transition-colors">
            FAQ
          </a>
        </nav>

        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </Button>

          {/* Wallet Button Logic */}
          {!metaMaskInstalled ? ( // If MetaMask is not detected at all
             <Button
                onClick={() => window.open('https://metamask.io/download/', '_blank')}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-4 py-2 text-sm"
              >
               Install MetaMask
             </Button>
          ) : isConnected && account && connectedAccount? ( // If installed AND connected (based on props)
            <div className="flex items-center space-x-2">
            {!isQROpen &&
            <>
             <Button onClick={handleTransferTok} className="bg-gradient-to-r from-purple-500 to-teal-400 hover:from-purple-600 hover:to-teal-500 text-white rounded-full px-4 py-2 text-sm">
              Transfer Token
            </Button>
            <Button onClick={handleBridgeTok} className="bg-gradient-to-r from-purple-500 to-teal-400 hover:from-purple-600 hover:to-teal-500 text-white rounded-full px-4 py-2 text-sm">
              Bridge
            </Button>
            </>}
              <div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-200 font-mono">
                {shortenAddress(account)}
              </div>
             
              <Button
                variant="outline" // Changed variant for better visibility
                size="sm"
                onClick={handleDisconnectClick} // Use the disconnect handler
                className="text-sm text-red-600 border-red-500 hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900/20 rounded-full"
                aria-label="Disconnect wallet"
              >
                Disconnect
              </Button>
            </div>
          ) : ( // If installed but NOT connected
            <Button onClick={connectWalletAction} className="bg-gradient-to-r from-purple-500 to-teal-400 hover:from-purple-600 hover:to-teal-500 text-white rounded-full px-4 py-2 text-sm">
              Connect Wallet
            </Button>
          )}
        </div>
      </div>

      {/* --- Mobile Menu --- */}
      <div className="md:hidden flex items-center space-x-2">
         {/* Theme Toggle */}
         <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
        {/* Hamburger Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-600 dark:text-gray-300"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 p-4 shadow-lg z-50 border-t border-gray-200 dark:border-gray-700 animate-fade-in">
          {/* Mobile Nav Links */}
          <nav className="flex flex-col space-y-3 mb-4">
             <a href="#" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-teal-400" onClick={()=>setIsMobileMenuOpen(false)}>Bridge</a>
             <a href="#" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-teal-400" onClick={()=>setIsMobileMenuOpen(false)}>History</a>
             <a href="#" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-teal-400" onClick={()=>setIsMobileMenuOpen(false)}>FAQ</a>
          </nav>
          <hr className="border-gray-200 dark:border-gray-700 my-3"/>
          {/* Mobile Wallet Button/Info */}
          {!metaMaskInstalled ? (
             <Button
                onClick={() => { window.open('https://metamask.io/download/', '_blank'); setIsMobileMenuOpen(false); }}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-4 py-2 text-sm w-full mb-2"
              >
               Install MetaMask
             </Button>
          ) : isConnected && account ? (
            <div className="flex flex-col items-start space-y-2">
                <div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-200 font-mono">
                    {shortenAddress(account)}
                </div>
                 <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { handleDisconnectClick(); setIsMobileMenuOpen(false); }}
                    className="text-sm text-red-500 hover:text-red-600 dark:hover:text-red-400 px-0"
                 >
                    Disconnect
                 </Button>
            </div>
          ) : (
            <Button onClick={() => { connectWalletAction(); setIsMobileMenuOpen(false); }} className="bg-gradient-to-r from-purple-500 to-teal-400 hover:from-purple-600 hover:to-teal-500 text-white rounded-full px-4 py-2 text-sm w-full">
              Connect Wallet
            </Button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
