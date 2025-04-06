import React, { useState, useEffect } from 'react';
import SelfQRcodeWrapper, { countries, SelfApp, SelfAppBuilder } from '@selfxyz/qrcode';
import { ethers } from 'ethers';

  interface modalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
   connectedAccount: string | null;
  }

const QrSccan: React.FC<modalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    connectedAccount,
  }) =>{
    const [input, setInput] = useState(connectedAccount);
    const [address, setAddress] = useState(input);
    const [disclosures, setDisclosures] = useState({
        // DG1 disclosures
        issuing_state: false,
        name: false,
        nationality: true,
        date_of_birth: false,
        passport_number: false,
        gender: false,
        expiry_date: false,
        // Custom checks
        minimumAge: 18,
        excludedCountries: [
            countries.IRAN,
            countries.IRAQ,
            countries.NORTH_KOREA,
            countries.RUSSIA,
            countries.SYRIAN_ARAB_REPUBLIC,
            countries.VENEZUELA
        ],
        ofac: [true,true,true],
    });

    const [ensName, setEnsName] = useState<string | null>(null);
    const userId=input;
   

    useEffect(() => {
        const resolveEns = async () => {
            try {
                 const provider = new ethers.providers.Web3Provider(window.ethereum);
    
                if (input.toLowerCase().endsWith('.eth')) {
                    const resolvedAddress = await provider.resolveName(input);
                    if (resolvedAddress) {
                        setAddress(resolvedAddress);
                        setEnsName(input);
                    }
                } else if (ethers.isAddress(input)) {
                    const resolvedName = await provider.lookupAddress(input);
                    setEnsName(resolvedName);
                } else {
                    setEnsName(null);
                }
            } catch (error) {
                console.error('Error resolving ENS:', error);
                setEnsName(null);
            }
        };
    
        resolveEns();
    }, [input]);


    const selfApp = new SelfAppBuilder({
        appName: "Complaiance check",
        scope: "complaiance-check",
        // endpoint: "https://happy-birthday-rho-nine.vercel.app/api/verify",
        // run `ngrok http 3000` and copy the url here to test locally
        endpoint: "https://38da-49-32-185-43.ngrok-free.app/api/verify",
        userId,
        userIdType: "hex",
        disclosures: {issuing_state: false,
            name: false,
            nationality: true,
            date_of_birth: false,
            passport_number: false,
            gender: false,
            expiry_date: false,
            // Custom checks
            minimumAge: 18,
            excludedCountries: [
                countries.IRAN,
                countries.IRAQ,
                countries.NORTH_KOREA,
                countries.RUSSIA,
                countries.SYRIAN_ARAB_REPUBLIC,
                countries.VENEZUELA
            ],
            ofac: true},
        devMode: false,
     
    } as Partial<SelfApp>).build();

   

    return (
      
        <div className="min-h-screen bg-white text-black">
            <nav className="w-full bg-white border-b border-gray-200 py-3 px-6 flex items-center justify-between">
                <div className="flex items-center">
                    <div className="mr-8">
                        <img
                            src="/self.svg" 
                            alt="Self Logo" 
                            className="h-8"
                        />
                    </div>
                </div>
              
            </nav>

            <div className="container mx-auto max-w-2xl px-4 py-8">
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-300">
                    <h2 className="text-2xl font-semibold mb-6 text-center">
                        Lets get you verified
                    </h2>

                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Your wallet address:
                        </label>
                        <div>{connectedAccount}</div>
                        {ensName && ensName !== address && (
                            <p className="mt-2 text-sm text-gray-600">
                                ✓ Resolved: {ensName}
                            </p>
                        )}
                    </div>

                    {selfApp && (
                        <div className="flex justify-center mb-6">
                            <SelfQRcodeWrapper
                                selfApp={selfApp}
                              
                                onSuccess={onSuccess}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
      
    );
}

export default QrSccan;
