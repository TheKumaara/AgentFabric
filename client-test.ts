
import { ClientFactory } from '@a2a-js/sdk/client';
import type { Message, MessageSendParams } from '@a2a-js/sdk';
import { v4 as uuidv4 } from 'uuid';

async function run() {
    const factory = new ClientFactory();

    // Connect to the Orchestrator Agent running on the Next.js dev server
    // The BASE_URL should be where the Next.js app is running
    const BASE_URL = 'http://localhost:3002';
    const ORCHESTRATOR_PATH = '/api/agents/orchestrator';

    console.log(`Connecting to Orchestrator Agent at ${BASE_URL}${ORCHESTRATOR_PATH}...`);

    try {
        // createFromUrl accepts baseUrl and optional path to agent card (default is .well-known/agent-card.json)
        // Our agents serve card at GET /api/agents/[agent] which acts as the card endpoint
        // Standard A2A practice is .well-known, but for this Next.js app we can just point to the API route.
        // The A2A client might expect the exact path to the card JSON?
        // Let's try passing the Full URL to the route which serves the card on GET.
        // createFromUrl(baseUrl, cardPath)
        // If we pass baseUrl as storage, it might look for .well-known there.
        // If we want a specific path, we pass it as second arg.

        // Actually, our route `/api/agents/orchestrator` handles both GET (card) and POST (RPC).
        // So we can say baseUrl = http://localhost:3000 and path = /api/agents/orchestrator
        // But wait, the client usually appends path.
        // Let's try:
        const client = await factory.createFromUrl(BASE_URL, ORCHESTRATOR_PATH);

        console.log('Connected! Sending message...');

        const sendParams: MessageSendParams = {
            message: {
                kind: 'message',
                role: 'user',
                messageId: uuidv4(),
                parts: [{ kind: 'text', text: 'I need to hire a software engineer.' }]
            }
        };

        const result = await client.sendMessage(sendParams);

        // Check if result is Message or Task
        if (result.kind === 'message') {
            const textPart = result.parts.find(p => p.kind === 'text') as any;
            console.log('Agent Response:', textPart?.text);
        } else {
            console.log('Agent returned a Task/Status:', result);
        }

    } catch (e) {
        console.error('Error:', e);
    }
}

run().catch(console.error);
