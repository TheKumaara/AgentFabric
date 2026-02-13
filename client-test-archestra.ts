
import { ClientFactory } from '@a2a-js/sdk/client';
import type { Message, MessageSendParams } from '@a2a-js/sdk';
import { v4 as uuidv4 } from 'uuid';

async function run() {
    const factory = new ClientFactory();

    // Archestra A2A Gateway configuration
    const ARCHESTRA_BASE_URL = 'http://127.0.0.1:9000';
    const ORCHESTRATOR_PROMPT_ID = 'd904f99e-af2a-4e6a-9474-44f78403ccc4';

    // A2A Gateway Token (different from API key!)
    const A2A_GATEWAY_TOKEN = process.env.ARCHESTRA_A2A_GATEWAY_TOKEN || 'YOUR_A2A_GATEWAY_TOKEN_HERE';

    // Archestra A2A endpoints:
    // - Agent Card: GET /v1/a2a/:promptId/.well-known/agent.json
    // - Execute: POST /v1/a2a/:promptId
    const agentCardUrl = `${ARCHESTRA_BASE_URL}/v1/a2a/${ORCHESTRATOR_PROMPT_ID}/.well-known/agent.json`;

    console.log(`Fetching Agent Card from: ${agentCardUrl}`);

    try {
        // First, manually fetch the agent card to verify authentication
        const cardResponse = await fetch(agentCardUrl, {
            headers: {
                'Authorization': `Bearer ${A2A_GATEWAY_TOKEN}`
            }
        });

        if (!cardResponse.ok) {
            throw new Error(`Failed to fetch agent card: ${cardResponse.status} ${cardResponse.statusText}`);
        }

        const agentCard = await cardResponse.json();
        console.log('Agent Card:', JSON.stringify(agentCard, null, 2));

        // Create ClientFactory with custom fetch that includes authentication
        const authenticatedFactory = new ClientFactory({
            transports: [
                {
                    protocolName: 'JSONRPC',
                    create: async (url: string) => {
                        const { JsonRpcTransport } = await import('@a2a-js/sdk/client');
                        return new JsonRpcTransport({
                            endpoint: url,
                            fetchImpl: async (input: RequestInfo | URL, init?: RequestInit) => {
                                return fetch(input, {
                                    ...init,
                                    headers: {
                                        ...init?.headers,
                                        'Authorization': `Bearer ${A2A_GATEWAY_TOKEN}`
                                    }
                                });
                            }
                        });
                    }
                }
            ]
        });

        // Now create the A2A client from the card
        const client = await authenticatedFactory.createFromAgentCard(agentCard);

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
            console.log('\n✅ Agent Response:', textPart?.text);
        } else {
            console.log('\n📋 Agent returned a Task:', result);
        }

    } catch (e: any) {
        console.error('\n❌ Error:', e.message);
        if (e.cause) {
            console.error('Cause:', e.cause);
        }
    }
}

run().catch(console.error);
