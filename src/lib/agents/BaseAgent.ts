
import {
    AgentExecutor,
    RequestContext,
    ExecutionEventBus,
    DefaultRequestHandler,
    JsonRpcTransportHandler,
    InMemoryTaskStore,
    DefaultExecutionEventBusManager,
    AgentExecutionEvent
} from '@a2a-js/sdk/server';
import { AgentCard, Task, Message } from '@a2a-js/sdk';
import { NextRequest, NextResponse } from 'next/server';

export abstract class BaseAgent implements AgentExecutor {
    protected requestHandler: DefaultRequestHandler;
    protected transportHandler: JsonRpcTransportHandler;
    protected taskStore: InMemoryTaskStore;
    protected eventBusManager: DefaultExecutionEventBusManager;

    constructor(public agentCard: AgentCard) {
        this.taskStore = new InMemoryTaskStore();
        this.eventBusManager = new DefaultExecutionEventBusManager();

        // Initialize Request Handler with this as the executor
        this.requestHandler = new DefaultRequestHandler(
            agentCard,
            this.taskStore,
            this, // AgentExecutor
            this.eventBusManager
        );

        // Initialize Transport Handler (JSON-RPC)
        this.transportHandler = new JsonRpcTransportHandler(this.requestHandler);
    }

    /**
     * Abstract method that must be implemented by specific agents.
     * This is where the agent logic resides.
     */
    abstract execute(requestContext: RequestContext, eventBus: ExecutionEventBus): Promise<void>;

    /**
     * Handles cancellation of a task.
     */
    async cancelTask(taskId: string, eventBus: ExecutionEventBus): Promise<void> {
        // Default implementation: just publish canceled event
        // In real implementation, we might signal running process to stop
        console.log(`[BaseAgent] Canceling task ${taskId}`);
        // We should publish a TaskStatusUpdateEvent?
        // The SDK example might handle this automatically if we just return, 
        // but the interface requires implementation.
        // For MVP, we likely won't support complex cancellation.
    }

    /**
     * Next.js API Route Handler
     */
    /**
     * Handle POST requests (JSON-RPC)
     */
    async handlePost(req: NextRequest): Promise<NextResponse> {
        try {
            const body = await req.json();
            console.log('[BaseAgent] Handling POST:', JSON.stringify(body, null, 2));

            // Handle the request via JSON-RPC Transport
            const result = await this.transportHandler.handle(body);

            if (Symbol.asyncIterator in result) {
                const stream = new ReadableStream({
                    async start(controller) {
                        for await (const chunk of (result as AsyncGenerator<any, void, unknown>)) {
                            controller.enqueue(new TextEncoder().encode(JSON.stringify(chunk) + '\n'));
                        }
                        controller.close();
                    }
                });
                return new NextResponse(stream, {
                    headers: { 'Content-Type': 'application/json' }  // Or generic stream
                });
            }

            return NextResponse.json(result);

        } catch (error: any) {
            console.error('Agent Handler Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    /**
     * Handle GET requests (Agent Card)
     */
    async handleGet(req: NextRequest): Promise<NextResponse> {
        return NextResponse.json(this.agentCard);
    }

}
