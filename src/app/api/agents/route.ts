import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const baseUrl = process.env.ARCHESTRA_BASE_API_URL;
    const apiKey = process.env.ARCHESTRA_API_KEY;

    if (!baseUrl || !apiKey) {
        return NextResponse.json({ error: 'Missing configuration' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const agentType = searchParams.get('agentType');

    // Construct upstream URL
    const upstreamUrl = new URL(`${baseUrl}/api/agents`);
    if (agentType) {
        upstreamUrl.searchParams.set('agentType', agentType);
    }

    try {
        const response = await fetch(upstreamUrl.toString(), {
            headers: {
                'Authorization': apiKey,
                'Content-Type': 'application/json',
            },
            // simple cache control
            next: { revalidate: 60 }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch agents: ${response.statusText}`);
        }

        const data = await response.json();

        // Ensure effective filtering even if upstream ignores the param
        if (agentType) {
            if (Array.isArray(data)) {
                const filtered = data.filter((agent: any) => agent.agentType === agentType);
                return NextResponse.json(filtered);
            } else if (data.data && Array.isArray(data.data)) {
                data.data = data.data.filter((agent: any) => agent.agentType === agentType);
                return NextResponse.json(data);
            }
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching agents:', error);
        return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 });
    }
}
