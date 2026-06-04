"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

// 🎯 FIXED: Adding /app to match your actual file structure
import { createStorefrontAction, type StorefrontFormState } from "@/actions/storefront";
import { useWallet } from "@/app/context/WalletContext";

import { Contract, Interface, MaxUint256, type TransactionResponse } from 'ethers';
import { ListToBidABI } from "@/contracts/abis/ListToBid";

/import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from "@/lib/firebase/client";

const onSubmit = async (data: any) => {
    setRegistryError('');
    
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setRegistryError("No authenticated identity detected.");
      return;
    }

    try {
      const db = getFirestore(app);
      const { getStorage, ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
      const storage = getStorage(app);

      // 1. Generate the URL-safe storefront handle
      const cleanHandle = data.storeName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-_]/g, '');

      if (cleanHandle.length < 3) {
        setRegistryError("Storefront name must yield an alphanumeric handle of at least 3 characters.");
        return;
      }

      let finalLogoUrl = "";
      let finalBannerUrl = "";

      // 2. Upload Logo File securely if it's a valid object asset
      if (logoFile && logoFile instanceof File) {
        const logoRef = ref(storage, `storefronts/${currentUser.uid}/logo_${Date.now()}_${logoFile.name}`);
        const snapshot = await uploadBytes(logoRef, logoFile);
        finalLogoUrl = await getDownloadURL(snapshot.ref);
      } else if (typeof logoFile === 'string') {
        finalLogoUrl = logoFile;
      }

      // 3. Upload Banner File securely if it's a valid object asset
      if (bannerFile && bannerFile instanceof File) {
        const bannerRef = ref(storage, `storefronts/${currentUser.uid}/banner_${Date.now()}_${bannerFile.name}`);
        const snapshot = await uploadBytes(bannerRef, bannerFile);
        finalBannerUrl = await getDownloadURL(snapshot.ref);
      } else if (typeof bannerFile === 'string') {
        finalBannerUrl = bannerFile;
      }

      // 4. Build compile payload with both ownerId and userId definitions
      const formData = {
        ...data,
        handle: cleanHandle,
        logo: finalLogoUrl,     
        banner: finalBannerUrl, 
        
        // 🎯 THE TAB FIX RESOLUTION:
        // We provide BOTH keys so your dashboard query 'where("userId", "==", user.uid)' matches perfectly!
        userId: currentUser.uid,
        ownerId: currentUser.uid,
        
        status: "active",
        isActive: true, 
        updatedAt: new Date().toISOString()
      };
      
      console.log('Uploading settings and asset nodes securely:', formData);

      // 5. Commit document row straight to Firestore
      const storefrontProfileRef = doc(db, "storefronts", currentUser.uid);
      await setDoc(storefrontProfileRef, formData, { merge: true });

      onSuccess();

    } catch (err: any) {
      console.error("Onboarding Settings Exception Handler:", err);
      setRegistryError(err.message || "Failed to finalize brand identity integration.");
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
