
'use client';

import { MessageSquare, Users, BarChart3, Activity, Command, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Conversation, AgentStatus } from '@/types';
import { ConversationCard } from '@/components/ConversationCard';
import { StatCard } from '@/components/StatCard';
import { ConversationSkeleton } from '@/components/LoadingStates';
import { config } from '@/config';

const AGENTS = [
  {
    id: 'orchestrator',
    name: 'Executive Manager',
    role: 'Executive Operations',
    description: 'Oversees company operations, provides strategic insights, and routes queries to department managers.',
    icon: Command,
    color: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
  },
  {
    id: 'hr',
    name: 'HR Agent',
    role: 'Human Resources',
    description: 'Manages employee data, leave requests, and recruiting workflows.',
    icon: Users,
    color: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  },
  {
    id: 'finance',
    name: 'Finance Agent',
    role: 'Financial Operations',
    description: 'Handles payroll, expenses, budget tracking, and financial forecasting.',
    icon: BarChart3,
    color: 'bg-green-500/10 text-green-400 border-green-500/20'
  },
  {
    id: 'ops',
    name: 'Ops Agent',
    role: 'System Operations',
    description: 'Monitors system health, logs, and infrastructure status.',
    icon: Activity,
    color: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    disabled: true
  }
];

export default function Home() {
  const [agentStatus, setAgentStatus] = useState<Record<string, AgentStatus>>({});
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [displayCount, setDisplayCount] = useState(config.api.initialDisplayCount);
  const [searchQuery, setSearchQuery] = useState('');
  const [agentFilter, setAgentFilter] = useState<string>('all');
  const [conversationsLoading, setConversationsLoading] = useState(true);


  useEffect(() => {
    // Fetch agent status from Archestra
    const fetchAgentStatus = async () => {
      try {
        const statuses: Record<string, AgentStatus> = {};

        for (const agent of AGENTS.filter(a => !a.disabled)) {
          try {
            // Use the backend proxy endpoint
            const response = await fetch(`/api/archestra/${agent.id}`);
            if (response.ok) {
              const card = await response.json();
              statuses[agent.id] = {
                available: true,
                name: card.name,
                capabilities: card.capabilities,
                lastChecked: new Date().toISOString()
              };
            } else {
              statuses[agent.id] = { available: false };
            }
          } catch (err) {
            statuses[agent.id] = { available: false };
          }
        }

        setAgentStatus(statuses);
      } catch (error) {
        console.error('Failed to fetch agent status:', error);
        if (config.ui.enableToasts) {
          toast.error('Failed to fetch agent status');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAgentStatus();
    // Refresh every 30 seconds
    const interval = setInterval(fetchAgentStatus, config.api.agentStatusRefreshInterval);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Fetch conversations from Archestra
    const fetchConversations = async () => {
      try {
        const response = await fetch(`/api/archestra/conversations?limit=${config.api.conversationLimit}`);
        if (response.ok) {
          const data = await response.json();
          if (!data.error && Array.isArray(data)) {
            // Add message count to each conversation
            const conversationsWithCount = data.map((conv: any) => ({
              ...conv,
              messageCount: conv.messages?.length || 0
            }));
            setConversations(conversationsWithCount);
          } else if (data.error) {
            if (config.ui.enableToasts) {
              toast.error(data.message || 'Failed to load conversations');
            }
          }
        } else {
          throw new Error('Failed to fetch conversations');
        }
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
        if (config.ui.enableToasts) {
          toast.error('Failed to load conversation history');
        }
      } finally {
        setConversationsLoading(false);
      }
    };

    fetchConversations();
    // Refresh every 15 seconds
    const interval = setInterval(fetchConversations, config.api.conversationRefreshInterval);
    return () => clearInterval(interval);
  }, []);

  // Filter and search conversations
  const filteredConversations = useMemo(() => {
    let filtered = conversations;

    // Filter by agent
    if (agentFilter !== 'all') {
      filtered = filtered.filter(conv =>
        conv.agent?.name?.toLowerCase() === agentFilter.toLowerCase()
      );
    }

    // Search by title or content
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(conv =>
        conv.title?.toLowerCase().includes(query) ||
        conv.lastMessage?.toLowerCase().includes(query) ||
        conv.agent?.name?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [conversations, searchQuery, agentFilter]);

  const loadMoreConversations = () => {
    setDisplayCount(prev => prev + config.api.loadMoreIncrement);
    if (config.ui.enableToasts) {
      toast.success(`Loaded ${Math.min(config.api.loadMoreIncrement, filteredConversations.length - displayCount)} more conversations`);
    }
  };



  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center">
              <Command className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">AgentFabric <span className="text-white/40 font-normal">v1.0</span></span>
          </div>
          <div className="flex items-center gap-4 text-sm text-white/60">
            <span className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500' : 'bg-green-500'} animate-pulse`} />
              {loading ? 'Connecting...' : `${Object.values(agentStatus).filter((s: any) => s.available).length} Agents Online`}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">Agent Workspace</h1>
          <p className="text-white/60 text-lg max-w-2xl">
            Authorize and interact with autonomous agents. The Executive Manager can handle complex multi-step workflows by coordinating with department managers.
          </p>
        </div>

        {/* Quick Stats - Moved to top */}
        <div className="mb-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            value={Object.values(agentStatus).filter(s => s.available).length}
            label="Agents Online"
            color="purple"
            loading={loading}
          />
          <StatCard
            value="65+"
            label="Database Records"
            color="blue"
          />
          <StatCard
            value={Object.values(agentStatus).every(s => s.available || s.available === undefined) ? '100%' : 'Partial'}
            label="System Health"
            color="green"
            loading={loading}
          />
          <StatCard
            value="A2A"
            label="Protocol Ready"
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AGENTS.map((agent) => (
            <Link
              key={agent.id}
              href={agent.disabled ? '#' : `/chat/${agent.id}`}
              className={`group relative p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${agent.disabled ? 'opacity-50 cursor-not-allowed border-white/5 bg-white/5' : 'hover:bg-white/5 border-white/10 bg-black'}`}
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-tr opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${agent.id === 'orchestrator' ? 'from-purple-500/10 to-transparent' : 'from-white/5 to-transparent'}`} />

              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${agent.color}`}>
                  <agent.icon className="w-6 h-6" />
                </div>

                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{agent.name}</h3>
                  {agent.id === 'orchestrator' && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/20">
                      Recommended
                    </span>
                  )}
                </div>

                <div className="text-white/40 text-sm font-medium mb-3 uppercase tracking-wider flex items-center gap-2">
                  {agent.role}
                  {!agent.disabled && agentStatus[agent.id] && (
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs normal-case ${agentStatus[agent.id].available
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${agentStatus[agent.id].available ? 'bg-green-500' : 'bg-red-500'}`} />
                      {agentStatus[agent.id].available ? 'Online' : 'Offline'}
                    </span>
                  )}
                </div>
                <p className="text-white/70 leading-relaxed mb-6">
                  {agent.description}
                </p>

                <div className="flex items-center gap-2 text-sm font-medium opacity-60 group-hover:opacity-100 transition-opacity">
                  {agent.disabled ? (
                    <span>Offline</span>
                  ) : (
                    <>
                      <span>Launch Interface</span>
                      <MessageSquare className="w-4 h-4 ml-1" />
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Conversations */}
        <div className="mt-16 pt-16 border-t border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-white/40" />
              Recent Conversations
              {conversations.length > 0 && (
                <span className="text-xs text-white/40 font-normal ml-2">
                  Live • Updates every {config.api.conversationRefreshInterval / 1000}s
                </span>
              )}
            </h2>
          </div>

          {/* Search and Filter */}
          {config.ui.enableSearch && conversations.length > 0 && (
            <div className="mb-6 flex flex-col sm:flex-row gap-3">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.07] transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Agent Filter */}
              <select
                value={agentFilter}
                onChange={(e) => setAgentFilter(e.target.value)}
                className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.07] transition-all cursor-pointer"
              >
                <option value="all">All Agents</option>
                {AGENTS.filter(a => !a.disabled).map(agent => (
                  <option key={agent.id} value={agent.name}>{agent.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Results Count */}
          {(searchQuery || agentFilter !== 'all') && (
            <div className="mb-4 text-sm text-white/60">
              Found {filteredConversations.length} conversation{filteredConversations.length !== 1 ? 's' : ''}
              {searchQuery && ` matching "${searchQuery}"`}
              {agentFilter !== 'all' && ` from ${agentFilter}`}
            </div>
          )}

          {conversationsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <ConversationSkeleton key={i} />
              ))}
            </div>
          ) : filteredConversations.length > 0 ? (
            <>
              <div className="space-y-4">
                {filteredConversations.slice(0, displayCount).map((conv) => {
                  // Find matching agent info by name for icon display
                  const agentInfo = AGENTS.find(a =>
                    a.name.toLowerCase() === conv.agent?.name?.toLowerCase()
                  );

                  return (
                    <ConversationCard
                      key={conv.id}
                      conversation={conv}
                      agentIcon={agentInfo?.icon}
                      agentColor={agentInfo?.color}
                    />
                  );
                })}
              </div>

              {/* Load More Button */}
              {displayCount < filteredConversations.length && (
                <div className="mt-6 text-center">
                  <button
                    onClick={loadMoreConversations}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg text-sm font-medium transition-all"
                  >
                    Load More ({filteredConversations.length - displayCount} remaining)
                  </button>
                </div>
              )}
            </>
          ) : searchQuery || agentFilter !== 'all' ? (
            <div className="bg-white/5 rounded-xl border border-white/10 p-12 text-center">
              <Search className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white/80 mb-2">No conversations found</h3>
              <p className="text-white/40 text-sm max-w-md mx-auto mb-4">
                Try adjusting your search or filter criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setAgentFilter('all');
                }}
                className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg text-sm font-medium text-purple-300 transition-all"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="bg-white/5 rounded-xl border border-white/10 p-12 text-center">
              <Activity className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60 font-medium mb-2">No Conversations Yet</p>
              <p className="text-white/40 text-sm max-w-md mx-auto">
                Start chatting with an agent to see conversation history here.
              </p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
