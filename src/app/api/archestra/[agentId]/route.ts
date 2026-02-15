import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/archestra/[agentId]
 * 
 * Secure backend proxy that fetches agent cards from Archestra
 * with proper A2A Gateway token authentication.
 * 
 * This keeps the A2A Gateway token secure on the server-side
 * and prevents exposing it to the browser.
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ agentId: string }> }
) {
    try {
        const { agentId } = await params;

        // Validate agent ID format (UUID)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

        if (!uuidRegex.test(agentId)) {
            return NextResponse.json(
                { error: `Invalid agent ID format: ${agentId}` },
                { status: 400 }
            );
        }

        const promptId = agentId;

        // Get configuration from environment
        const ARCHESTRA_BASE_URL = process.env.ARCHESTRA_BASE_URL || 'http://127.0.0.1:9000';
        const A2A_GATEWAY_TOKEN = process.env.ARCHESTRA_A2A_GATEWAY_TOKEN;

        if (!A2A_GATEWAY_TOKEN) {
            console.error('ARCHESTRA_A2A_GATEWAY_TOKEN is not set in environment variables');
            return NextResponse.json(
                { error: 'Server configuration error: A2A Gateway token not configured' },
                { status: 500 }
            );
        }

        // Construct Archestra agent card URL
        const agentCardUrl = `${ARCHESTRA_BASE_URL}/v1/a2a/${promptId}/.well-known/agent.json`;

        console.log(`[Archestra Proxy] Fetching agent card for ${agentId} from ${agentCardUrl}`);

        // Fetch agent card from Archestra with authentication
        const response = await fetch(agentCardUrl, {
            headers: {
                'Authorization': `Bearer ${A2A_GATEWAY_TOKEN}`,
                'Accept': 'application/json'
            },
            // Add timeout to prevent hanging requests
            signal: AbortSignal.timeout(10000) // 10 second timeout
        });

        if (!response.ok) {
            console.error(`[Archestra Proxy] Failed to fetch agent card: ${response.status} ${response.statusText}`);
            return NextResponse.json(
                { error: `Failed to fetch agent card from Archestra: ${response.status} ${response.statusText}` },
                { status: response.status }
            );
        }

        const agentCard = await response.json();

        console.log(`[Archestra Proxy] Successfully fetched agent card for ${agentId}`);

        // Return the agent card to the client
        return NextResponse.json(agentCard, {
            headers: {
                'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
            }
        });

    } catch (error: any) {
        console.error('[Archestra Proxy] Error:', error);

        if (error.name === 'AbortError') {
            return NextResponse.json(
                { error: 'Request timeout: Archestra gateway did not respond in time' },
                { status: 504 }
            );
        }

        return NextResponse.json(
            { error: `Internal server error: ${error.message}` },
            { status: 500 }
        );
    }
}
