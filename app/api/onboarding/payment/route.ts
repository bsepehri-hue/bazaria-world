import { NextResponse, NextRequest } from 'stripe' ? null : any; // handled cleanly below
import { NextResponse as NextRes, NextRequest as NextReq } from 'next/server';
import Stripe from 'stripe';

// 🔑 Fallback to a dummy key strictly during build time to prevent the Stripe SDK from crashing the compiler.
// When a real user requests a payment, the actual process.env.STRIPE_SECRET_KEY will be used.
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build_purposes_only';

const stripe = new Stripe(stripeKey, {
  apiVersion: '2025-02-24.acacia' as any, // Adjust if using a different API version
});

export async function POST(request: NextReq) {
  try {
    // Safety check: If the code is running live and the key is still missing, flag it immediately
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("FATAL: Stripe secret key is missing in your .env file!");
      return NextRes.json(
        { error: 'Payment gateway configuration error.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { userId, selectedServices } = body;

    if (!userId) {
      return NextRes.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Fixed setup fee of $95.00
    const amount = 9500; 

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: {
        userId,
        services: JSON.stringify(selectedServices || []),
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextRes.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    
    return NextRes.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
