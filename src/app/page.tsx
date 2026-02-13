
import { MessageSquare, Users, BarChart3, Activity, Command } from 'lucide-react';
import Link from 'next/link';

const AGENTS = [
  {
    id: 'orchestrator',
    name: 'Orchestrator Agent',
    role: 'Central Intelligence',
    description: 'Routes complex tasks to appropriate departments and synthesizes results.',
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
  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center">
              <Command className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Company OS <span className="text-white/40 font-normal">v1.0</span></span>
          </div>
          <div className="flex items-center gap-4 text-sm text-white/60">
            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> System Operational</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">Agent Workspace</h1>
          <p className="text-white/60 text-lg max-w-2xl">
            Authorize and interact with autonomous agents. The Orchestrator can handle complex multi-step workflows by coordinating with other agents.
          </p>
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

                <p className="text-white/40 text-sm font-medium mb-3 uppercase tracking-wider">{agent.role}</p>
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

        {/* Recent Activity / Observability simulation */}
        <div className="mt-16 pt-16 border-t border-white/10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-white/40" />
            Live Activity Stream
          </h2>
          <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
            <div className="grid grid-cols-4 p-4 border-b border-white/10 text-xs font-medium text-white/40 uppercase tracking-wider">
              <div>Timestamp</div>
              <div>Agent</div>
              <div>Action</div>
              <div>Status</div>
            </div>
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="grid grid-cols-4 p-4 border-b border-white/5 text-sm hover:bg-white/5 transition-colors">
                <div className="text-white/40">10:{30 + i}:00 AM</div>
                <div className="font-mono text-purple-300">orchestrator-agent</div>
                <div>Routed task to Finance Agent</div>
                <div className="text-green-400 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Completed</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
