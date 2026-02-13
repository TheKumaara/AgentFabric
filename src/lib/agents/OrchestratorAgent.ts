
import { BaseAgent } from './BaseAgent';
import { RequestContext, ExecutionEventBus } from '@a2a-js/sdk/server';
import { AgentCard, Task, Message } from '@a2a-js/sdk';
import { ClientFactory } from '@a2a-js/sdk/client';
import { archestra } from '../archestra';

const ORCHESTRATOR_CARD: AgentCard = {
    name: 'orchestrator-agent',
    description: 'Orchestrates tasks across HR and Finance agents.',
    version: '1.0.0',
    protocolVersion: '1.0.0',
    url: 'http://localhost:3002/api/agents/orchestrator',
    defaultInputModes: ['text/plain'],
    defaultOutputModes: ['text/plain'],
    capabilities: {},
    skills: []
};

const HR_AGENT_URL = 'http://localhost:3002/api/agents/hr';
const FINANCE_AGENT_URL = 'http://localhost:3002/api/agents/finance';

export class OrchestratorAgent extends BaseAgent {
    private clientFactory: ClientFactory;

    constructor() {
        super(ORCHESTRATOR_CARD);
        this.clientFactory = new ClientFactory();
    }

    async execute(requestContext: RequestContext, eventBus: ExecutionEventBus): Promise<void> {
        const userMessage = requestContext.userMessage;
        const textPart = userMessage.parts.find(p => p.kind === 'text') as any;
        const content = textPart?.text || '';

        console.log(`[Orchestrator] Planning execution for: ${content}`);

        // Governance: Validate access to sub-agents?
        // Assume allowed for now.

        // Simple routing logic (MVP)
        // If request mentions "hire", call HR.
        // If request mentions "payroll" or "budget", call Finance.
        // If both, call both and summarize.

        const needsHR = content.toLowerCase().includes('hire') || content.toLowerCase().includes('employee') || content.toLowerCase().includes('offer');
        const needsFinance = content.toLowerCase().includes('payroll') || content.toLowerCase().includes('budget') || content.toLowerCase().includes('expense');

        let combinedResult = '';

        if (needsHR) {
            combinedResult += await this.callAgent('HR', HR_AGENT_URL, content);
        }

        if (needsFinance) {
            if (combinedResult) combinedResult += '\n\n';
            combinedResult += await this.callAgent('Finance', FINANCE_AGENT_URL, content);
        }

        if (!needsHR && !needsFinance) {
            combinedResult = "I can orchestrate tasks for HR and Finance. Try asking about 'hiring' or 'payroll'.";
        }

        // Return combined result
        eventBus.publish({
            kind: 'message',
            messageId: crypto.randomUUID(),
            parts: [{ kind: 'text', text: combinedResult }],
            role: 'agent'
        } as Message);
    }

    private async callAgent(name: string, url: string, task: string): Promise<string> {
        try {
            console.log(`[Orchestrator] Calling ${name} Agent at ${url}...`);
            // Split url into base and path
            const urlObj = new URL(url);
            const baseUrl = `${urlObj.protocol}//${urlObj.host}`;
            const path = urlObj.pathname;

            const client = await this.clientFactory.createFromUrl(baseUrl, path);

            // Send message
            const result = await client.sendMessage({
                message: {
                    kind: 'message',
                    role: 'user', // As orchestrator acts as user to the sub-agent
                    messageId: crypto.randomUUID(),
                    parts: [{ kind: 'text', text: task }]
                }
            });

            if (result.kind === 'message') {
                // It is a Message
                const text = (result.parts.find(p => p.kind === 'text') as any)?.text;
                return `${name} Agent says: ${text}`;
            } else if (result.kind === 'task') {
                // It is a Task
                return `${name} Agent returned a Task (ID: ${result.id}). Check status later.`;
            }

            return `${name} Agent returned unexpected response.`;

        } catch (e: any) {
            console.error(`[Orchestrator] Failed to call ${name}:`, e);
            return `Failed to contact ${name} Agent: ${e.message}`;
        }
    }
}
