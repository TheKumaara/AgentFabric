
import { z } from 'zod';

// Archestra Client for connecting to the Archestra Platform API.
// This client handles policy validation and audit logging via REST endpoints.
// Note: While Archestra often acts as a proxy for LLM calls, this SDK allows 
// explicit governance checks for deterministic/hardcoded agent actions.

export interface PolicyRequest {
    agentId: string;
    toolName: string;
    params: unknown;
    metadata?: Record<string, unknown>;
}

export interface PolicyResponse {
    allowed: boolean;
    reason?: string;
    requestId: string;
    modifications?: unknown; // Policy might modify the params
}

export interface AuditEvent {
    agentId: string;
    action: string;
    details: string;
    status: 'success' | 'failure';
    timestamp?: number;
    metadata?: Record<string, unknown>;
}

export class ArchestraClient {
    private apiKey: string;
    private baseUrl: string;
    private timeout: number;

    constructor(config: { apiKey: string; baseUrl?: string; timeout?: number }) {
        this.apiKey = config.apiKey;
        // Default to a placeholder production URL, user must override via env vars
        this.baseUrl = config.baseUrl?.replace(/\/$/, '') || 'https://api.archestra.ai/v1';
        this.timeout = config.timeout || 5000;
    }

    private async fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    'X-Archestra-Version': '1.0',
                    ...options.headers,
                },
            });
            clearTimeout(id);
            return response;
        } catch (error) {
            clearTimeout(id);
            throw error;
        }
    }

    /**
     * Validates if an agent is allowed to use a specific tool based on governance policies.
     * Sends a POST request to the configured Archestra Policy Endpoint.
     */
    async validatePolicy(request: PolicyRequest): Promise<PolicyResponse> {
        if (!this.apiKey || this.apiKey === 'mock-key') {
            console.warn('[Archestra] No valid API Key found. Using mock fallback for development.');
            return this.mockValidate(request);
        }

        try {
            const response = await this.fetchWithTimeout(`${this.baseUrl}/policies/validate`, {
                method: 'POST',
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Archestra API Error (${response.status}): ${errorText}`);
            }

            const data = await response.json();
            return {
                allowed: data.allowed,
                reason: data.reason,
                requestId: data.requestId || crypto.randomUUID(),
                modifications: data.modifications
            };
        } catch (error: any) {
            console.error('[Archestra] Policy Validation Failed:', error.message);
            // Fail-safe: In strict environments, fail closed. In dev, maybe log and allow?
            // PRD says "Security enforcement", so we fail closed if API fails.
            return {
                allowed: false,
                reason: `Governance Check Failed: ${error.message}`,
                requestId: crypto.randomUUID()
            };
        }
    }

    /**
     * Logs an audit event for compliance.
     */
    async logEvent(event: AuditEvent): Promise<void> {
        if (!this.apiKey || this.apiKey === 'mock-key') {
            console.log(`[Archestra Mock Audit] ${JSON.stringify(event)}`);
            return;
        }

        // Fire and forget (don't block execution)
        this.fetchWithTimeout(`${this.baseUrl}/audit/events`, {
            method: 'POST',
            body: JSON.stringify({
                ...event,
                timestamp: event.timestamp || Date.now()
            }),
        }).catch(err => {
            console.error('[Archestra] Failed to log audit event:', err);
        });
    }

    // --- Mock Implementation for Dev/Fallback ---
    private mockValidate(request: PolicyRequest): Promise<PolicyResponse> {
        console.log(`[Archestra Mock] Validating policy for agent ${request.agentId} using tool ${request.toolName}`);

        // Simulate governance logic
        const sensitiveTools = ['payroll_execution', 'delete_user', 'system_shutdown', 'execute_payroll'];

        if (sensitiveTools.includes(request.toolName)) {
            if (request.agentId !== 'admin-agent' && request.agentId !== 'orchestrator-agent') { // Orchestrator might be allowed
                // Explicit Block for Finance Agent if not authorized (demo scenario)
                if (request.agentId === 'finance-agent') {
                    // Block strict sensitive tools in demo
                    return Promise.resolve({
                        allowed: false,
                        reason: `Policy Violation: Agent '${request.agentId}' is not authorized to use restricted tool '${request.toolName}' without human-in-the-loop approval.`,
                        requestId: crypto.randomUUID()
                    });
                }
            }
        }

        return Promise.resolve({
            allowed: true,
            requestId: crypto.randomUUID()
        });
    }
}

// Singleton instance for the app
// Reads from env vars
export const archestra = new ArchestraClient({
    apiKey: process.env.ARCHESTRA_API_KEY || 'mock-key',
    baseUrl: process.env.ARCHESTRA_API_URL
});
