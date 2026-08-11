import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";
// 👇 Make sure this path matches your project's Firebase Admin export!
import { adminDb } from "@/lib/firebase/admin"; // 👈 Updated to adminDb!

// INITIALIZE STRIPE 
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia", // Assuming this is your pinned version
});

export async function POST(req: NextRequest) {
  try {
    // 👇 We now accept the addresses and delivery method directly from the frontend
    const { amount, items, deliveryMethod, buyerAddress, merchantAddress } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Missing order details for multi-vendor checkout" }, { status: 400 });
    }

    // AMOUNT CONVERSION (Dollars to Cents)
    const totalToChargeCents = Math.round(Number(amount) * 100);

    // 1. GENERATE THE SECURE ORDER ID ON THE BACKEND
    const orderId = `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // 2. FORCE THE DATABASE WRITE (Bypasses all client-side security rules!)
    console.log(`📝 Admin backend creating order ${orderId} in Firestore...`);
    await adminDb.collection("orders").doc(orderId).set({
      orderId: orderId,
      status: "PENDING_PAYMENT",
      participants: {
        buyerId: "guest_checkout", 
        sellerId: items[0]?.ownerId || "steward_node"
      },
      items: items,
      fulfillment: {
        logisticsMethod: deliveryMethod || "SHIPPING",
        shippingStatus: "PENDING",
        origin: merchantAddress || null,
        destination: buyerAddress || null
      },
      timestamps: { createdAt: new Date().toISOString() }
    });
    console.log(`✅ Backend successfully secured order document: ${orderId}`);

    // Check if ANY item in the cart requires physical shipping
    const requiresShipping = items.some((item: any) => !item.isDigital);

    // 🔥 STRIPE METADATA LIMIT: Stripe only allows 500 characters per metadata key.
    // We map the items to just the essential routing data to prevent crashing.
    const routingPayload = items.map((item: any) => ({
      id: item.id,
      ownerId: item.ownerId || "steward_node",
      price: item.price
    }));

    // 3. CREATE STRIPE SESSION
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
