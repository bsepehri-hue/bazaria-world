import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // 💡 Added 'isDigital' and 'items' to catch data from the asset modal
    const { amount, currency = "usd", cartItems, items, paymentMethod, isDigital } = body;

    // 1. Strict Validation Guards
    if (!amount) {
      return NextResponse.json(
        { error: "Missing required fields (amount)" },
        { status: 400 }
      );
    }

    // Determine if we need a shipping address (default to true unless explicitly marked digital)
    const requiresShipping = isDigital === false || isDigital === undefined;

    // 2. Build the Hosted Session Config
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: paymentMethod === "ach" ? ["us_bank_account"] : ["card"],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              // Dynamically use the asset title if provided, otherwise default to Order Settlement
              name: items?.[0]?.title || "Bazaria Order Settlement",
              description: `Marketplace Transaction Bundle (${cartItems?.length || items?.length || 1} items)`,
            },
            unit_amount: Math.round(amount), // Expects cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      
      // 💸 STRIPE TAX: Let Stripe calculate taxes based on the user's location
      automatic_tax: { enabled: true },

      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/market/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/market/checkout`,
    };

    // 📦 SHIPPING LOGIC: Ask Stripe to collect the address on the hosted page
    if (requiresShipping) {
      sessionConfig.shipping_address_collection = {
        allowed_countries: ['US', 'CA'], // Add the country codes you ship to
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

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
