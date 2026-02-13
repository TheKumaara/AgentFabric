
import { NextRequest } from 'next/server';
import { hrAgent } from '@/lib/agents/instances';

export async function POST(req: NextRequest) {
    return hrAgent.handlePost(req);
}

export async function GET(req: NextRequest) {
    return hrAgent.handleGet(req);
}
