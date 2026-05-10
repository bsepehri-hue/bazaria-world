import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { agentId, newRating } = body;

    if (!agentId || newRating === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (parseFloat(newRating) < 4.0) {
      return NextResponse.json({
        success: true,
        warning: 'Agent rating fell below minimum threshold. Agent has been locked out.',
        data: { id: agentId, status: 'LOCKED_OUT', rating: newRating }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Agent rating updated successfully.',
      data: { id: agentId, status: 'ACTIVE', rating: newRating }
    });
  } catch (error) {
    console.error('Failed to update agent rating:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
