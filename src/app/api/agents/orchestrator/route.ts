
import { NextRequest } from 'next/server';
import { orchestratorAgent } from '@/lib/agents/instances';

export async function POST(req: NextRequest) {
    return orchestratorAgent.handlePost(req);
}

export async function GET(req: NextRequest) {
    return orchestratorAgent.handleGet(req);
}
