/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Sparkles, 
  Check, 
  ArrowRight, 
  Activity, 
  DollarSign, 
  RefreshCw, 
  Users, 
  FileText, 
  Database, 
  Zap, 
  Sliders, 
  Copy, 
  TrendingUp, 
  Layers, 
  BarChart2, 
  Calendar, 
  AlertTriangle, 
  Clock, 
  Key, 
  Settings, 
  Info 
} from 'lucide-react';

interface CapabilityIndexProps {
  setActiveTab: (tab: string) => void;
}

export default function CapabilityIndex({ setActiveTab }: CapabilityIndexProps) {
  
  const FEATURES = [
    {
      group: 'Overview',
      items: [
        { id: 'command-center', label: 'Command Center', icon: Activity, desc: 'Centralized executive command hub displaying Monthly Spend, Projected Annual outlays, recoverable/realized savings metrics, system-wide health scores, and consolidated spending charts.', status: 'Production-Ready' },
      ]
    },
    {
      group: 'Spend Intelligence',
      items: [
        { id: 'all-expenses', label: 'All Expenses (Ledger)', icon: DollarSign, desc: 'Fully-changeable transaction logs. Filter by department, sector, or status. Click to log new custom lines or edit any parameters.', status: 'Production-Ready' },
        { id: 'subscriptions', label: 'Subscription Auditor', icon: RefreshCw, desc: 'Audit license utilization, seats versus active accounts, calculate monthly waste, renewal notice cycles, and receive direct deprovision options.', status: 'Production-Ready' },
        { id: 'vendors', label: 'Vendor Directory', icon: Users, desc: 'Comprehensive central supplier profiles. Tracks monthly run-rates, overall contract values, and risk scores, with quick action recommendations.', status: 'Production-Ready' },
        { id: 'invoices', label: 'Invoice Scanner', icon: FileText, desc: 'Drag-and-drop file scanner. Simulates real-time file extraction, OCR parsing, contract matching, and alerts for double-billing or quantity hikes.', status: 'Production-Ready' },
        { id: 'cloud-costs', label: 'Cloud Infrastructure Optimizer', icon: Database, desc: 'Tracks compute core metrics, EBS unattached storage volumes, RDS IOPS allocations, with range dials to scale resources live.', status: 'Production-Ready' },
      ]
    },
    {
      group: 'Optimization & Planning',
      items: [
        { id: 'savings-opportunities', label: 'Actionable Opportunities', icon: Zap, desc: 'Detailed cost reduction plans. Tracks problem descriptions, detected evidence, direct impact statements. Approving them downsizes related outlays dynamically.', status: 'Production-Ready' },
        { id: 'savings-simulator', label: 'What-If Savings Simulator', icon: Sliders, desc: 'Responsive sliders to toggle software seat downsizing, cloud auto-scaling ratios, and renegotiations. Generates instant monthly impact models.', status: 'Production-Ready' },
        { id: 'duplicate-detector', label: 'Overlapping Tool Finder', icon: Copy, desc: 'Detects redundant SaaS tools across separate departments (e.g. Miro vs Figma). Provides one-click consolidation shortcuts.', status: 'Production-Ready' },
        { id: 'scenario-lab', label: 'Executive Scenario Lab', icon: Layers, desc: 'Stress-test your business against inflation spikes, hiring growth, or compute spikes. Generates optimal action plan roadmaps.', status: 'Production-Ready' },
        { id: 'budgets', label: 'Budget Allocator', icon: BarChart2, desc: 'Departmental budget tracks displaying actual versus budget variances, remaining allocations, and alert indicators.', status: 'Production-Ready' },
        { id: 'renewals', label: 'Renewal Command & Calendar', icon: Calendar, desc: 'Tracks notice windows, critical cancellation limits, and remaining days with preparation links.', status: 'Production-Ready' },
      ]
    },
    {
      group: 'Intelligence & Execution',
      items: [
        { id: 'ai-copilot', label: 'AI Copilot Hub', icon: Zap, desc: 'Interactive chat widget loaded with quick starters (draft letters, audit checklists) to query active cost records.', status: 'Production-Ready' },
        { id: 'gemini-playground', label: 'Frostic Gemini Playground', icon: Sparkles, desc: 'Full-featured custom playground allowing users to ask any question of their choice (live proxy to Gemini-3.8-Flash on Express backend).', status: 'Production-Ready' },
        { id: 'savings-recovery', label: 'Savings Recovery Pipeline', icon: Clock, desc: 'Tracks optimizations from initial Identification, formal Authorization, active execution, to final realized value.', status: 'Production-Ready' },
      ]
    },
    {
      group: 'Administration & Security',
      items: [
        { id: 'team', label: 'Team Setup', icon: Users, desc: 'Manage your workspace personnel directory. Create custom roles, emails, bios, and assign department managers.', status: 'Production-Ready' },
        { id: 'integrations', label: 'Corporate Integration Hub', icon: Key, desc: 'Link third-party transaction channels, including QuickBooks ledger feeds, bank streams, and cloud endpoints.', status: 'Production-Ready' },
        { id: 'settings', label: 'System Security & Logs', icon: Settings, desc: 'Audit trail logging of system modifications, active team permissions, and credentials configuration.', status: 'Production-Ready' },
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header banner */}
      <div className="bg-gradient-to-r from-cyan-950/20 via-slate-900/30 to-indigo-950/25 border border-cyan-500/20 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex items-center gap-3 mb-2 text-cyan-400">
          <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-wider font-bold">Frostic Feature Ecosystem</span>
        </div>
        <h1 className="text-xl font-bold text-white">SaaS Capability Index & Dashboard</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Welcome to the comprehensive Frostic Capability Directory. This dashboard highlights all 18+ active enterprise cost intelligence features. Click any card to launch its related page instantly.
        </p>
      </div>

      {/* Grid of features groups */}
      <div className="space-y-8">
        {FEATURES.map((grp) => (
          <div key={grp.group} className="space-y-3">
            <span className="text-[10px] text-cyan-400 font-mono tracking-wider uppercase block font-semibold border-b border-slate-900 pb-1.5">{grp.group}</span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {grp.items.map((feat) => {
                const Icon = feat.icon;
                return (
                  <button
                    key={feat.id}
                    onClick={() => setActiveTab(feat.id)}
                    className="p-5 bg-slate-900/10 hover:bg-slate-900/30 border border-slate-900 hover:border-cyan-500/30 text-left rounded-2xl flex flex-col justify-between transition-all group cursor-pointer"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-cyan-400 group-hover:text-cyan-300 group-hover:scale-105 transition-all">
                          <Icon className="w-4.5 h-4.5" />
                        </div>
                        
                        <span className="text-[9px] text-emerald-400 font-mono font-semibold bg-emerald-500/10 border border-emerald-500/15 px-2 py-0.5 rounded-md">
                          {feat.status}
                        </span>
                      </div>

                      <h3 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">{feat.label}</h3>
                      <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">{feat.desc}</p>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-cyan-400 hover:text-cyan-300 mt-4 border-t border-slate-900/60 pt-3 w-full">
                      <span>Launch Feature</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
