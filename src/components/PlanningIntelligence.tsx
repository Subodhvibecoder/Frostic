/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Zap, 
  Sliders, 
  Copy, 
  Layers, 
  BarChart2, 
  Calendar, 
  Check, 
  X, 
  AlertTriangle, 
  RotateCcw, 
  ArrowRight,
  TrendingUp,
  Info
} from 'lucide-react';
import { 
  SavingsOpportunity, 
  Budget, 
  Subscription, 
  Expense, 
  CurrencyConfig 
} from '../data';

interface PlanningIntelligenceProps {
  opportunities: SavingsOpportunity[];
  setOpportunities: React.Dispatch<React.SetStateAction<SavingsOpportunity[]>>;
  budgets: Budget[];
  setBudgets: React.Dispatch<React.SetStateAction<Budget[]>>;
  subscriptions: Subscription[];
  setSubscriptions: React.Dispatch<React.SetStateAction<Subscription[]>>;
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  currency: CurrencyConfig;
  defaultSubTab?: string;
  onRefreshStats?: () => void;
}

export default function PlanningIntelligence({
  opportunities,
  setOpportunities,
  budgets,
  setBudgets,
  subscriptions,
  setSubscriptions,
  expenses,
  setExpenses,
  currency,
  defaultSubTab = 'opportunities',
  onRefreshStats
}: PlanningIntelligenceProps) {
  
  const [subTab, setSubTab] = useState<string>(defaultSubTab);
  
  // Simulator states
  const [sliderSeats, setSliderSeats] = useState<number>(0); // percent optimization
  const [sliderCloud, setSliderCloud] = useState<number>(0);
  const [sliderRenegotiate, setSliderRenegotiate] = useState<number>(0);
  const [savedScenario, setSavedScenario] = useState<{ seats: number, cloud: number, reneg: number } | null>(null);

  // Scenario Lab state
  const [activeScenario, setActiveScenario] = useState<'reduction' | 'growth' | 'inflation' | 'cloud' | null>(null);

  // Duplicates grouping
  const duplicateGroups = [
    {
      id: 'dup-1',
      category: 'Virtual Collaboration Whiteboards',
      tools: ['Miro Boards', 'Figma Jam'],
      cost: 17400,
      utilization: 'Miro (35%) vs Figma (90%)',
      savings: 17400,
      resolved: false,
      rec: 'Cancel Miro Enterprise subscription immediately and consolidate team under your active Figma corporate licensing.'
    },
    {
      id: 'dup-2',
      category: 'Corporate Video Conferencing',
      tools: ['Zoom Enterprise', 'Google Meet', 'Slack Huddles'],
      cost: 42000,
      utilization: 'Uncoordinated department licenses',
      savings: 21000,
      resolved: false,
      rec: 'Standardize communication workflows on Google Meet & Slack Huddles; terminate redundant premium Zoom tiers.'
    }
  ];
  
  const [activeDuplicates, setActiveDuplicates] = useState(duplicateGroups);

  const formatCurrency = (val: number) => {
    const adjusted = val * currency.rate;
    return `${currency.symbol}${adjusted.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  // Opportunity Actions
  const handleApproveOpportunity = (id: string) => {
    setOpportunities(prev => prev.map(op => {
      if (op.id === id) {
        // Switch status to Approved / Completed
        const nextStatus = op.status === 'New' ? 'Approved' : op.status === 'Approved' ? 'Completed' : op.status;
        
        if (nextStatus === 'Completed') {
          // Trigger related expense adjustment
          setExpenses(exps => exps.map(e => {
            if (e.vendor.toLowerCase() === op.vendor.toLowerCase()) {
              const reduction = op.estimatedSavings / 12;
              return { ...e, amount: Math.max(0, e.amount - reduction) };
            }
            return e;
          }));
        }

        return { ...op, status: nextStatus };
      }
      return op;
    }));
  };

  const handleDismissOpportunity = (id: string) => {
    setOpportunities(prev => prev.map(op => op.id === id ? { ...op, status: 'Dismissed' } : op));
  };

  // Budget Adjuster
  const handleBudgetChange = (dept: string, newAmt: number) => {
    setBudgets(prev => prev.map(b => b.department === dept ? { 
      ...b, 
      budget: newAmt, 
      remaining: newAmt - b.actual 
    } : b));
  };

  // Reset simulator
  const handleResetSimulator = () => {
    setSliderSeats(0);
    setSliderCloud(0);
    setSliderRenegotiate(0);
  };

  // Save/compare simulator scenarios
  const handleSaveScenario = () => {
    setSavedScenario({
      seats: sliderSeats,
      cloud: sliderCloud,
      reneg: sliderRenegotiate
    });
    alert('Scenario snapshot captured! Sliders can now be modified to compare values.');
  };

  // Dynamic calculations for simulator
  const baseMonthlySpend = expenses.reduce((sum, curr) => sum + curr.amount, 0);
  const simulatedMonthlySpend = baseMonthlySpend 
    - (baseMonthlySpend * (sliderSeats / 100) * 0.1) // seats save up to 10%
    - (baseMonthlySpend * (sliderCloud / 100) * 0.2) // cloud saves up to 20%
    - (baseMonthlySpend * (sliderRenegotiate / 100) * 0.15); // negotiations save up to 15%;

  const simulatedSavings = baseMonthlySpend - simulatedMonthlySpend;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Sub Tabs Navigation */}
      <div className="flex border-b border-slate-900 gap-1 overflow-x-auto pb-px">
        {[
          { id: 'opportunities', label: 'Actionable Opportunities', icon: Zap },
          { id: 'simulator', label: 'Savings Simulator', icon: Sliders },
          { id: 'duplicates', label: 'Duplicate Tool Overlaps', icon: Copy },
          { id: 'scenario-lab', label: 'Executive Scenario Lab', icon: Layers },
          { id: 'budgets', label: 'Budget Allocator', icon: BarChart2 },
          { id: 'renewals', label: 'Renewal Command & Calendar', icon: Calendar },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 shrink-0 ${
                isActive 
                  ? 'border-cyan-400 text-cyan-400 font-bold bg-cyan-950/10' 
                  : 'border-transparent text-slate-400 hover:text-slate-150 hover:bg-slate-900/15'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= OPPORTUNITIES SUB-TAB ================= */}
      {subTab === 'opportunities' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Actionable Cost-Reduction Path</h2>
            <p className="text-xs text-slate-400">Approve detected opportunities to decrease related monthly expense rates.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {opportunities.filter(op => op.status !== 'Dismissed').map((op) => (
              <div key={op.id} className="bg-slate-900/10 border border-slate-900 rounded-2xl p-6 flex flex-col justify-between relative">
                
                {/* Visual Status Indicator */}
                <div className="absolute top-6 right-6 flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded-md ${
                    op.status === 'Completed' ? 'bg-emerald-500/15 text-emerald-400' :
                    op.status === 'Approved' ? 'bg-cyan-500/15 text-cyan-400' :
                    'bg-slate-950 text-slate-400'
                  }`}>
                    {op.status.toUpperCase()}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-cyan-400 font-mono tracking-wider block mb-1">
                    VENDOR: {op.vendor.toUpperCase()}
                  </span>
                  <h3 className="text-sm font-bold text-white leading-snug mb-3 max-w-[70%]">{op.title}</h3>
                  
                  <div className="grid grid-cols-2 gap-4 bg-slate-950/40 p-4 border border-slate-900 rounded-xl mb-4 text-xs">
                    <div>
                      <span className="text-slate-500 block">EST. RECOVERY VALUE:</span>
                      <span className="font-mono font-bold text-emerald-400 text-sm">{formatCurrency(op.estimatedSavings)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">CONFIDENCE RATING:</span>
                      <span className="font-mono font-semibold text-cyan-400 text-sm">{op.confidence}%</span>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs leading-relaxed">
                    <div>
                      <span className="text-slate-500 font-semibold block">Problem Statement</span>
                      <p className="text-slate-300">{op.problem}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold block">Detected Evidence</span>
                      <p className="text-slate-400 font-mono text-[11px]">{op.evidence}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold block">Optimal Response Recommendation</span>
                      <p className="text-slate-300">{op.recommendation}</p>
                    </div>
                  </div>
                </div>

                {op.status !== 'Completed' && (
                  <div className="flex gap-2 border-t border-slate-900 pt-4 mt-6">
                    <button 
                      onClick={() => handleDismissOpportunity(op.id)}
                      className="p-2 text-slate-500 hover:text-rose-400 border border-transparent rounded-lg text-xs font-semibold"
                    >
                      Dismiss
                    </button>
                    <button 
                      onClick={() => handleApproveOpportunity(op.id)}
                      className="flex-1 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-semibold transition-colors"
                    >
                      {op.status === 'New' ? 'Approve Optimization Plan' : 'Execute & Recover Savings'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= SAVINGS SIMULATOR SUB-TAB ================= */}
      {subTab === 'simulator' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Interactive "What-If" Scenario Simulator</h2>
            <p className="text-xs text-slate-400">Toggle operational levers to simulate direct changes in baseline expenditure rates.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Sliders Control Panel (7 columns) */}
            <div className="lg:col-span-7 bg-slate-900/10 border border-slate-900 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">Adjustment Parameters</span>
                <button 
                  onClick={handleResetSimulator}
                  className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Controls</span>
                </button>
              </div>

              {/* Lever 1: Seats optimization */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">Deprovision Dormant Software Seats</span>
                  <span className="font-mono text-cyan-400 font-bold">{sliderSeats}% Optimization</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={sliderSeats} 
                  onChange={(e) => setSliderSeats(parseInt(e.target.value) || 0)}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <span className="text-[10px] text-slate-500 block leading-relaxed">Deprovisions unused enterprise licenses across Miro, Slack, and Notion accounts.</span>
              </div>

              {/* Lever 2: Cloud downsizes */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">Infrastructure Auto-downsizing</span>
                  <span className="font-mono text-cyan-400 font-bold">{sliderCloud}% Optimization</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={sliderCloud} 
                  onChange={(e) => setSliderCloud(parseInt(e.target.value) || 0)}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <span className="text-[10px] text-slate-500 block leading-relaxed">Downsizes overprovisioned database disks and idle compute cores.</span>
              </div>

              {/* Lever 3: Contract renegotiations */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">Volume Contract Renegotiations</span>
                  <span className="font-mono text-cyan-400 font-bold">{sliderRenegotiate}% Optimization</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={sliderRenegotiate} 
                  onChange={(e) => setSliderRenegotiate(parseInt(e.target.value) || 0)}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <span className="text-[10px] text-slate-500 block leading-relaxed">Standardizes multi-year discount matrices to lock in lower tier rates.</span>
              </div>
            </div>

            {/* Impact display (5 columns) */}
            <div className="lg:col-span-5 bg-slate-900/10 border border-slate-900 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white mb-4">Simulated Monthly Ledger Impact</h3>
                
                <div className="space-y-4 bg-slate-950/40 p-4 border border-slate-900 rounded-xl">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Current Monthly Spend:</span>
                    <span className="font-mono text-slate-300">{formatCurrency(baseMonthlySpend)}</span>
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Simulated Monthly Spend:</span>
                    <span className="font-mono text-cyan-400 font-bold text-sm">{formatCurrency(simulatedMonthlySpend)}</span>
                  </div>

                  <div className="flex justify-between text-xs pt-3 border-t border-slate-900">
                    <span className="text-slate-500">Calculated Savings:</span>
                    <span className="font-mono text-emerald-400 font-bold text-sm">-{formatCurrency(simulatedSavings)} / month</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Annualized Savings Potential:</span>
                    <span className="font-mono text-emerald-400 font-bold text-sm">{formatCurrency(simulatedSavings * 12)} / year</span>
                  </div>
                </div>
              </div>

              {savedScenario ? (
                <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-300 mt-4 leading-relaxed">
                  <span className="font-bold block">Active Saved Snapshot:</span>
                  <span>Seats: {savedScenario.seats}% · Cloud: {savedScenario.cloud}% · renegotiate: {savedScenario.reneg}%</span>
                </div>
              ) : null}

              <div className="flex gap-2 mt-6">
                <button 
                  onClick={handleSaveScenario}
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 rounded-xl text-xs font-semibold"
                >
                  Save Scenario
                </button>
                <button 
                  onClick={() => {
                    handleResetSimulator();
                    setSavedScenario(null);
                  }}
                  className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-slate-500 rounded-xl text-xs font-mono"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= DUPLICATE DETECTOR SUB-TAB ================= */}
      {subTab === 'duplicates' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Overlapping Corporate Tools Finder</h2>
            <p className="text-xs text-slate-400">Identifies separate departments using competing tools in identical functional domains</p>
          </div>

          <div className="space-y-4">
            {activeDuplicates.map((dup) => (
              <div key={dup.id} className="bg-slate-900/10 border border-slate-900 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2 max-w-2xl">
                  <span className="text-[10px] text-rose-400 font-mono tracking-wider block uppercase">{dup.category}</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {dup.tools.map(tool => (
                      <span key={tool} className="text-xs font-semibold text-white bg-slate-950 border border-slate-900 px-3 py-1 rounded-lg">
                        {tool}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{dup.rec}</p>
                </div>

                <div className="text-left md:text-right shrink-0 space-y-3">
                  <div>
                    <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block">POTENTIAL SAVINGS</span>
                    <span className="font-mono text-sm font-bold text-emerald-400">{formatCurrency(dup.savings)} / year</span>
                  </div>
                  
                  {dup.resolved ? (
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 justify-end">
                      <Check className="w-4 h-4" />
                      <span>Consolidated</span>
                    </span>
                  ) : (
                    <button 
                      onClick={() => {
                        // Mark duplicate as resolved & subtract Miro/Zoom cost
                        setActiveDuplicates(prev => prev.map(item => item.id === dup.id ? { ...item, resolved: true } : item));
                        setExpenses(exps => exps.map(e => {
                          if (e.vendor.toLowerCase().includes('miro') || e.vendor.toLowerCase().includes('zoom')) {
                            return { ...e, amount: Math.round(e.amount * 0.2), status: 'Active' }; // Downsize expense to minimal tier
                          }
                          return e;
                        }));
                        alert(`Success: Overlapping tools consolidated. Cost run-rate downsized successfully!`);
                      }}
                      className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-semibold transition-all"
                    >
                      Automate Consolidation
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= SCENARIO LAB SUB-TAB ================= */}
      {subTab === 'scenario-lab' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Executive Scenario Lab</h2>
            <p className="text-xs text-slate-400">Simulate macroeconomic trends or infrastructure spikes to stress-test your operational models</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 'reduction', label: '15% Uniform SaaS Reduction', desc: 'Stress-test standard operational limits.' },
              { id: 'growth', label: 'Headcount Hypergrowth', desc: 'Predict license costs for 50 fresh hires.' },
              { id: 'inflation', label: 'Operating Cost Inflation', desc: 'Predict 8% inflation hikes on core tools.' },
              { id: 'cloud', label: 'Compute Infrastructure Spike', desc: 'Model 40% compute spike over launch periods.' }
            ].map((sc) => (
              <button
                key={sc.id}
                onClick={() => setActiveScenario(activeScenario === sc.id ? null : sc.id as any)}
                className={`p-4 rounded-xl text-left border transition-all ${
                  activeScenario === sc.id 
                    ? 'bg-cyan-950/30 border-cyan-500/50 shadow-md shadow-cyan-500/5' 
                    : 'bg-slate-900/15 border-slate-900 hover:border-slate-800'
                }`}
              >
                <span className="text-xs font-semibold text-white block mb-1">{sc.label}</span>
                <p className="text-[10px] text-slate-500 leading-relaxed">{sc.desc}</p>
              </button>
            ))}
          </div>

          {activeScenario && (
            <div className="bg-slate-900/15 border border-slate-900 rounded-2xl p-6 text-left animate-fadeIn">
              <h3 className="text-sm font-bold text-white mb-3">
                {activeScenario === 'reduction' ? 'Stress-test: 15% Uniform SaaS Reduction' :
                 activeScenario === 'growth' ? 'Simulation: Headcount Hypergrowth' :
                 activeScenario === 'inflation' ? 'Model: 8% Operating Cost Inflation' :
                 'Sandbox: 40% Compute Infrastructure Spike'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono mb-4">
                <div className="bg-slate-950/40 p-4 border border-slate-900 rounded-xl">
                  <span className="text-slate-500 block mb-1">BASELINE SPEND:</span>
                  <span className="text-sm font-bold text-white">{formatCurrency(baseMonthlySpend)}</span>
                </div>
                <div className="bg-slate-950/40 p-4 border border-slate-900 rounded-xl">
                  <span className="text-slate-500 block mb-1">SCENARIO SPEND:</span>
                  <span className="text-sm font-bold text-cyan-400">
                    {activeScenario === 'reduction' ? formatCurrency(baseMonthlySpend * 0.85) :
                     activeScenario === 'growth' ? formatCurrency(baseMonthlySpend * 1.35) :
                     activeScenario === 'inflation' ? formatCurrency(baseMonthlySpend * 1.08) :
                     formatCurrency(baseMonthlySpend + 15000)}
                  </span>
                </div>
                <div className="bg-slate-950/40 p-4 border border-slate-900 rounded-xl">
                  <span className="text-slate-500 block mb-1">FINANCIAL VARIANCE:</span>
                  <span className={`text-sm font-bold ${activeScenario === 'reduction' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {activeScenario === 'reduction' ? `-${formatCurrency(baseMonthlySpend * 0.15)} (-15%)` :
                     activeScenario === 'growth' ? `+${formatCurrency(baseMonthlySpend * 0.35)} (+35%)` :
                     activeScenario === 'inflation' ? `+${formatCurrency(baseMonthlySpend * 0.08)} (+8%)` :
                     `+$15,000 (+17%)`}
                  </span>
                </div>
              </div>

              <div className="bg-cyan-950/15 border border-cyan-500/25 p-4 rounded-xl text-xs text-slate-300 leading-relaxed flex items-start gap-3">
                <Info className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold text-white block mb-1">Cognitive Action Blueprint:</span>
                  {activeScenario === 'reduction' ? 'Fully deprovision redundant seats across all software systems. Restrict premium license upgrades to VP level approval.' :
                   activeScenario === 'growth' ? 'Consolidate user onboarding checklists under standard Slack/Notion seat maps to secure immediate volume pricing discount bands.' :
                   activeScenario === 'inflation' ? 'Immediately convert core monthly accounts to annual commitments to bypass the mid-year cost adjustments.' :
                   'Deploy AWS auto-scaling groups and non-production auto-stop triggers over the upcoming product launch dates.'}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= BUDGET ALLOCATOR SUB-TAB ================= */}
      {subTab === 'budgets' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Department Spend & Budget Allocations</h2>
            <p className="text-xs text-slate-400">All values are fully editable. Update department budgets directly to check variance flags.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {budgets.map((b) => {
              const isOverBudget = b.actual > b.budget;
              const percentUsed = Math.round((b.actual / b.budget) * 100) || 0;
              return (
                <div key={b.department} className="bg-slate-900/10 border border-slate-900 rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <h3 className="font-bold text-white text-sm">{b.department} Department</h3>
                    </div>
                    {isOverBudget ? (
                      <span className="text-[10px] text-rose-400 font-mono font-bold bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-md animate-pulse">
                        OVER BUDGET
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                        HEALTHY
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-xs font-mono">
                    <div>
                      <span className="text-slate-500 block mb-1">ALLOCATED BUDGET:</span>
                      <input 
                        type="number" 
                        value={b.budget} 
                        onChange={(e) => handleBudgetChange(b.department, parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-cyan-400 font-bold focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">ACTUAL OUTLAY:</span>
                      <span className="font-bold text-white block pt-1">{formatCurrency(b.actual)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">REMAINING FUNDS:</span>
                      <span className={`font-bold block pt-1 ${isOverBudget ? 'text-rose-400' : 'text-slate-300'}`}>{formatCurrency(b.remaining)}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Budget Utilization:</span>
                      <span>{percentUsed}%</span>
                    </div>
                    <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${isOverBudget ? 'bg-rose-500' : percentUsed > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${Math.min(100, percentUsed)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= RENEWALS SUB-TAB ================= */}
      {subTab === 'renewals' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Upcoming Contract Renewals</h2>
            <p className="text-xs text-slate-400">Monitors active software licenses and contract notices approaching deadlines</p>
          </div>

          <div className="space-y-4">
            {[
              { id: 'ren-1', vendor: 'Figma Pro', date: '2026-10-18', cost: 2100, days: 17, status: 'Critical', rec: 'Has active duplications in other departments.' },
              { id: 'ren-2', vendor: 'Notion Teams', date: '2026-11-15', cost: 3100, days: 45, status: 'Review', rec: 'Dormant seat count is high (120 inactive seats).' },
              { id: 'ren-3', vendor: 'Miro Boards', date: '2026-11-20', cost: 1450, days: 50, status: 'Review', rec: 'Low active engagement. Safe to terminate.' },
              { id: 'ren-4', vendor: 'Slack Technologies', date: '2027-02-14', cost: 5200, days: 136, status: 'Healthy', rec: 'Excellent core engagement and seat utilization.' }
            ].map((ren) => (
              <div key={ren.id} className="bg-slate-900/10 border border-slate-900 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white text-sm">{ren.vendor}</span>
                    <span className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded-md ${
                      ren.status === 'Critical' ? 'bg-rose-500/15 text-rose-400' :
                      ren.status === 'Review' ? 'bg-amber-500/15 text-amber-400' :
                      'bg-emerald-500/15 text-emerald-400'
                    }`}>
                      {ren.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{ren.rec}</p>
                </div>

                <div className="flex items-center gap-8 text-left md:text-right shrink-0">
                  <div>
                    <span className="text-[9px] text-slate-500 font-mono block">MONTHLY CHARGE:</span>
                    <span className="font-mono text-sm font-bold text-white">{formatCurrency(ren.cost)}</span>
                  </div>
                  
                  <div>
                    <span className="text-[9px] text-slate-500 font-mono block font-semibold">REMAINING DAYS:</span>
                    <span className={`font-mono text-sm font-extrabold ${ren.days <= 30 ? 'text-rose-400 animate-pulse' : 'text-slate-300'}`}>{ren.days} Days</span>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => alert(`Initiating direct negotiation prep for ${ren.vendor} renewals.`)}
                      className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-semibold"
                    >
                      Prepare Negotiation
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
