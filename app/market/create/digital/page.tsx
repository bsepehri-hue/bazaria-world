// app/market/create/digital/page.tsx
'use client';
import { useState } from 'react';
import { ethers } from 'ethers';
import { DIGITAL_MARKET_CONFIG } from '@/lib/marketConstants'; // Adjust import based on your path

export default function DigitalIntakePage() {
  const [assetId, setAssetId] = useState('');
  const [reservePrice, setReservePrice] = useState('');

  const handleListAsset = async () => {
    // 1. Connect to MetaMask
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    // 2. Initialize the contract
    const contract = new ethers.Contract(
      DIGITAL_MARKET_CONFIG.address,
      DIGITAL_MARKET_CONFIG.abi,
      signer
    );

    // 3. Trigger the blockchain transaction
    const tx = await contract.listAsset(assetId, ethers.parseEther(reservePrice));
    await tx.wait();
    alert("Asset successfully listed on the Digital Marketplace!");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">List Digital Asset</h1>
      {/* Your form inputs here */}
      <input type="number" placeholder="Asset ID" onChange={(e) => setAssetId(e.target.value)} />
      <input type="text" placeholder="Reserve Price (ETH)" onChange={(e) => setReservePrice(e.target.value)} />
      <button onClick={handleListAsset}>Submit to Digital Market</button>
    </div>
  );
}
