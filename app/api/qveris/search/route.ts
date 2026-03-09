import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;

    const response = await fetch('https://qveris.ai/api/v1/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.QVERIS_API_KEY}`,
      },
      body: JSON.stringify({
        query,
        limit: 5,
      }),
    });

    if (!response.ok) {
      throw new Error(`QVeris search failed: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('QVeris search error:', error);
    return NextResponse.json(
      { error: 'Failed to search QVeris API' },
      { status: 500 }
    );
  }
}
