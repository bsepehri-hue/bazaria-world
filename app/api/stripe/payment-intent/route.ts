import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// 🔍 TRACKER 1: Verify the server sees the file and the key
console.log("Stripe API Route Loaded. Secret Key exists:", !!process.env.STRIPE_SECRET_KEY);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16', 
});

const SERVICE_PRICES: Record<string, number> = {
  'google_workspace': 995,       
  'custom_domain': 2500,         
  'shipping_calltag': 2500,      
  'stripe_terminals': 0,         
  'premium_templates': 9900,     
  'business_registry': 0,        
  'onboarding_fee': 9500         
};

export async function POST(req: Request) {
  console.log("💰 POST request received at /api/stripe/payment-intent");
  
  try {
    const body = await req.json();
    const { services } = body;
    
    console.log("📥 Services array received from frontend:", services);

    let totalAmountInCents = SERVICE_PRICES['onboarding_fee']; 
    
    if (Array.isArray(services)) {
      services.forEach((serviceId) => {
        if (SERVICE_PRICES[serviceId]) {
          totalAmountInCents += SERVICE_PRICES[serviceId];
        }
      });
    }

    const tax = Math.round(totalAmountInCents * 0.0825);
    const finalAmountInCents = totalAmountInCents + tax;

    console.log("🧮 Calculated final amount (cents):", finalAmountInCents);

    // 🛡️ THE FIX: Ensure metadata string is never completely empty
    const safeMetadataString = Array.isArray(services) && services.length > 0 
      ? services.join(', ').substring(0, 500) 
      : 'No addons selected';

    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmountInCents,
      currency: 'usd',
      metadata: { 
        services_selected: safeMetadataString 
      },
    });

    console.log("✅ PaymentIntent successfully created:", paymentIntent.id);

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    
  } catch (error: any) {
    // 🚨 TRACKER 2: Catch the exact reason Stripe is rejecting it
    console.error("❌ Stripe Intent Error inside API route:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
