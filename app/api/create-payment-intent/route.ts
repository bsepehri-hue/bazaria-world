import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";

// INITIALIZE STRIPE 
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: NextRequest) {
  try {
    // 👇 We now accept the orderId and the full items array from the cart
    const { amount, orderId, items } = await req.json();

    if (!orderId || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing order details for multi-vendor checkout" }, { status: 400 });
    }

    // AMOUNT CONVERSION (Dollars to Cents)
    const totalToChargeCents = Math.round(Number(amount) * 100);

    // Check if ANY item in the cart requires physical shipping
    const requiresShipping = items.some((item: any) => !item.isDigital);

    // 🔥 STRIPE METADATA LIMIT: Stripe only allows 500 characters per metadata key.
    // We map the items to just the essential routing data to prevent crashing.
    const routingPayload = items.map((item: any) => ({
      id: item.id,
      ownerId: item.ownerId,
      price: item.price
    }));

    // CREATE STRIPE SESSION
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { 
            name: "Bazaria Marketplace Order",
            description: `Order ID: ${orderId} (${items.length} assets)`
          },
          unit_amount: totalToChargeCents,
        },
        quantity: 1,
      }],
      mode: 'payment',
      
      // STRIPE HANDLES TAX AND SHIPPING NATIVELY
      automatic_tax: { enabled: true },
      shipping_address_collection: requiresShipping ? { allowed_countries: ['US', 'CA'] } : undefined,
      
      // 🚀 MULTI-VENDOR MAGIC: Groups the payment so the webhook can split it!
      payment_intent_data: {
        transfer_group: orderId,
      },
      
      // Pass the miniaturized items array so our webhook knows who to pay
      metadata: {
        orderId: orderId,
        cartRouting: JSON.stringify(routingPayload)
      },
      
      // DYNAMIC URLS (Prevents breaking when you push back to Vercel)
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/market/checkout?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/market/checkout`,
    });

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
