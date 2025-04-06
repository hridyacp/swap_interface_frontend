
import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import BridgeForm from '@/components/BridgeForm';
import TransactionHistory from '@/components/TransactionHistory';
import Footer from '@/components/Footer';
import { toast } from '@/hooks/use-toast';
import PrivateForm from '@/components/PrivateForm';

const PrivateTransaction = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [error, setError] = useState(''); // Wallet connection errors

  // --- Wallet Connection Handlers ---
  const handleConnect = useCallback((connectedAccount, connectedChainId) => {
    console.log("App: Wallet Connected", connectedAccount, connectedChainId);
    setAccount(connectedAccount);
    setChainId(connectedChainId);
    setIsConnected(true);
    setError(''); // Clear errors on successful connection
  }, []); // Empty dependency array - function identity is stable

  const handleDisconnect = useCallback(() => {
    console.log("App: Wallet Disconnected");
    setAccount(null);
    setIsConnected(false);
    setChainId(null);
    // Don't clear error here, disconnection might be due to an error
  }, []);

  const handleAccountChange = useCallback((newAccount) => {
    console.log("App: Account Changed", newAccount);
    setAccount(newAccount);
    // Fetch new balance/data if needed, potentially triggered within SwapInterface via useEffect
  }, []);

  const handleChainChange = useCallback((newChainId) => {
    console.log("App: Chain Changed", newChainId);
    setChainId(newChainId);
    // Application might need to reset state or re-fetch chain-specific data
  }, []);

  const handleError = useCallback((errorMessage: string) => {
    console.error("App: Wallet Error", errorMessage);
    setError(errorMessage);
    // Potentially disconnect if error is severe
    // handleDisconnect();
  }, []); 

  // Initialize theme based on user preference or localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(prefersDark);
    }

    // Simulate loading state for smoother transitions
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Welcome toast
      toast({
        title: "Welcome to Bridge Exchange",
        description: "Transfer assets across chains with ease",
        variant: "default",
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Toggle theme and save preference
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    
    toast({
      title: `${newTheme ? 'Dark' : 'Light'} Mode Enabled`,
      description: `Switched to ${newTheme ? 'dark' : 'light'} theme`,
    });
  };

  // Update document class for theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  }, [isDarkMode]);

  return (
  
    <div className={`min-h-screen flex flex-col transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
    <Header 
      isDarkMode={isDarkMode} 
      toggleTheme={toggleTheme} 
      connectedAccount={account}
      isConnected={isConnected}
      chainId={chainId} // Pass chainId down if needed by connector UI
      account={account}
      onConnect={handleConnect}
      onDisconnect={handleDisconnect}
      onAccountChange={handleAccountChange}
      onChainChange={handleChainChange}
      onError={handleError}
    />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16 flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center bg-gradient-to-r from-bridge-purple to-bridge-teal bg-clip-text text-transparent animate-float">
          Bridge Assets Across Chains
        </h1>
        <p className="text-gray-400 max-w-xl text-center mb-10 animate-fade-in">
          Seamlessly transfer your assets between multiple blockchains with low fees and fast confirmation times.
        </p>
        
        <div className="w-full max-w-md">
          <PrivateForm
           connectedAccount={account}
           isConnected={isConnected}
           chainId={chainId} // Pass chainId down if needed by connector UI
           account={account}
          />
          <TransactionHistory />
        </div>
      </main>
      <Footer />
      </div>

  );
};

export default PrivateTransaction;
