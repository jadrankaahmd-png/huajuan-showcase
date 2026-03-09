import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { toolId, searchId, parameters } = body;

    const url = new URL('https://qveris.ai/api/v1/tools/execute');
    url.searchParams.set('tool_id', toolId);

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.QVERIS_API_KEY}`,
      },
      body: JSON.stringify({
        search_id: searchId,
        parameters,
        max_response_size: 20480,
      }),
    });

    if (!response.ok) {
      throw new Error(`QVeris execute failed: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('QVeris execute error:', error);
    return NextResponse.json(
      { error: 'Failed to execute QVeris tool' },
      { status: 500 }
    );
  }
}
