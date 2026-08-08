import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe securely using your secret backend key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16', 
});

// A secure price map to prevent frontend tampering (prices match your screenshot)
const SERVICE_PRICES: Record<string, number> = {
  'google_workspace': 995,       // $9.95
  'custom_domain': 2500,         // $25.00
  'shipping_calltag': 2500,      // $25.00
  'stripe_terminals': 0,         // Hardware addon (billed separately or $0 setup)
  'premium_templates': 9900,     // $99.00
  'business_registry': 0,        // Registry setup (varies)
  'onboarding_fee': 9500         // $95.00 base fee
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { services } = body;

    // 1. Securely calculate the total on the server in cents
    let totalAmountInCents = SERVICE_PRICES['onboarding_fee']; // Always include base fee
    
    if (Array.isArray(services)) {
      services.forEach((serviceId) => {
        if (SERVICE_PRICES[serviceId]) {
          totalAmountInCents += SERVICE_PRICES[serviceId];
        }
      });
    }

    // Add 8.25% estimated sales tax (matches your screenshot logic)
    const tax = Math.round(totalAmountInCents * 0.0825);
    const finalAmountInCents = totalAmountInCents + tax;

    // 2. Generate the secure payment session with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmountInCents,
      currency: 'usd',
      metadata: { 
        services_selected: services.join(', ') 
      },
    });

    // 3. Send the secure token back to the frontend
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    
  } catch (error: any) {
    console.error("Stripe Intent Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
