/// <reference types="vite/client" />
import { ethers } from 'ethers'; // Or import a more basic EIP-1193 type if preferred

// Define a base provider type based on EIP-1193 if you don't want ethers dependency here
// interface Eip1193Provider {
//   request(args: { method: string; params?: unknown[] | object }): Promise<unknown>;
//   on(eventName: string | symbol, listener: (...args: any[]) => void): this;
//   removeListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
//   isMetaMask?: boolean;
// }

declare global {
  interface Window {
    // Define ethereum as an optional property using the '?'
    // Use a specific type from ethers.js if you use it consistently,
    // otherwise, a basic EIP-1193 type might suffice.
    ethereum?: ethers.providers.ExternalProvider | ethers.providers.JsonRpcFetchFunc;
    // Example using a basic EIP-1193 type:
    // ethereum?: Eip1193Provider;
  }
}

// IMPORTANT: This line makes the file a module, which is necessary for global augmentation.
export {};

