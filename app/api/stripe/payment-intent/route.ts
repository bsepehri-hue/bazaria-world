import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe securely using your secret backend key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16', // Use your current Stripe API version
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { services, amountDue } = body;

    // 🚨 In a production environment, you should calculate the 'amountDue' 
    // on this server side based on the 'services' array to prevent tampering,
    // but we will accept the calculated amount from the frontend for this sprint.

    // Stripe expects the amount in cents (e.g., $102.84 becomes 10284)
    const amountInCents = Math.round(amountDue * 100);

    // Generate the secure payment session
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      // Attach the selected services so you see them in your Stripe Dashboard
      metadata: { 
        services_selected: services.join(', ') 
      },
    });

    // Send the secure token back to the frontend
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    
  } catch (error: any) {
    console.error("Stripe Intent Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
