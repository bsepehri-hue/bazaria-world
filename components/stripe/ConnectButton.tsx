'use client';

import React, { useState } from 'react';
import { useWallet } from "@/app/context/WalletContext";
import { createStripeOnboardingLink, createStripeSettingsLink } from '@/actions/stripe';
import { Plug, Settings, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button'; // NEW IMPORT
import { Card } from '@/components/ui/Card'; // NEW IMPORT

// Mock state to simulate whether the user is already connected to Stripe
const mockStripeAccountId: string | null = 'acct_mocked12345'; 

export const StripeConnectActions: React.FC = () => {
  const { address, isConnected } = useWallet();
  const [isPending, setIsPending] = useState(false);
  const [isStripeConnected, setIsStripeConnected] = useState(!!mockStripeAccountId);
  
  const handleOnboard = async () => {
    if (!address || isStripeConnected) return;
    setIsPending(true);
    try {
      await createStripeOnboardingLink(address);
    } catch (e) {
      console.error('Stripe Onboarding initiation failed:', e);
      setIsPending(false); 
      alert('Failed to initiate Stripe onboarding. Check console.');
    }
  };

  const handleSettings = async () => {
    if (!mockStripeAccountId || !isStripeConnected) return;
    setIsPending(true);
    try {
      await createStripeSettingsLink(mockStripeAccountId);
    } catch (e) {
      console.error('Stripe Settings initiation failed:', e);
      setIsPending(false);
      alert('Failed to initiate Stripe settings. Check console.');
    }
  };

  if (!isConnected) {
    return null;
  }

  return (
    // Refactored to use Card for container consistency
    <Card className="!bg-yellow-50 border border-yellow-300 shadow-inner p-4"> 
      {isStripeConnected ? (
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <p className="flex-1 flex items-center text-sm font-medium text-yellow-800">
            ✅ Stripe Connected ({mockStripeAccountId})
          </p>
          {/* Replaced raw button with Button primitive */}
          <Button
            onClick={handleSettings}
            disabled={isPending}
            variant="secondary"
            className="w-full sm:w-auto text-sm"
          >
            <Settings className="w-4 h-4 mr-2" />
            {isPending ? 'Redirecting...' : 'Update Payout Settings'}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <p className="flex-1 flex items-center text-sm font-medium text-yellow-800">
            <AlertTriangle className="w-5 h-5 mr-2" /> 
            Connect Stripe to receive fiat payouts and card payments.
          </p>
          {/* Replaced raw button with Button primitive */}
          <Button
            onClick={handleOnboard}
            disabled={isPending}
            variant="primary"
            className="w-full sm:w-auto text-sm"
          >
            <Plug className="w-4 h-4 mr-2" />
            {isPending ? 'Generating Link...' : 'Connect Stripe Account'}
          </Button>
        </div>
      )}
    </Card>
  );
};
