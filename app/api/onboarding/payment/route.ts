import { NextResponse, NextRequest } from 'next/server';
import Stripe from 'stripe';

// Initialize the Stripe instance using the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia' as any, // Adjust if using a different API version
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, selectedServices } = body;

    if (!userId) {
      return NextResponse.json(
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

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    
    // Return a detailed 500 message so we know exactly what is failing
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
