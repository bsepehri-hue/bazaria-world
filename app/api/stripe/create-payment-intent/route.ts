import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16', 
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, paymentStructure } = body; 
    const asset = items[0]; // Grabbing the asset from the cart payload

    // 1. 🚨 SECURITY: Fetch the true asset base price from your DB here!
    // For this example, we will assume you fetched it and it is $8,000
    const trueBasePrice = 8000; // e.g., await db.assets.findById(asset.id).price;
    const connectedSellerId = asset.sellerId; // The seller's Stripe Connect ID (e.g., 'acct_12345')

    let amountToCharge = 0;
    let applicationFeeAmount = 0;

    // 2. The Routing Logic
    if (paymentStructure === 'pay_in_full') {
      
      const buyerPremium = trueBasePrice * 0.03; // $240 (Paid by buyer)
      const sellerPlatformFee = trueBasePrice * 0.03; // $240 (Paid by seller)
      
      // Note: Add your actual tax and shipping API results here
      const tax = 681.71; 
      const shipping = 23.16;

      // The Buyer's Total Swipe (Base + Premium + Tax + Shipping) = $8,944.87
      amountToCharge = trueBasePrice + buyerPremium + tax + shipping;
      
      // Bazaria's Total Cut (Buyer Premium + Seller Platform Fee) = $480.00
      applicationFeeAmount = buyerPremium + sellerPlatformFee; 

    } else if (paymentStructure === 'escrow_binder') {
      
      // 10% Escrow Binder Logic
      const binderAmount = trueBasePrice * 0.10; // $800
      
      // Bazaria's upfront commission is 10% of the binder
      const upfrontCommission = binderAmount * 0.10; // $80
      
      // For the binder, we just charge the $800 flat (taxes/shipping calculated later)
      amountToCharge = binderAmount; 
      applicationFeeAmount = upfrontCommission; 
    }

    // 3. Convert to Cents for Stripe (Crucial step!)
    const stripeTotalAmount = Math.round(amountToCharge * 100);
    const stripePlatformFee = Math.round(applicationFeeAmount * 100);

    // 4. Create the Destination Charge via Stripe Connect
    const paymentIntent = await stripe.paymentIntents.create({
      amount: stripeTotalAmount,
      currency: 'usd',
      // We accept both card and ACH here. If they choose ACH, Stripe UI handles it.
      payment_method_types: ['card', 'us_bank_account'], 
      application_fee_amount: stripePlatformFee,
      transfer_data: {
        destination: connectedSellerId, // Routes the remaining funds to the seller's escrow bucket
      },
      metadata: {
        paymentStructure,
        originalAssetPrice: trueBasePrice,
        bazariaTotalFee: applicationFeeAmount,
      }
    });

    // 5. Send the secret back to the frontend checkout page
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error: any) {
    console.error('Stripe API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
