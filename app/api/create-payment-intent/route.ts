import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency, cartItems, paymentMethod } = body;

    // 1. Strict Validation Guards
    if (!amount || !currency) {
      return NextResponse.json(
        { error: "Missing required fields (amount, currency)" },
        { status: 400 }
      );
    }

    // 2. Build the Hosted Session Config
    // We pass the calculated grand total as a single clear marketplace invoice item
    const session = await stripe.checkout.sessions.create({
      payment_method_types: paymentMethod === "ach" ? ["us_bank_account"] : ["card"],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: "Bazaria Order Settlement",
              description: `Marketplace Transaction Bundle (${cartItems?.length || 1} items)`,
            },
            unit_amount: Math.round(amount), // Already converted to cents on the frontend!
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // Stripe will seamlessly route users back to these locations upon finalization
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/market/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/market/checkout`,
    });

    // 3. Hand back the real hosted panel web link to your frontend handler
    return NextResponse.json({
      url: session.url,
    });

  } catch (error: any) {
    console.error("Stripe Hosted Session API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
