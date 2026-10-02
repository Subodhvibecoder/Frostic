/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Clock, 
  Check, 
  TrendingUp, 
  ArrowRight, 
  Sparkles, 
  Info,
  Layers,
  ArrowDownRight
} from 'lucide-react';
import { SavingsOpportunity, CurrencyConfig } from '../data';

interface SavingsRecoveryProps {
  opportunities: SavingsOpportunity[];
  currency: CurrencyConfig;
  onRefreshStats?: () => void;
}

export default function SavingsRecovery({
  opportunities,
  currency
}: SavingsRecoveryProps) {
  
  const formatCurrency = (val: number) => {
    const adjusted = val * currency.rate;
    return `${currency.symbol}${adjusted.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  // Separate stages
  const identified = opportunities.reduce((sum, curr) => sum + curr.estimatedSavings, 0);
  const approved = opportunities
    .filter(op => op.status === 'Approved' || op.status === 'In Progress' || op.status === 'Completed')
    .reduce((sum, curr) => sum + curr.estimatedSavings, 0);
  
  const inProgress = opportunities
    .filter(op => op.status === 'In Progress')
    .reduce((sum, curr) => sum + curr.estimatedSavings, 0);

  const recovered = opportunities
    .filter(op => op.status === 'Completed')
    .reduce((sum, curr) => sum + curr.estimatedSavings, 0);

  const pipeline = [
    { label: 'Identified Savings', value: identified, desc: 'Calculated redundancies flagged for review', color: 'text-slate-400' },
    { label: 'Approved Savings', value: approved, desc: 'Cost-reduction plans formally authorized', color: 'text-cyan-400' },
    { label: 'In Progress', value: inProgress, desc: 'Active deprovisioning workflows executing', color: 'text-amber-400' },
    { label: 'Recovered Savings', value: recovered, desc: 'Direct balance-sheet expense reduction realized', color: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-lg font-bold text-white">Savings Recovery Pipeline</h2>
        <p className="text-xs text-slate-400">Tracks active cost optimizations from initial identification to realized balance sheet value</p>
      </div>

      {/* Visual Pipeline Progression */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {pipeline.map((stage, idx) => (
          <div key={idx} className="bg-slate-900/10 border border-slate-900 rounded-2xl p-6 relative flex flex-col justify-between">
            <span className="text-[9px] text-slate-500 font-mono tracking-wider block uppercase mb-4">STAGE 0{idx + 1} // {stage.label}</span>
            <div>
              <h3 className={`text-2xl font-bold font-mono tracking-tight ${stage.color}`}>{formatCurrency(stage.value)}</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{stage.desc}</p>
            </div>
            {idx < 3 && (
              <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-950 border border-slate-900 flex items-center justify-center text-slate-500 z-10">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recovered Value Statement Box */}
      <div className="bg-gradient-to-r from-emerald-950/25 to-slate-950/50 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-emerald-400 font-semibold font-mono uppercase tracking-wider block">CAPABILITY AUDIT METRIC: SPEND_TO_RECOVERY</span>
            <h3 className="text-sm font-bold text-white mt-1 mb-2">Core Product Loop: From Spend Data to Recovered Savings</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-2xl mb-4">
              Frostic closes the loop of financial optimization by converting detected leaks directly into recovered capital. Approve saving plans in the **Actionable Opportunities** directory. Executing those items automatically downsizes related active spend indexes.
            </p>
            
            <div className="flex gap-4 items-center">
              <div>
                <span className="text-[10px] text-slate-500 font-mono block">PIPELINE CONVERSION RATE:</span>
                <span className="text-sm font-bold text-white font-mono">{identified > 0 ? Math.round((recovered / identified) * 100) : 0}% Realized</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Trace Logs */}
      <div className="bg-slate-900/10 border border-slate-900 rounded-2xl p-6">
        <h3 className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider mb-4">Active Recovery Logs</h3>
        
        <div className="space-y-4">
          {opportunities.filter(op => op.status === 'Completed' || op.status === 'Approved').map((op) => (
            <div key={op.id} className="flex items-start justify-between text-xs bg-slate-950/40 p-4 border border-slate-900 rounded-xl">
              <div className="flex gap-3 items-center">
                <div className={`w-2.5 h-2.5 rounded-full ${op.status === 'Completed' ? 'bg-emerald-500' : 'bg-cyan-500'}`} />
                <div>
                  <span className="font-semibold text-white block">{op.title}</span>
                  <span className="text-[10px] text-slate-500 font-mono block">VENDOR: {op.vendor}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono text-xs font-bold text-emerald-400 block">{formatCurrency(op.estimatedSavings)} / year</span>
                <span className="text-[10px] text-slate-500 font-mono uppercase">{op.status}</span>
              </div>
            </div>
          ))}
          {opportunities.filter(op => op.status === 'Completed' || op.status === 'Approved').length === 0 && (
            <p className="text-xs text-slate-500 py-4 text-center">No recoveries are currently approved or executed. Navigate to **Actionable Opportunities** to initiate cost reduction.</p>
          )}
        </div>
      </div>
    </div>
  );
}
