import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: [
        {
          id: "test-inquiry-1",
          customer_id: "customer-100",
          subject: "Punta Cana Estate Inquiry",
          message: "Could you provide more details regarding the fractional shares and closing costs for the Punta Cana property?",
          created_at: new Date().toISOString(),
          status: "UNASSIGNED",
        }
      ]
    });
  } catch (error) {
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerId, subject, message } = body;

    if (!customerId || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Inquiry successfully submitted to the agent pool.',
      data: {
        id: `test-${Math.random().toString(36).substring(2, 9)}`,
        customer_id: customerId,
        subject,
        message,
        created_at: new Date().toISOString(),
        status: 'UNASSIGNED',
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
