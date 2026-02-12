'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { createStorefrontAction, StorefrontFormState } from '@/actions/storefront';
import { useWallet } from '@/context/WalletContext';
import { Contract, Interface, MaxUint256, TransactionResponse } from 'ethers';
import { LIST_TO_BID_ABI, CONTRACT_ADDRESS } from '@/contracts/abis/ListToBid';

// Utility component for showing form submission status
const SubmitButton: React.FC<{ loading: boolean }> = ({ loading }) => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || loading}
      className={`
        w-full py-3 mt-6 text-white font-semibold rounded-lg shadow-md transition duration-300
        ${(pending || loading) 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-teal-600 hover:bg-teal-700'
        }
      `}
    >
      {pending ? 'Validating...' : loading ? 'Confirming Transaction...' : 'Create Storefront'}
    </button>
  );
};

export const CreateStorefrontForm: React.FC = () => {
  const { signer, isConnected, connectWallet } = useWallet();
  
  // State for tracking the blockchain transaction status
  const [txLoading, setTxLoading] = useState(false);
  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);

  // State for the server action
  const initialState: StorefrontFormState = {
    success: false,
    message: 'Fill out the form to create your storefront.',
  };
  const [state, formAction] = useFormState(createStorefrontAction, initialState);
  
  const formRef = useRef<HTMLFormElement>(null);

  /**
   * Handles the Ethers transaction after the Server Action validates the input.
   * @param data The validated form data needed for the contract call.
   */
  const handleBlockchainTransaction = async (name: string, profileDataUri: string) => {
    if (!signer) {
      setTxStatus('error');
      alert('Wallet is not connected or signer is unavailable.');
      return;
    }

    setTxLoading(true);
    setTxStatus('pending');
    setTxHash(null);

    try {
      // 1. Initialize Contract
      const contract = new Contract(CONTRACT_ADDRESS, LIST_TO_BID_ABI, signer);
      
      // 2. Execute Transaction
      const tx: TransactionResponse = await contract.createStorefront(
        name,
        profileDataUri
        // Optionally, include overrides for gas limit, etc., here.
      );

      setTxHash(tx.hash);
      console.log('Transaction sent:', tx.hash);

      // 3. Wait for Transaction Confirmation (Mining)
      await tx.wait();

      setTxStatus('success');
      alert('Storefront successfully created on-chain!');
      
      // Clear the form after success
      formRef.current?.reset(); 

    } catch (error) {
      console.error('Blockchain Transaction Error:', error);
      // Check if it's a user-rejected error
      if (error instanceof Error && error.message.includes('user rejected transaction')) {
        setTxStatus('error');
        alert('Transaction rejected by user.');
      } else {
        setTxStatus('error');
        alert('Storefront creation failed. Check console for details.');
      }
    } finally {
      setTxLoading(false);
    }
  };

  // Effect to trigger the blockchain transaction after successful server validation
  useEffect(() => {
    if (state.success) {
      const formData = new FormData(formRef.current!);
      const name = formData.get('name') as string;
      const profileDataUri = (formData.get('profileDataUri') as string) || 'ipfs://placeholder-cid';
      
      // Only proceed to blockchain transaction if server validation passed
      handleBlockchainTransaction(name, profileDataUri);
    }
  }, [state.success, state.message]); // eslint-disable-line react-hooks/exhaustive-deps


  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-white rounded-xl shadow-lg border border-red-200">
        <h3 className="text-xl font-semibold text-red-600 mb-4">Wallet Required</h3>
        <p className="text-gray-600 mb-6">You must connect your wallet to create a new storefront.</p>
        <button
          onClick={connectWallet}
          className="bg-teal-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-teal-700 transition"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-2xl border border-gray-100">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Create Your Storefront</h2>
      <p className="text-gray-500 mb-8">
        Your storefront will be registered as a unique vault on the ListToBid smart contract.
      </p>

      {/* Status Message Display */}
      <div 
        className={`p-3 mb-6 rounded-lg border 
          ${txStatus === 'success' ? 'bg-green-100 border-green-400 text-green-700' : ''}
          ${txStatus === 'pending' ? 'bg-yellow-100 border-yellow-400 text-yellow-700' : ''}
          ${txStatus === 'error' ? 'bg-red-100 border-red-400 text-red-700' : ''}
          ${txStatus === 'idle' && state.message ? 'bg-blue-100 border-blue-400 text-blue-700' : ''}
          ${!txLoading && txStatus === 'idle' && !state.message ? 'hidden' : 'block'}
        `}
      >
        {txStatus === 'pending' && (
          <p className="font-medium">
            Transaction is pending... <span className="animate-pulse">Mining...</span>
            {txHash && (
              <a 
                href={`https://amoy.polygonscan.com/tx/${txHash}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block text-sm underline mt-1"
              >
                View Transaction on PolygonScan
              </a>
            )}
          </p>
        )}
        {txStatus === 'success' && <p className="font-medium">Storefront created successfully! 🎉</p>}
        {txStatus === 'error' && <p className="font-medium">Error: Check your console and try again.</p>}
        {txStatus === 'idle' && <p className="font-medium">{state.message}</p>}
      </div>


      <form ref={formRef} action={formAction} className="space-y-4">
        {/* Store Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition"
            placeholder="e.g., Emily's Crafts"
          />
          {state.errors?.name && (
            <p className="mt-1 text-xs text-red-500">{state.errors.name.join(', ')}</p>
          )}
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition"
            placeholder="A short description of what you sell."
          />
          {state.errors?.description && (
            <p className="mt-1 text-xs text-red-500">{state.errors.description.join(', ')}</p>
          )}
        </div>
        
        {/* Profile Data URI Field (Mock for IPFS/S3 URL) */}
        <div>
          <label htmlFor="profileDataUri" className="block text-sm font-medium text-gray-700 mb-1">Store Logo/Profile Data URI</label>
          <input
            id="profileDataUri"
            name="profileDataUri"
            type="url"
            // We use a placeholder URI in the action if this is empty
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition"
            placeholder="e.g., https://yourcdn.com/logo.png or ipfs://cid"
          />
          {state.errors?.profileDataUri && (
            <p className="mt-1 text-xs text-red-500">{state.errors.profileDataUri.join(', ')}</p>
          )}
        </div>

        <SubmitButton loading={txLoading} />
      </form>
      
      {/* Footer Disclaimer */}
      <p className="mt-8 text-xs text-gray-400 text-center">
        Note: Transaction fees will apply on the Polygon Amoy testnet.
      </p>
    </div>
  );
};
