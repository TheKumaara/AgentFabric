
import { NextRequest } from 'next/server';
import { financeAgent } from '@/lib/agents/instances';

export async function POST(req: NextRequest) {
    return financeAgent.handlePost(req);
}

export async function GET(req: NextRequest) {
    return financeAgent.handleGet(req);
}
