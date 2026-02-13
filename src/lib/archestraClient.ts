/**
 * Archestra Client Utilities
 * 
 * Helper functions for creating A2A clients that route through
 * our secure backend proxy instead of making direct requests to Archestra.
 */

import { ClientFactory, JsonRpcTransport } from '@a2a-js/sdk/client';
import type { AgentCard } from '@a2a-js/sdk';

/**
 * Creates an A2A client that routes all requests through our backend proxy.
 * This keeps the A2A Gateway token secure on the server-side.
 * 
 * @param agentId - The agent identifier (orchestrator, hr, finance)
 * @param agentCard - The agent card fetched from /api/archestra/[agentId]
 * @returns A configured A2A client
 */
export async function createProxiedClient(agentId: string, agentCard: AgentCard) {
    const factory = new ClientFactory({
        transports: [
            {
                protocolName: 'JSONRPC',
                create: async (url: string) => {
                    // Instead of using the Archestra URL directly,
                    // route through our backend proxy
                    const proxyEndpoint = `/api/archestra/${agentId}/message`;

                    return new JsonRpcTransport({
                        endpoint: proxyEndpoint,
                        fetchImpl: async (input: RequestInfo | URL, init?: RequestInit) => {
                            // Use standard fetch - no need for auth headers
                            // since the backend proxy adds them
                            return fetch(input, init);
                        }
                    });
                }
            }
        ]
    });

    return factory.createFromAgentCard(agentCard);
}

/**
 * Fetches an agent card from our secure backend proxy.
 * 
 * @param agentId - The agent identifier (orchestrator, hr, finance)
 * @returns The agent card
 */
export async function fetchAgentCard(agentId: string): Promise<AgentCard> {
    const response = await fetch(`/api/archestra/${agentId}`);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Failed to fetch agent card: ${response.status}`);
    }

    return response.json();
}
