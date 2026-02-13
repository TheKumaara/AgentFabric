import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Clock } from 'lucide-react';
import { Conversation } from '@/types';

interface ConversationCardProps {
    conversation: Conversation;
    agentIcon?: React.ComponentType<{ className?: string }>;
    agentColor?: string;
}

export function ConversationCard({ conversation, agentIcon: Icon, agentColor }: ConversationCardProps) {
    const agentId = conversation.agent?.id || 'd904f99e-af2a-4e6a-9474-44f78403ccc4';

    return (
        <Link
            href={`/chat/${agentId}?conversationId=${conversation.id}`}
            className="block bg-white/5 rounded-xl border border-white/10 p-5 hover:bg-white/[0.07] hover:border-white/20 transition-all cursor-pointer group"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {Icon && (
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${agentColor}`}>
                            <Icon className="w-4 h-4" />
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white truncate group-hover:text-purple-300 transition-colors">
                            {conversation.title || 'Untitled Conversation'}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-white/40 mt-0.5">
                            <span>{conversation.agent?.name || 'Unknown Agent'}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{formatDistanceToNow(new Date(conversation.createdAt), { addSuffix: true })}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    {conversation.messageCount && (
                        <span className="px-2 py-1 rounded-full bg-white/5 text-white/60 border border-white/10 text-xs flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {conversation.messageCount}
                        </span>
                    )}
                    {conversation.selectedModel && (
                        <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs">
                            {conversation.selectedModel}
                        </span>
                    )}
                </div>
            </div>
            {conversation.lastMessage && (
                <p className="text-sm text-white/60 line-clamp-2">
                    {conversation.lastMessage}
                </p>
            )}
        </Link>
    );
}
