import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/archestra/conversations/[id]
 * 
 * Fetches a specific conversation with its messages from Archestra Platform API
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const ARCHESTRA_BASE_URL = process.env.ARCHESTRA_BASE_URL || 'http://127.0.0.1:9000';
        const ARCHESTRA_API_KEY = process.env.ARCHESTRA_API_KEY;

        if (!ARCHESTRA_API_KEY) {
            return NextResponse.json({
                error: 'Archestra API key not configured',
                available: false
            }, { status: 200 });
        }

        // Fetch specific conversation from Archestra Platform API
        const response = await fetch(`${ARCHESTRA_BASE_URL}/api/chat/conversations/${id}`, {
            headers: {
                'Authorization': ARCHESTRA_API_KEY,
                'Accept': 'application/json'
            },
            signal: AbortSignal.timeout(10000)
        });

        if (!response.ok) {
            console.error(`Failed to fetch conversation ${id}: ${response.status}`);
            return NextResponse.json({
                error: 'Conversation not found',
                available: false
            }, { status: 404 });
        }

        const conversation = await response.json();

        // Debug: Log the conversation structure
        console.log('[Archestra Conversations] Fetched conversation:', {
            id: conversation.id,
            messageCount: conversation.messages?.length || 0,
            sampleMessage: conversation.messages?.[0],
            fullStructure: JSON.stringify(conversation, null, 2)
        });

        return NextResponse.json(conversation, {
            headers: {
                'Cache-Control': 'public, max-age=5',
            }
        });

    } catch (error: any) {
        console.error('Error fetching conversation:', error);

        return NextResponse.json({
            error: 'Failed to fetch conversation',
            available: false,
            message: error.message
        }, { status: 200 });
    }
}
