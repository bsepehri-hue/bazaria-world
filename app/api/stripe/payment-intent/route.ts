import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16', 
});

const SERVICE_PRICES: Record<string, number> = {
  // Ensure these keys match exactly what your frontend services array outputs
  'google_workspace': 995,       
  'custom_domain': 2500,         
  'shipping_calltag': 2500,      
  'premium_templates': 9900,     
  'onboarding_fee': 9500         
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { services, coupon } = body; // 👈 NOW ACCEPTING COUPONS

    // 1. Start with base fee
    let totalAmountInCents = SERVICE_PRICES['onboarding_fee']; 
    
    // 2. Add any selected services
    if (Array.isArray(services)) {
      services.forEach((serviceId) => {
        // Try exact match or lowercase match to prevent ID mismatches
        const price = SERVICE_PRICES[serviceId] || SERVICE_PRICES[serviceId.toLowerCase()];
        if (price) {
          totalAmountInCents += price;
        }
      });
    }

    // 3. 🎟️ APPLY COUPON MATH
    if (coupon) {
      const code = coupon.trim().toUpperCase();
      if (code === 'LAUNCH100') {
        totalAmountInCents = Math.max(0, totalAmountInCents - 9500); // -$95.00
      } else if (code === 'LAUNCH50') {
        totalAmountInCents = Math.max(0, totalAmountInCents - 5000); // -$50.00
      } else if (code === 'BAZARIA20') {
        totalAmountInCents = Math.round(totalAmountInCents * 0.8);   // 20% off
      }
    }

    // 4. Add 8.25% estimated sales tax AFTER the discount
    const tax = Math.round(totalAmountInCents * 0.0825);
    const finalAmountInCents = totalAmountInCents + tax;

    // Prevent Stripe from crashing if the cart is 100% free
    if (finalAmountInCents < 50) {
      return NextResponse.json({ clientSecret: 'free_checkout_bypass' });
    }

    const safeMetadataString = Array.isArray(services) && services.length > 0 
      ? services.join(', ').substring(0, 500) 
      : 'No addons selected';

    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmountInCents,
      currency: 'usd',
      metadata: { 
        services_selected: safeMetadataString,
        coupon_applied: coupon || 'None' 
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    
  } catch (error: any) {
    console.error("❌ Stripe Intent Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
