
'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ClientFactory } from '@a2a-js/sdk/client';
import { AgentCard, Message } from '@a2a-js/sdk';
import { Send, ArrowLeft, Shield, AlertTriangle, CheckCircle, Terminal } from 'lucide-react';
import { fetchAgentCard, createProxiedClient } from '@/lib/archestraClient';

export default function AgentChatPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const agentId = params?.agent as string;
    const conversationId = searchParams?.get('conversationId');

    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [agentCard, setAgentCard] = useState<AgentCard | null>(null);
    const [isConnecting, setIsConnecting] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processingStatus, setProcessingStatus] = useState<string | null>(null);
    const [activeAgent, setActiveAgent] = useState<string | null>(null);

    const clientRef = useRef<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!agentId) return;

        const initAgent = async () => {
            try {
                setIsConnecting(true);

                // Fetch Agent Card via secure backend proxy
                const card = await fetchAgentCard(agentId);
                setAgentCard(card);

                // Create A2A Client that routes through backend proxy
                const client = await createProxiedClient(agentId, card);
                clientRef.current = client;

                // If conversationId is provided, fetch previous messages
                if (conversationId) {
                    try {
                        const response = await fetch(`/api/archestra/conversations/${conversationId}`);
                        if (response.ok) {
                            const conversation = await response.json();
                            console.log('[Chat] Loaded conversation:', conversation);

                            if (conversation.messages && Array.isArray(conversation.messages)) {
                                // Convert Archestra message format to our format
                                // Archestra messages might have different structures, so we handle multiple formats
                                const formattedMessages = conversation.messages.map((msg: any) => {
                                    // Extract text content from various possible formats
                                    let content = '';

                                    if (typeof msg.content === 'string') {
                                        content = msg.content;
                                    } else if (msg.text) {
                                        content = msg.text;
                                    } else if (msg.parts && Array.isArray(msg.parts)) {
                                        // Handle parts-based format (A2A protocol)
                                        const textParts = msg.parts
                                            .filter((p: any) => p.kind === 'text' || p.type === 'text')
                                            .map((p: any) => p.text || p.content)
                                            .filter(Boolean);
                                        content = textParts.join('\n');
                                    } else if (msg.message) {
                                        content = typeof msg.message === 'string' ? msg.message : JSON.stringify(msg.message);
                                    }

                                    console.log('[Chat] Formatted message:', { original: msg, formatted: { role: msg.role, content } });

                                    return {
                                        role: msg.role === 'user' ? 'user' : 'agent',
                                        content: content || '[Empty message]',
                                        id: msg.id || crypto.randomUUID()
                                    };
                                });

                                console.log('[Chat] Setting messages:', formattedMessages);

                                // For very long conversations, only show the last 50 messages initially
                                // This improves performance and reduces initial load time
                                const MESSAGE_LIMIT = 50;
                                if (formattedMessages.length > MESSAGE_LIMIT) {
                                    const recentMessages = formattedMessages.slice(-MESSAGE_LIMIT);
                                    setMessages([
                                        {
                                            role: 'system',
                                            content: `📜 This conversation has ${formattedMessages.length} messages. Showing the most recent ${MESSAGE_LIMIT}. Scroll up to load earlier messages.`,
                                            id: 'load-more-indicator',
                                            isLoadMoreIndicator: true,
                                            totalMessages: formattedMessages.length
                                        },
                                        ...recentMessages
                                    ]);
                                } else {
                                    setMessages(formattedMessages);
                                }
                            }
                        }
                    } catch (err) {
                        console.error('Failed to load conversation history:', err);
                        // Fall back to initial greeting if conversation load fails
                        setMessages([
                            { role: 'agent', content: `Connected to ${card.name}. How can I help?`, id: 'init' }
                        ]);
                    }
                } else {
                    // Add initial greeting for new conversations
                    setMessages([
                        { role: 'agent', content: `Connected to ${card.name}. How can I help?`, id: 'init' }
                    ]);
                }

            } catch (err: any) {
                console.error(err);
                setError(err.message);
            } finally {
                setIsConnecting(false);
            }
        };

        initAgent();
    }, [agentId, conversationId]);


    const sendMessage = async () => {
        if (!input.trim() || !clientRef.current) return;

        const userMsg = input;
        setInput('');
        setLoading(true);
        setProcessingStatus('Sending message...');
        setActiveAgent(agentCard?.name || agentId);

        // Add user message to UI
        const tempId = Date.now().toString();
        setMessages(prev => [...prev, { role: 'user', content: userMsg, id: tempId }]);

        try {
            // Check if agent supports streaming
            const supportsStreaming = agentCard?.capabilities?.streaming;

            if (supportsStreaming) {
                setProcessingStatus(`${agentCard?.name || 'Agent'} is processing...`);

                // Streaming mode - create a placeholder message that we'll update
                const streamingMessageId = `streaming-${Date.now()}`;
                setMessages(prev => [...prev, { role: 'agent', content: '', id: streamingMessageId, streaming: true }]);

                // Use the A2A SDK's streaming support
                const stream = await clientRef.current.sendMessage({
                    message: {
                        kind: 'message',
                        role: 'user',
                        messageId: crypto.randomUUID(),
                        parts: [{ kind: 'text', text: userMsg }]
                    },
                    streaming: true
                });

                // Handle streaming response
                let fullText = '';
                for await (const chunk of stream) {
                    console.log('Stream chunk:', chunk);

                    if (chunk.parts) {
                        const textPart = chunk.parts.find((p: any) => p.kind === 'text');
                        if (textPart?.text) {
                            fullText += textPart.text;
                            // Update the message in real-time
                            setMessages(prev => prev.map(msg =>
                                msg.id === streamingMessageId
                                    ? { ...msg, content: fullText, streaming: false }
                                    : msg
                            ));
                        }
                    }
                }
                setProcessingStatus(null);
            } else {
                setProcessingStatus(`${agentCard?.name || 'Agent'} is thinking...`);

                // Non-streaming mode (current implementation)
                const result = await clientRef.current.sendMessage({
                    message: {
                        kind: 'message',
                        role: 'user',
                        messageId: crypto.randomUUID(),
                        parts: [{ kind: 'text', text: userMsg }]
                    }
                });

                console.log('Agent response:', result);
                setProcessingStatus(null);

                // Handle response - check for different response structures
                if (result.kind === 'message' || (result.messageId && result.parts)) {
                    // Standard message response
                    const text = result.parts?.find((p: any) => p.kind === 'text')?.text;
                    if (text) {
                        setMessages(prev => [...prev, { role: 'agent', content: text, id: result.messageId || Date.now().toString() }]);
                    }
                } else if (result.kind === 'task') {
                    // Task response - extract message from task
                    const taskMessage = result.history?.[0] || result;
                    const text = taskMessage.parts?.find((p: any) => p.kind === 'text')?.text;

                    if (text) {
                        setMessages(prev => [...prev, { role: 'agent', content: text, id: result.id }]);
                    } else {
                        setMessages(prev => [...prev, { role: 'agent', content: `Task ${result.id}: ${result.status}`, id: result.id }]);
                    }
                } else {
                    console.warn('Unknown response type:', result);
                    setMessages(prev => [...prev, { role: 'sys', content: `Received response: ${JSON.stringify(result)}`, id: Date.now().toString() }]);
                }
            }

        } catch (err: any) {
            console.error('Send message error:', err);
            setProcessingStatus(null);
            setMessages(prev => [...prev, { role: 'sys', content: `Error: ${err.message}`, id: Date.now().toString() }]);
        } finally {
            setLoading(false);
            setActiveAgent(null);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex flex-col h-screen bg-black text-white selection:bg-purple-500/30 font-sans">
            {/* Header */}
            <header className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.push('/')} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-white/70" />
                    </button>

                    <div>
                        <h1 className="font-bold text-lg flex items-center gap-2">
                            {agentCard ? agentCard.name : 'Initializing...'}
                            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-white/10 border border-white/10 text-white/50">
                                A2A Protocol
                            </span>
                        </h1>
                        <p className="text-xs text-white/40 font-mono">
                            {agentCard ? `${agentCard.url}` : 'Connecting...'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium">
                        <Shield className="w-3 h-3" />
                        Archestra Secured
                    </div>
                </div>
            </header>

            {/* Messages Area */}
            <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                {isConnecting && (
                    <div className="flex flex-col items-center justify-center h-full text-white/30 space-y-4">
                        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white/80 animate-spin" />
                        <p>Establishing secure connection...</p>
                    </div>
                )}

                {error && (
                    <div className="flex flex-col items-center justify-center h-full text-red-400 space-y-4">
                        <AlertTriangle className="w-12 h-12 mb-2" />
                        <p>Connection Failed</p>
                        <code className="bg-red-500/10 px-4 py-2 rounded text-sm">{error}</code>
                    </div>
                )}

                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl p-4 border ${msg.role === 'user'
                            ? 'bg-purple-600/20 border-purple-500/30 text-purple-100 rounded-tr-sm'
                            : msg.role === 'sys'
                                ? 'bg-red-500/10 border-red-500/20 text-red-200'
                                : 'bg-white/5 border-white/10 text-gray-200 rounded-tl-sm'
                            }`}>
                            {msg.role === 'agent' && (
                                <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider opacity-50">
                                    <Terminal className="w-3 h-3" />
                                    {agentCard?.name}
                                </div>
                            )}
                            <div className="whitespace-pre-wrap leading-relaxed">
                                {msg.content}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </main>

            {/* Processing Status Indicator */}
            {processingStatus && (
                <div className="px-4 py-2 border-t border-white/10 bg-white/5 backdrop-blur-md">
                    <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                            <span className="text-white/60">{processingStatus}</span>
                        </div>
                        {activeAgent && (
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs">
                                <Terminal className="w-3 h-3" />
                                {activeAgent}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-black">
                <div className="max-w-4xl mx-auto relative flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Message agent..."
                        disabled={loading || isConnecting || !!error}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 pr-12 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all disabled:opacity-50"
                        autoFocus
                    />
                    <button
                        onClick={sendMessage}
                        disabled={loading || isConnecting || !!error || !input.trim()}
                        className="absolute right-2 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white disabled:opacity-30 transition-all"
                    >
                        {loading ? <div className="w-5 h-5 border-2 border-white/50 border-t-white animate-spin rounded-full" /> : <Send className="w-5 h-5" />}
                    </button>
                </div>
                <p className="text-center text-xs text-white/20 mt-3">
                    Protected by Archestra Governance Layer v1.0
                </p>
            </div>
        </div>
    );
}
