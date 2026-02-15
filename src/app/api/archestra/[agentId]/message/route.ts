import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/archestra/[agentId]/message
 * 
 * Secure backend proxy that sends JSON-RPC messages to Archestra agents
 * with proper A2A Gateway token authentication.
 */
export async function POST(
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
            console.error('ARCHESTRA_A2A_GATEWAY_TOKEN is not set');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        // Get the JSON-RPC request body from the client
        const jsonRpcRequest = await request.json();

        // Construct Archestra agent endpoint
        const agentEndpoint = `${ARCHESTRA_BASE_URL}/v1/a2a/${promptId}`;

        console.log(`[Archestra Proxy] Sending message to ${agentId} at ${agentEndpoint}`);

        // Forward the JSON-RPC request to Archestra with authentication
        const response = await fetch(agentEndpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${A2A_GATEWAY_TOKEN}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(jsonRpcRequest),
            signal: AbortSignal.timeout(60000) // 60 second timeout for agent processing
        });

        if (!response.ok) {
            console.error(`[Archestra Proxy] Agent request failed: ${response.status}`);
            return NextResponse.json(
                { error: `Agent request failed: ${response.status}` },
                { status: response.status }
            );
        }

        // Check if response is streaming (Server-Sent Events or chunked)
        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('text/event-stream') || contentType.includes('application/x-ndjson')) {
            // Streaming response - forward the stream to the client
            console.log(`[Archestra Proxy] Streaming response from ${agentId}`);

            return new NextResponse(response.body, {
                headers: {
                    'Content-Type': contentType,
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                }
            });
        }

        // Non-streaming response
        const result = await response.json();

        console.log(`[Archestra Proxy] Successfully received response from ${agentId}`);

        // Return the JSON-RPC response to the client
        return NextResponse.json(result);

    } catch (error: any) {
        console.error('[Archestra Proxy] Error:', error);

        if (error.name === 'AbortError') {
            return NextResponse.json(
                { error: 'Request timeout' },
                { status: 504 }
            );
        }

        return NextResponse.json(
            { error: `Internal server error: ${error.message}` },
            { status: 500 }
        );
    }
}
