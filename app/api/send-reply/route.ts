import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with the API key from your .env.local file
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { buyerEmail, buyerName, subject, merchantReply } = await request.json();

    const data = await resend.emails.send({
      // ⚠️ IMPORTANT: While on the free tier testing without a verified domain, 
      // the 'from' address MUST stay exactly as 'onboarding@resend.dev'
      from: 'Bazaria Concierge <onboarding@resend.dev>', 
      to: buyerEmail, 
      subject: `Re: ${subject} - Merchant Response`,
      html: `
        <div style="font-family: sans-serif; background-color: #021a1d; color: #ffffff; padding: 40px 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #05292e; border: 1px solid #C5A059; border-radius: 8px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
            <h2 style="color: #C5A059; text-transform: uppercase; letter-spacing: 2px; font-size: 16px; margin-top: 0; margin-bottom: 24px;">Message Received</h2>
            
            <p style="color: #e5e7eb; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">Hello ${buyerName},</p>
            <p style="color: #e5e7eb; font-size: 16px; line-height: 1.6;">The merchant has responded to your inquiry regarding <strong>"${subject}"</strong>.</p>
            
            <div style="background-color: rgba(0,0,0,0.4); border-left: 3px solid #C5A059; padding: 20px; margin: 24px 0; border-radius: 4px;">
              <p style="color: #ffffff; font-size: 16px; font-style: italic; margin: 0; line-height: 1.6;">"${merchantReply}"</p>
            </div>
            
            <p style="color: #9ca3af; font-size: 14px; margin-bottom: 32px; line-height: 1.6;">To continue the conversation or coordinate further details, please log in to your Bazaria terminal.</p>
            
            <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 24px;">
              <p style="color: #C5A059; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; margin: 0;">Bazaria Registry Hub</p>
            </div>
          </div>
        </div>
      `,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: 'Failed to transmit email' }, { status: 500 });
  }
}
