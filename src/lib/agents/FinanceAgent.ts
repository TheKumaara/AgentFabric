
import { BaseAgent } from './BaseAgent';
import { RequestContext, ExecutionEventBus } from '@a2a-js/sdk/server';
import { AgentCard, Message } from '@a2a-js/sdk';
import { archestra } from '../archestra';

const FINANCE_AGENT_CARD: AgentCard = {
    name: 'finance-agent',
    description: 'Handles Finance related tasks like expense summary and payroll.',
    version: '1.0.0',
    protocolVersion: '1.0.0',
    url: 'http://localhost:3002/api/agents/finance',
    defaultInputModes: ['text/plain'],
    defaultOutputModes: ['text/plain'],
    capabilities: {},
    skills: []
};

export class FinanceAgent extends BaseAgent {
    constructor() {
        super(FINANCE_AGENT_CARD);
    }

    async execute(requestContext: RequestContext, eventBus: ExecutionEventBus): Promise<void> {
        const userMessage = requestContext.userMessage;
        // Assuming user message has text part
        const textPart = userMessage.parts.find(p => p.kind === 'text') as any;
        const content = textPart?.text || '';

        console.log(`[Finance Agent] Received task: ${content}`);

        // Governance Check - Sensitive!
        let toolName = 'view_finance';
        if (content.toLowerCase().includes('payroll')) toolName = 'execute_payroll';

        const policy = await archestra.validatePolicy({
            agentId: 'finance-agent',
            toolName: toolName,
            params: { content }
        });

        if (!policy.allowed) {
            eventBus.publish({
                kind: 'message',
                messageId: crypto.randomUUID(),
                parts: [{ kind: 'text', text: `Request blocked by Archestra Policy: ${policy.reason}` }],
                role: 'agent'
            } as Message);
            return;
        }

        let responseText = '';
        if (content.toLowerCase().includes('expense')) {
            responseText = "Expense Summary for Q1: $120,500. Travel budget exceeded by 15%.";
        } else if (content.toLowerCase().includes('payroll')) {
            responseText = "Payroll simulation for March completed. Net outlay: $450,000.";
        } else {
            responseText = "I can help with Expenses and Payroll. What do you need?";
        }

        eventBus.publish({
            kind: 'message',
            messageId: crypto.randomUUID(),
            parts: [{ kind: 'text', text: responseText }],
            role: 'agent'
        } as Message);
    }
}
