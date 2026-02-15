import { NextResponse } from 'next/server';

/**
 * GET /api/archestra/conversations
 * 
 * Fetches recent chat conversations from Archestra Platform API
 */
export async function GET() {
    try {
        const ARCHESTRA_BASE_API_URL = process.env.ARCHESTRA_BASE_API_URL || 'http://127.0.0.1:9000';
        const ARCHESTRA_API_KEY = process.env.ARCHESTRA_API_KEY;

        if (!ARCHESTRA_API_KEY) {
            return NextResponse.json({
                error: 'Archestra API key not configured',
                available: false
            }, { status: 200 });
        }

        // Fetch conversations from Archestra Platform API
        const response = await fetch(`${ARCHESTRA_BASE_API_URL}/api/chat/conversations`, {
            headers: {
                'Authorization': ARCHESTRA_API_KEY,
                'Accept': 'application/json'
            },
            signal: AbortSignal.timeout(10000)
        });

        if (!response.ok) {
            console.error(`Failed to fetch conversations: ${response.status}`);
            return NextResponse.json({
                error: 'Failed to fetch conversations from Archestra',
                available: false
            }, { status: 200 });
        }

        const conversations = await response.json();

        return NextResponse.json(conversations, {
            headers: {
                'Cache-Control': 'public, max-age=10', // Cache for 10 seconds
            }
        });

    } catch (error: any) {
        console.error('Error fetching conversations:', error);

        return NextResponse.json({
            error: 'Failed to fetch conversations',
            available: false,
            message: error.message
        }, { status: 200 });
    }
}
