
import { BaseAgent } from './BaseAgent';
import { RequestContext, ExecutionEventBus } from '@a2a-js/sdk/server';
import { AgentCard, Message } from '@a2a-js/sdk';
import { archestra } from '../archestra';

const HR_AGENT_CARD: AgentCard = {
    name: 'hr-agent',
    description: 'Handles HR related tasks like employee lookup and offer letters.',
    version: '1.0.0',
    protocolVersion: '1.0.0',
    url: 'http://localhost:3002/api/agents/hr',
    defaultInputModes: ['text/plain'],
    defaultOutputModes: ['text/plain'],
    capabilities: {},
    skills: []
};
export class HRAgent extends BaseAgent {
    constructor() {
        super(HR_AGENT_CARD);
    }

    async execute(requestContext: RequestContext, eventBus: ExecutionEventBus): Promise<void> {
        const userMessage = requestContext.userMessage;
        // Assuming user message has text part
        const textPart = userMessage.parts.find(p => p.kind === 'text') as any; // Cast to avoid detailed type checking for now
        const content = textPart?.text || '';

        console.log(`[HR Agent] Received task: ${content}`);

        // Governance Check
        const policy = await archestra.validatePolicy({
            agentId: 'hr-agent',
            toolName: 'process_hr_request',
            params: { content }
        });

        if (!policy.allowed) {
            eventBus.publish({
                kind: 'message',
                messageId: crypto.randomUUID(),
                parts: [{ kind: 'text', text: `Request blocked by policy: ${policy.reason}` }],
                role: 'agent'
            } as Message);
            return;
        }

        // Process logic
        let responseText = '';
        if (content.toLowerCase().includes('employee lookup')) {
            responseText = "Found employee: John Doe (ID: 12345) - Engineering Dept.";
        } else if (content.toLowerCase().includes('offer letter')) {
            responseText = "Generated offer letter for Candidate X. Sent for approval.";
        } else {
            responseText = "I can help with Employee Lookup and Offer Letters. What do you need?";
        }

        // Publish response
        eventBus.publish({
            kind: 'message',
            messageId: crypto.randomUUID(),
            parts: [{ kind: 'text', text: responseText }],
            role: 'agent'
        } as Message);

        // Mark as finished (implicit if method returns? SDK usually handles cleanup if we publish a 'done' event or just finish).
        // Actually, usually we publish a TaskStatusUpdateEvent(status='completed') if started as a Task.
    }
}
