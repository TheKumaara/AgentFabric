
import { HRAgent } from './HRAgent';
import { FinanceAgent } from './FinanceAgent';
import { OrchestratorAgent } from './OrchestratorAgent';

declare global {
    var hrAgent: HRAgent | undefined;
    var financeAgent: FinanceAgent | undefined;
    var orchestratorAgent: OrchestratorAgent | undefined;
}

export const hrAgent = globalThis.hrAgent || new HRAgent();
if (process.env.NODE_ENV !== 'production') globalThis.hrAgent = hrAgent;

export const financeAgent = globalThis.financeAgent || new FinanceAgent();
if (process.env.NODE_ENV !== 'production') globalThis.financeAgent = financeAgent;

export const orchestratorAgent = globalThis.orchestratorAgent || new OrchestratorAgent();
if (process.env.NODE_ENV !== 'production') globalThis.orchestratorAgent = orchestratorAgent;
