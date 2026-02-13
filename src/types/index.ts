// Type definitions for Archestra Platform

export interface Agent {
    id: string;
    name: string;
    role: string;
    description: string;
    color: string;
    disabled?: boolean;
}

export interface Message {
    id: string;
    role: 'user' | 'agent' | 'system';
    content: string;
    createdAt?: string;
    parts?: MessagePart[];
    streaming?: boolean;
    isLoadMoreIndicator?: boolean;
    totalMessages?: number;
}

export interface MessagePart {
    kind: 'text' | 'image' | 'file';
    type?: string;
    text?: string;
    content?: string;
}

export interface Conversation {
    id: string;
    title: string;
    agent: {
        id: string;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
    selectedModel?: string;
    selectedProvider?: string;
    lastMessage?: string;
    messages?: Message[];
    messageCount?: number;
}

export interface AgentStatus {
    available: boolean;
    name?: string;
    capabilities?: string[];
    lastChecked?: string;
}

export interface AgentCardResponse {
    name: string;
    description?: string;
    capabilities?: string[];
    version?: string;
}

export interface ConversationsResponse {
    conversations: Conversation[];
    total: number;
    hasMore: boolean;
}

export interface ApiError {
    error: string;
    message?: string;
    available: boolean;
}
