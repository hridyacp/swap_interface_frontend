import { NextApiRequest, NextApiResponse } from 'next';
import { getUserIdentifier } from '@selfxyz/core'; // Optional server-side check
import { ethers } from 'ethers';
// Adjust the path to your ABI file - this path is relative to the project root usually
// Example: if abi.ts is in 'src/lib/abi.ts' use 'src/lib/abi'
import { abi } from '../lib/abi'; // <-- ADJUST THIS PATH

// Define expected structure for the proof (Groth16 specifically)
interface Groth16Proof {
    a: [string, string];
    b: [[string, string], [string, string]];
    c: [string, string];
    // protocol: string; // Often included but might not be needed by contract directly
    // curve: string;    // Often included but might not be needed by contract directly
}

// Define the expected request body structure
interface VerifyRequestBody {
    proof: Groth16Proof;
    publicSignals: string[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // 1. Handle Method Not Allowed
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    try {
        // 2. Validate Request Body
        const { proof, publicSignals } = req.body as VerifyRequestBody;

        if (!proof || typeof proof !== 'object' || !publicSignals || !Array.isArray(publicSignals)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid request body. "proof" (object) and "publicSignals" (array) are required.',
                result: false,
             });
        }

        // Basic structural validation for the proof object keys (can be more thorough)
        if (!proof.a || !proof.b || !proof.c) {
             return res.status(400).json({
                status: 'error',
                message: 'Invalid proof structure. Missing "a", "b", or "c" components.',
                result: false,
             });
        }

        console.log("API Received Proof:", JSON.stringify(proof, null, 2));
        console.log("API Received Public signals:", publicSignals);

        // 3. Contract and Network Details
        const contractAddress = "0x881ED38b3ba7EE24eEAD094FA5D6ddD2F56Ba1c0";
        const rpcUrl = "https://forno.celo.org"; // Celo Mainnet RPC

        // 4. Server-Side Wallet Setup (CRITICAL SECURITY POINT)
        const privateKey = process.env.SERVER_WALLET_PRIVATE_KEY;
        if (!privateKey) {
            console.error("SERVER_WALLET_PRIVATE_KEY environment variable not set.");
            return res.status(500).json({
                status: 'error',
                message: 'Server configuration error: Missing private key.',
                result: false,
             });
        }

        const provider = new ethers.JsonRpcProvider(rpcUrl);
        const signer = new ethers.Wallet(privateKey, provider); // Server's wallet

        console.log(`Server wallet address (${signer.address}) will send the transaction.`);

        // 5. Optional: Extract Identifier Server-Side (for logging/pre-check)
        try {
             const extractedAddress = await getUserIdentifier(publicSignals, "hex");
             console.log("Extracted address from verification public signals:", extractedAddress);
             // You could potentially add checks here if needed, e.g., against an allowlist
        } catch (getIdError) {
             console.warn("Could not extract user identifier from public signals:", getIdError);
             // Decide if this is a fatal error for your use case or just a warning
        }


        // 6. Interact with the Smart Contract
        const contract = new ethers.Contract(contractAddress, abi, signer);

        try {
            console.log("Formatting proof for contract call...");
             // IMPORTANT: Ensure the proof format matches the contract's expected input
             // The `verifySelfProof` function in the example expects `b` swapped like this:
            const formattedProofForContract = {
                a: proof.a,
                b: [
                    [proof.b[0][1], proof.b[0][0]], // Swapped inner elements
                    [proof.b[1][1], proof.b[1][0]], // Swapped inner elements
                ],
                c: proof.c,
                pubSignals: publicSignals, // Pass public signals directly
            };

            console.log("Calling verifySelfProof on contract...");
            const tx = await contract.verifySelfProof(formattedProofForContract);

            console.log(`Transaction sent: ${tx.hash}. Waiting for confirmation...`);
            const receipt = await tx.wait(1); // Wait for 1 confirmation

            if (receipt && receipt.status === 1) {
                console.log("Successfully called verifySelfProof function on-chain.", receipt);
                // Success Response
                return res.status(200).json({
                    status: 'success',
                    message: 'Proof verified successfully on-chain.',
                    result: true,
                    transactionHash: tx.hash,
                    // You might return credentialSubject data if the proof revealed any
                    // and if the contract emits events you can parse, but the base
                    // verifySelfProof likely just returns true/reverts.
                    credentialSubject: {},
                });
            } else {
                 console.error("Transaction failed or was reverted.", receipt);
                 return res.status(400).json({
                    status: 'error',
                    message: 'On-chain verification transaction failed or was reverted.',
                    result: false,
                    transactionHash: tx.hash,
                    details: receipt, // Include receipt details for debugging if safe
                });
            }

        } catch (contractError: any) {
            console.error("Error calling verifySelfProof function:", contractError);

            // Try to extract a more specific revert reason
            let reason = 'Contract interaction failed.';
            if (contractError.reason) {
                reason = `Verification reverted: ${contractError.reason}`;
            } else if (contractError.data?.message) {
                 reason = `Contract error: ${contractError.data.message}`;
            } else if (contractError.message) {
                 // Fallback to general error message
                 reason = contractError.message;
            }

             // Use 400 Bad Request if it's likely a revert due to invalid proof/signals
            return res.status(400).json({
                status: 'error',
                result: false,
                message: 'On-chain verification failed.',
                 // Provide a cleaner reason if available, avoid overly technical details unless needed for frontend debugging
                details: reason,
            });
        }
    } catch (error: any) {
        // 7. General Error Handling
        console.error('Unhandled error verifying proof:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error during proof verification.',
            result: false,
            error: error instanceof Error ? error.message : 'Unknown error', // Avoid sending stack traces to client
        });
    }
}
