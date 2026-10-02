/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShieldAlert, 
  Zap, 
  RefreshCw, 
  BarChart2, 
  Users, 
  ArrowRight, 
  Play, 
  Info, 
  Check, 
  AlertTriangle,
  RotateCcw,
  Plus
} from 'lucide-react';
import { 
  Expense, 
  Subscription, 
  SavingsOpportunity, 
  CompanyProfile, 
  UserProfile, 
  CurrencyConfig, 
  calculateStats 
} from '../data';

interface CommandCenterProps {
  expenses: Expense[];
  subscriptions: Subscription[];
  opportunities: SavingsOpportunity[];
  company: CompanyProfile;
  user: UserProfile;
  currency: CurrencyConfig;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onAnalyzeCompany: () => void;
  onResetData: () => void;
  onRestoreDemo: () => void;
  onAddExpense: () => void;
}

export default function CommandCenter({
  expenses,
  subscriptions,
  opportunities,
  company,
  user,
  currency,
  setActiveTab,
  onAnalyzeCompany,
  onResetData,
  onRestoreDemo,
  onAddExpense
}: CommandCenterProps) {
  
  const [timeFilter, setTimeFilter] = useState<'30' | '90' | '180' | '365'>('90');
  const [activeHealthWhy, setActiveHealthWhy] = useState<string | null>(null);

  // Derive stats
  const stats = calculateStats(expenses, subscriptions, opportunities);

  const formatCurrency = (val: number) => {
    const adjusted = val * currency.rate;
    return `${currency.symbol}${adjusted.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  // Cost Health items
  const healthScores = [
    {
      id: 'efficiency',
      title: 'Cost Efficiency Score',
      score: stats.costEfficiency,
      desc: 'Overall spending vs. recognized cost leakage indicators.',
      color: stats.costEfficiency > 80 ? 'text-emerald-400' : stats.costEfficiency > 60 ? 'text-amber-400' : 'text-rose-400',
      barColor: stats.costEfficiency > 80 ? 'bg-emerald-500' : stats.costEfficiency > 60 ? 'bg-amber-500' : 'bg-rose-500',
      why: `Your cost efficiency is calculated by measuring optimal possible spending against your current transaction ledger. You have identified ${opportunities.length} active saving opportunities. Fully implementing them will raise this score to 100%.`
    },
    {
      id: 'risk',
      title: 'Vendor Risk Exposure',
      score: stats.financialRisk === 'High' ? 35 : stats.financialRisk === 'Medium' ? 70 : 92,
      desc: 'Based on single-vendor concentration and contract overlap metrics.',
      color: stats.financialRisk === 'Low' ? 'text-emerald-400' : stats.financialRisk === 'Medium' ? 'text-amber-400' : 'text-rose-400',
      barColor: stats.financialRisk === 'Low' ? 'bg-emerald-500' : stats.financialRisk === 'Medium' ? 'bg-amber-500' : 'bg-rose-500',
      why: 'Single-vendor concentration is high if a single infrastructure provider represents >40% of total recurring outlays. Also audits multiple billing accounts for the same vendor.'
    },
    {
      id: 'integrity',
      title: 'Invoice Integrity Rating',
      score: expenses.length === 0 ? 100 : Math.round((expenses.filter(e => e.status !== 'Flagged').length / expenses.length) * 100),
      desc: 'System-wide billing audits and historical anomaly tracking.',
      color: 'text-cyan-400',
      barColor: 'bg-cyan-500',
      why: 'Measures standard consistency in recurring pricing curves. Any sudden subscription spikes or unexplained line items lower this rating until cleared.'
    }
  ];

  // Quick categories aggregate
  const categories = Array.from(new Set(expenses.map(e => e.category)));
  const categorySpend = categories.map(cat => {
    const amt = expenses.filter(e => e.category === cat).reduce((sum, curr) => sum + curr.amount, 0);
    return { name: cat, amount: amt };
  }).sort((a, b) => b.amount - a.amount);

  const totalCatSpend = categorySpend.reduce((sum, curr) => sum + curr.amount, 0);

  // Zero-state check
  const isZeroState = expenses.length === 0 && subscriptions.length === 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Welcome Banner Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/30 border border-slate-900 rounded-2xl p-6">
        <div>
          <span className="text-[10px] text-cyan-400 font-mono tracking-wider uppercase block mb-1">
            EXECUTIVE COMMAND CENTRE // {company.name.toUpperCase()}
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Welcome back, {user.name}
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {isZeroState 
              ? "Your financial workspace is fully initialized and ready for automated audit ingestion." 
              : `Frostic has audited your spending. Identified ${formatCurrency(stats.potentialSavings)} in potential annual optimization options.`}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {isZeroState ? (
            <>
              <button 
                onClick={onRestoreDemo}
                className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/35 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Load Demo Dataset</span>
              </button>
              <button 
                onClick={onAddExpense}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-850 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add First Expense</span>
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={onAnalyzeCompany}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/10"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Trigger AI System Re-scan</span>
              </button>
              <button 
                onClick={onResetData}
                className="px-4 py-2 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Clean 0-Ledger</span>
              </button>
            </>
          )}
        </div>
      </div>

      {isZeroState ? (
        /* ================= ZERO DATA STATE OVERVIEW ================= */
        <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-12 text-center max-w-2xl mx-auto my-12">
          <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto mb-6">
            <DollarSign className="w-6 h-6 text-slate-500" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Operational Spend Ledger is Empty</h3>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            No expenses, contracts, or subscriptions have been logged in the system. Load the default high-integrity demo dataset to explore automated dashboards or populate your custom rows from scratch.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button 
              onClick={onRestoreDemo}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-cyan-500/10"
            >
              Load Demo Financial Dataset
            </button>
            <button 
              onClick={onAddExpense}
              className="w-full sm:w-auto px-6 py-3 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 rounded-xl text-xs font-semibold transition-all"
            >
              Add First Expense Entry
            </button>
          </div>
        </div>
      ) : (
        /* ================= POPULATED STATE OVERVIEW ================= */
        <>
          {/* Main executive metrics grid (Level 1) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Total Spend */}
            <div className="bg-slate-900/20 border border-slate-900/60 hover:border-slate-800 rounded-2xl p-6 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase block">
                  MONTHLY BUSINESS RUN-RATE
                </span>
                <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-900">
                  <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white font-mono tracking-tight group-hover:text-cyan-400 transition-colors">
                {formatCurrency(stats.totalSpend)}
              </h3>
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                <span className="text-rose-400 font-semibold font-mono">+4.2%</span>
                <span>from previous billing period</span>
              </p>
            </div>

            {/* Projected Annual Spend */}
            <div className="bg-slate-900/20 border border-slate-900/60 hover:border-slate-800 rounded-2xl p-6 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase block">
                  PROJECTED ANNUAL RUN-RATE
                </span>
                <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-900">
                  <BarChart2 className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white font-mono tracking-tight group-hover:text-cyan-400 transition-colors">
                {formatCurrency(stats.projectedAnnualSpend)}
              </h3>
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                <span>Calculated on current operational trajectory</span>
              </p>
            </div>

            {/* Potential Savings */}
            <div className="bg-slate-900/20 border border-slate-900/60 hover:border-slate-800 rounded-2xl p-6 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase block">
                  POTENTIAL RECOVERABLE SAVINGS
                </span>
                <div className="p-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/20">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-cyan-400 font-mono tracking-tight">
                {formatCurrency(stats.potentialSavings)}
              </h3>
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                <span className="text-cyan-400 font-semibold font-mono">
                  {Math.round((stats.potentialSavings / stats.projectedAnnualSpend) * 100) || 0}%
                </span>
                <span>of gross spending optimized</span>
              </p>
            </div>

            {/* Savings Recovered */}
            <div className="bg-slate-900/20 border border-slate-900/60 hover:border-slate-800 rounded-2xl p-6 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase block">
                  SAVINGS REALIZED / RECOVERED
                </span>
                <div className="p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/20">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-emerald-400 font-mono tracking-tight">
                {formatCurrency(stats.savingsRecovered)}
              </h3>
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                <span>Direct balance-sheet value captured</span>
              </p>
            </div>

          </div>

          {/* AI Executive Briefing Container */}
          <div className="bg-gradient-to-r from-slate-900/80 to-slate-950/80 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex items-center gap-2 mb-4 text-cyan-400">
              <Sparkles className="w-4.5 h-4.5 text-cyan-400 animate-pulse" />
              <span className="text-xs font-semibold tracking-wider font-mono uppercase">
                Frostic Intelligence Briefing
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
              <div className="md:border-r border-slate-800/80 pr-4">
                <span className="text-[10px] text-slate-500 font-mono block mb-1">WHAT'S HAPPENING</span>
                <p className="text-xs font-semibold text-slate-200 leading-relaxed">
                  Gross operating expenditure increased by 4.2% month-over-month. Cloud compute costs spiked by $3,100.
                </p>
              </div>
              <div className="md:border-r border-slate-800/80 px-4">
                <span className="text-[10px] text-slate-500 font-mono block mb-1">WHY IT MATTERS</span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Unused EC2 VM instances on AWS and dormant Notion seat tiers represent ${Math.round(stats.potentialSavings / 12).toLocaleString()} in redundant monthly fees.
                </p>
              </div>
              <div className="md:border-r border-slate-800/80 px-4">
                <span className="text-[10px] text-slate-500 font-mono block mb-1">BIGGEST RECOVERY PATHWAY</span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Deprovisioning 120 dormant Notion Enterprise seats and downsizing idle AWS EC2 servers represent immediate actionable savings.
                </p>
              </div>
              <div className="pl-4 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-mono block mb-1">RECOMMENDED ACTION</span>
                  <p className="text-xs font-bold text-white leading-relaxed">
                    Audit active software renewals before cancellation notice windows lock.
                  </p>
                </div>
                <button 
                  onClick={() => setActiveTab('savings-opportunities')}
                  className="mt-3 text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1.5"
                >
                  <span>Execute Cost Optimizations</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Level 2 Section: Cost Health and Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Cost Health Breakdown (7 columns) */}
            <div className="lg:col-span-7 bg-slate-900/10 border border-slate-900 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-bold text-white">System Cost Health Scores</h3>
                  <p className="text-xs text-slate-500">Continuous structural auditing rating metrics</p>
                </div>
                <Info className="w-4 h-4 text-slate-600" />
              </div>

              <div className="space-y-6">
                {healthScores.map((h) => (
                  <div key={h.id} className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <span className="font-semibold text-slate-200 block">{h.title}</span>
                        <span className="text-[11px] text-slate-500">{h.desc}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`font-mono font-bold text-sm ${h.color}`}>{h.score}/100</span>
                        <button 
                          onClick={() => setActiveHealthWhy(activeHealthWhy === h.id ? null : h.id)}
                          className="text-[10px] text-slate-500 hover:text-slate-300 font-mono underline"
                        >
                          Why?
                        </button>
                      </div>
                    </div>

                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                      <div className={`h-full ${h.barColor} rounded-full transition-all duration-500`} style={{ width: `${h.score}%` }}></div>
                    </div>

                    {activeHealthWhy === h.id && (
                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-900 text-xs text-slate-400 leading-relaxed mt-2 animate-fadeIn">
                        {h.why}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Expenditure by Category (5 columns) */}
            <div className="lg:col-span-5 bg-slate-900/10 border border-slate-900 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white">Category Allocations</h3>
                  <p className="text-xs text-slate-500">Gross operational outlays aggregated by tag</p>
                </div>
                <span className="text-xs font-mono font-semibold text-cyan-400">
                  {categorySpend.length} Sectors
                </span>
              </div>

              {totalCatSpend === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No categories mapped</p>
              ) : (
                <div className="space-y-4">
                  {categorySpend.slice(0, 5).map((cat, idx) => {
                    const percent = Math.round((cat.amount / totalCatSpend) * 100);
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-slate-300">{cat.name}</span>
                          <span className="font-mono text-slate-400">{formatCurrency(cat.amount)} ({percent}%)</span>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-cyan-500/80 h-full rounded-full" 
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Level 3: Spending Trend Visualization & Key Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Elegant SVG Chart (8 columns) */}
            <div className="lg:col-span-8 bg-slate-900/10 border border-slate-900 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-bold text-white">Consolidated Spending Trend</h3>
                  <p className="text-xs text-slate-500">Historical run-rate vs optimal target projection</p>
                </div>
                
                <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-900 rounded-lg">
                  {(['30', '90', '180', '365'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setTimeFilter(filter)}
                      className={`px-2.5 py-1 text-[10px] font-semibold font-mono rounded transition-colors ${
                        timeFilter === filter 
                          ? 'bg-slate-900 text-cyan-400 border border-slate-800' 
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {filter}D
                    </button>
                  ))}
                </div>
              </div>

              {/* Elegant Inline SVG Chart */}
              <div className="w-full h-64 relative">
                <svg className="w-full h-full text-slate-700" viewBox="0 0 800 240">
                  {/* Grid Lines */}
                  <line x1="50" y1="30" x2="750" y2="30" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="50" y1="90" x2="750" y2="90" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="50" y1="150" x2="750" y2="150" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="50" y1="210" x2="750" y2="210" stroke="#1e293b" strokeWidth="1" />

                  {/* Chart lines/coordinates - Mock curve based on totalSpend */}
                  {/* Baseline expenditure curve (top) */}
                  <path 
                    d="M 50,110 L 166,130 L 283,105 L 400,120 L 516,95 L 633,100 L 750,85" 
                    fill="none" 
                    stroke="rgba(244, 63, 94, 0.6)" 
                    strokeWidth="2.5" 
                    strokeDasharray="4 2"
                  />
                  {/* Current run rate curves (Solid neon-cyan line with high visibility) */}
                  <path 
                    d="M 50,130 L 166,145 L 283,120 L 400,135 L 516,110 L 633,125 L 750,115" 
                    fill="none" 
                    stroke="#06b6d4" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                    className="drop-shadow-[0_2px_8px_rgba(6,182,212,0.5)]"
                  />
                  {/* Optimised projection curves (Bright neon-green line) */}
                  <path 
                    d="M 50,130 L 166,145 L 283,120 L 400,135 L 516,90 L 633,80 L 750,60" 
                    fill="none" 
                    stroke="#10b981" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                    strokeDasharray="3 3"
                    className="drop-shadow-[0_2px_8px_rgba(16,185,129,0.3)]"
                  />

                  {/* Intercept Highlight Dot */}
                  <circle cx="516" cy="110" r="6" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="750" cy="115" r="6" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="750" cy="60" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />

                  {/* Axis labels */}
                  <text x="50" y="230" fill="#64748b" fontSize="10" fontFamily="monospace">Jul 2026</text>
                  <text x="166" y="230" fill="#64748b" fontSize="10" fontFamily="monospace">Aug 2026</text>
                  <text x="283" y="230" fill="#64748b" fontSize="10" fontFamily="monospace">Sep 2026</text>
                  <text x="400" y="230" fill="#64748b" fontSize="10" fontFamily="monospace">Oct 2026</text>
                  <text x="516" y="230" fill="#64748b" fontSize="10" fontFamily="monospace">Nov 2026 (Fc)</text>
                  <text x="633" y="230" fill="#64748b" fontSize="10" fontFamily="monospace">Dec 2026 (Fc)</text>
                  <text x="750" y="230" fill="#64748b" fontSize="10" fontFamily="monospace">Jan 2027 (Fc)</text>

                  {/* Spend values */}
                  <text x="25" y="35" fill="#475569" fontSize="10" fontFamily="monospace">150K</text>
                  <text x="25" y="95" fill="#475569" fontSize="10" fontFamily="monospace">100K</text>
                  <text x="25" y="155" fill="#475569" fontSize="10" fontFamily="monospace">50K</text>
                  <text x="25" y="215" fill="#475569" fontSize="10" fontFamily="monospace">0</text>
                </svg>

                {/* Custom absolute legends */}
                <div className="absolute bottom-6 right-6 flex items-center gap-4 text-[10px] font-mono text-slate-400 bg-slate-950/90 border border-slate-900 rounded-lg p-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-1 bg-cyan-400 rounded"></div>
                    <span>Current Outlays ({formatCurrency(stats.totalSpend)})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-1 bg-emerald-500 rounded border-dashed border"></div>
                    <span>Optimized Trend ({formatCurrency(stats.totalSpend - (stats.potentialSavings / 12))})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actionable Recommendations (4 columns) */}
            <div className="lg:col-span-4 bg-slate-900/10 border border-slate-900 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white mb-4">Highest Saving Opportunities</h3>
                
                <div className="space-y-4">
                  {opportunities.slice(0, 3).map((op, idx) => (
                    <div key={idx} className="bg-slate-950/50 border border-slate-900 p-3 rounded-xl flex items-start gap-3">
                      <div className="p-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 text-xs shrink-0 mt-0.5 font-mono">
                        #{idx + 1}
                      </div>
                      <div className="truncate">
                        <span className="text-xs font-semibold text-white block truncate">{op.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono block">EST. ANNUAL OPTIMIZATION:</span>
                        <span className="text-xs font-bold text-emerald-400 font-mono">{formatCurrency(op.estimatedSavings)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setActiveTab('savings-opportunities')}
                className="w-full mt-6 py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-850 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Manage Opportunities</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </>
      )}

    </div>
  );
}
