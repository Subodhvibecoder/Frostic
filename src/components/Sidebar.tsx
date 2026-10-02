/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Snowflake, 
  Activity, 
  DollarSign, 
  TrendingUp, 
  RefreshCw, 
  FileText, 
  Database, 
  Zap, 
  Sliders, 
  Copy, 
  BarChart2, 
  Calendar, 
  Map, 
  Sparkles, 
  AlertTriangle, 
  Users, 
  Key, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  User,
  Info,
  Layers,
  Clock
} from 'lucide-react';
import { UserProfile, CompanyProfile, CurrencyConfig } from '../data';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
  company: CompanyProfile;
  currency: CurrencyConfig;
  setCurrency: (c: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (c: boolean) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  user,
  company,
  currency,
  setCurrency,
  isCollapsed,
  setIsCollapsed
}: SidebarProps) {
  
  const groups = [
    {
      title: 'Overview',
      items: [
        { id: 'command-center', label: 'Command Center', icon: Activity },
        { id: 'capability-index', label: 'Feature Index', icon: Layers },
      ]
    },
    {
      title: 'Spend Intelligence',
      items: [
        { id: 'all-expenses', label: 'All Expenses', icon: DollarSign },
        { id: 'subscriptions', label: 'Subscriptions', icon: RefreshCw },
        { id: 'vendors', label: 'Vendors', icon: Users },
        { id: 'invoices', label: 'Invoices', icon: FileText },
        { id: 'cloud-costs', label: 'Cloud Costs', icon: Database },
      ]
    },
    {
      title: 'Optimization',
      items: [
        { id: 'savings-opportunities', label: 'Savings Opportunities', icon: Zap },
        { id: 'savings-simulator', label: 'Savings Simulator', icon: Sliders },
        { id: 'duplicate-detector', label: 'Duplicate Detector', icon: Copy },
      ]
    },
    {
      title: 'Planning',
      items: [
        { id: 'forecasts', label: 'Forecasts', icon: TrendingUp },
        { id: 'scenario-lab', label: 'Scenario Lab', icon: Layers },
        { id: 'budgets', label: 'Budgets', icon: BarChart2 },
        { id: 'renewals', label: 'Renewals & Calendar', icon: Calendar },
      ]
    },
    {
      title: 'Intelligence',
      items: [
        { id: 'anomalies', label: 'Anomalies & Risks', icon: AlertTriangle },
        { id: 'ai-copilot', label: 'AI Copilot Hub', icon: Zap },
        { id: 'gemini-playground', label: 'Gemini Playground', icon: Sparkles },
      ]
    },
    {
      title: 'Execution',
      items: [
        { id: 'savings-recovery', label: 'Savings Recovery', icon: Clock },
      ]
    },
    {
      title: 'Administration',
      items: [
        { id: 'team', label: 'Team Setup', icon: Users },
        { id: 'integrations', label: 'Integration Hub', icon: Key },
        { id: 'settings', label: 'System Settings', icon: Settings },
        { id: 'about', label: 'About Frostic', icon: Info },
      ]
    }
  ];

  return (
    <div 
      className={`bg-slate-950 border-r border-slate-900/60 h-screen flex flex-col justify-between transition-all duration-300 relative shrink-0 z-20 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Collapse button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-6 -right-3 w-6 h-6 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Top logo & organization */}
      <div className="p-4 border-b border-slate-900/60">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-cyan-400 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/10">
            <Snowflake className="w-5 h-5 text-cyan-400 animate-spin-slow" />
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <span className="text-lg font-extrabold text-white tracking-tight">Frostic</span>
              <span className="text-[9px] text-cyan-400 font-mono block tracking-wider uppercase truncate max-w-[140px] font-semibold">{company.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Nav Menu list */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin">
        {groups.map((grp, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!isCollapsed && (
              <span className="text-[9px] text-slate-500 font-mono tracking-wider uppercase px-3 block mb-1">
                {grp.title}
              </span>
            )}
            {grp.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                    isActive 
                      ? 'bg-cyan-950/40 text-cyan-400 border-l-2 border-cyan-400 pl-2.5' 
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/30'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Currency Selector & Quick profile info at the bottom */}
      <div className="p-4 border-t border-slate-900/60 bg-slate-950/80 space-y-3">
        {!isCollapsed && (
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-medium text-[10px] font-mono">WORKSPACE CURRENCY:</span>
            <select 
              value={currency.code}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-slate-900 text-cyan-400 font-mono text-[11px] border border-slate-800 rounded px-1.5 py-0.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="NPR">NPR (₨)</option>
              <option value="INR">INR (₹)</option>
              <option value="AUD">AUD (A$)</option>
              <option value="CAD">CAD (C$)</option>
            </select>
          </div>
        )}

        <div className="flex items-center gap-3 overflow-hidden bg-slate-900/20 p-1 rounded-lg border border-slate-900/40">
          <img 
            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop'} 
            alt="Profile Avatar" 
            className="w-8 h-8 rounded-full border border-slate-800 object-cover shrink-0"
            onError={(e) => {
              // Fallback if image fails
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&auto=format&fit=crop';
            }}
          />
          {!isCollapsed && (
            <div className="truncate">
              <span className="text-xs font-semibold text-slate-200 block truncate">{user.name}</span>
              <span className="text-[10px] text-slate-400 truncate block">{user.role}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
