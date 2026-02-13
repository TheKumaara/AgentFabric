import { NextResponse } from 'next/server';
import { db } from '@/db';
import { conversations } from '@/db/schema';
import { desc } from 'drizzle-orm';

/**
 * GET /api/conversations
 * 
 * Fetches recent chat conversations from the database
 */
export async function GET() {
    try {
        // Fetch last 10 conversations
        const recentChats = await db
            .select({
                id: conversations.id,
                agentId: conversations.agentId,
                userMessage: conversations.userMessage,
                agentResponse: conversations.agentResponse,
                status: conversations.status,
                createdAt: conversations.createdAt,
            })
            .from(conversations)
            .orderBy(desc(conversations.createdAt))
            .limit(10);

        return NextResponse.json(recentChats, {
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
        }, {
            status: 200 // Return 200 with error flag
        });
    }
}
