import { NextRequest, NextResponse } from 'next/server';

// Agent ID to Archestra Prompt ID mapping
const AGENT_PROMPT_IDS: Record<string, string> = {
    'orchestrator': process.env.ORCHESTRATOR_PROMPT_ID || 'd904f99e-af2a-4e6a-9474-44f78403ccc4',
    'hr': process.env.HR_PROMPT_ID || '144bce71-3190-4c72-872d-1e620b119038',
    'finance': process.env.FINANCE_PROMPT_ID || '2d360a03-9192-4ec0-a1e7-27c17a86f8e4'
};

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

        // Check if agentId is a friendly name or a UUID
        let promptId = AGENT_PROMPT_IDS[agentId];

        // If not found in mapping, check if it's already a UUID
        if (!promptId) {
            // Check if agentId matches any of the UUIDs in the mapping
            const matchingEntry = Object.entries(AGENT_PROMPT_IDS).find(([_, uuid]) => uuid === agentId);
            if (matchingEntry) {
                promptId = agentId; // It's already a UUID
            } else {
                return NextResponse.json(
                    { error: `Unknown agent: ${agentId}. Valid agents: ${Object.keys(AGENT_PROMPT_IDS).join(', ')}` },
                    { status: 404 }
                );
            }
        }

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
