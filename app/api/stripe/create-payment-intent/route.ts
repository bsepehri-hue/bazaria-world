import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from '@/lib/firebase/admin'; 
// (If your export is named 'db', just change 'adminDb' to 'db' here and in the code below)

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16', 
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, paymentStructure, shippingCost, taxAmount } = body; 
    
    // Grab the primary asset from the cart payload
    const asset = items[0]; 
    const sellerId = asset.sellerId; // e.g., 'djcO5vyqRGPR2zRVu80gVQMv5eZ2'

    // 1. Fetch the Seller's Stripe Connect ID from Firestore
    let sellerDoc = await adminDb.collection('partners').doc(sellerId).get();
    
    // Fallback just in case the seller is in the 'users' collection instead
    if (!sellerDoc.exists) {
        sellerDoc = await adminDb.collection('users').doc(sellerId).get();
    }

    if (!sellerDoc.exists) {
        throw new Error("Seller profile not found in database.");
    }

    const sellerData = sellerDoc.data();
    const connectedSellerId = sellerData?.stripeAccountId;

    if (!connectedSellerId) {
        throw new Error("Seller has not connected a verified Stripe account.");
    }

    // 2. Fetch the true asset base price from your DB to prevent frontend spoofing
    // For this example, assuming you fetch it or pass it securely
    const trueBasePrice = asset.price; // We are expecting 8000 here for your test

    let amountToCharge = 0;
    let applicationFeeAmount = 0;

    // 3. The Routing & Fee Logic
    if (paymentStructure === 'pay_in_full') {
      const buyerPremium = trueBasePrice * 0.03;      // $240 (Paid by buyer)
      const sellerPlatformFee = trueBasePrice * 0.03; // $240 (Paid by seller)
      
      const tax = Number(taxAmount) || 0; 
      const shipping = Number(shippingCost) || 0;

      // Buyer Total: Base ($8000) + Premium ($240) + Tax + Shipping
      amountToCharge = trueBasePrice + buyerPremium + tax + shipping;
      
      // Bazaria's Total Cut: Buyer Premium ($240) + Seller Platform Fee ($240)
      applicationFeeAmount = buyerPremium + sellerPlatformFee; 

    } else if (paymentStructure === 'escrow_binder') {
      // 10% Escrow Binder Logic
      const binderAmount = trueBasePrice * 0.10; // $800
      const upfrontCommission = binderAmount * 0.10; // $80 (Bazaria's cut)
      
      amountToCharge = binderAmount; 
      applicationFeeAmount = upfrontCommission; 
    } else {
        throw new Error("Invalid payment structure provided.");
    }

    // 4. Convert to Cents for Stripe (Crucial step!)
    const stripeTotalAmount = Math.round(amountToCharge * 100);
    const stripePlatformFee = Math.round(applicationFeeAmount * 100);

    // 5. Create the Destination Charge via Stripe Connect
    const paymentIntent = await stripe.paymentIntents.create({
      amount: stripeTotalAmount,
      currency: 'usd',
      // Allow both card and ACH natively through Stripe Elements
      payment_method_types: ['card', 'us_bank_account'], 
      application_fee_amount: stripePlatformFee,
      transfer_data: {
        // 🚨 Here is where the ID from your screenshot is utilized!
        destination: connectedSellerId, 
      },
      metadata: {
        paymentStructure,
        originalAssetPrice: trueBasePrice,
        bazariaTotalFee: applicationFeeAmount,
        assetId: asset.id,
      }
    });

    // 6. Return the secret so the frontend Elements can render the UI
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error: any) {
    console.error('Stripe API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
