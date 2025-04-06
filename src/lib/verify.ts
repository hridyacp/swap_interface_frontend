interface Groth16Proof {
    a: [string, string];
    b: [[string, string], [string, string]];
    c: [string, string];
    // protocol: string; // Often included but might not be needed by contract directly
    // curve: string;    // Often included but might not be needed by contract directly
}
export default async function Verify(){
    const verifyApiUrl = 'http://localhost:3001/api/verify'; // Ensure port matches server

        try {
            const response = await axios.post(verifyApiUrl, {
                proof: proofData,
                publicSignals: publicSignalsData,
            });

            // Handle successful API response (HTTP 200)
            console.log("API Response Data:", response.data);
           
            if (response.data.transactionHash) {
                console.log("transaction")
            }

        } catch (error) {
        }
}