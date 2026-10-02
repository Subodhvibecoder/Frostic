/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, ArrowRight, ShieldAlert, Cpu } from 'lucide-react';
import { Expense, Subscription, SavingsOpportunity, CurrencyConfig } from '../data';

interface AICopilotProps {
  expenses: Expense[];
  subscriptions: Subscription[];
  opportunities: SavingsOpportunity[];
  currency: CurrencyConfig;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export default function AICopilot({
  expenses,
  subscriptions,
  opportunities,
  currency
}: AICopilotProps) {
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: "Hello! I am Frostic Cognitive Assistant. I have fully indexed your operating expenses, cloud compute layers, and renewal dates. Ask me a question or choose from the executive suggestions below to analyze cost-reduction plans.",
      timestamp: 'Just now'
    }
  ]);
  const [inputVal, setInputVal] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const formatCurrency = (val: number) => {
    const adjusted = val * currency.rate;
    return `${currency.symbol}${adjusted.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  const SUGGESTIONS = [
    { label: 'Find biggest savings opportunity', query: 'What is our single largest immediate savings opportunity?' },
    { label: 'Explain monthly spending changes', query: 'Summarize our current software and cloud infrastructure spend.' },
    { label: 'Identify high-exposure renewals', query: 'Which contracts or renewals carry the highest financial risk?' },
    { label: 'Simulate a 15% cost reduction', query: 'Give me a specific roadmap to reduce operating costs by 15%.' }
  ];

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Simulate AI thinking and building custom contextual answers
    setTimeout(() => {
      let aiText = '';
      const lowercaseQuery = text.toLowerCase();

      if (lowercaseQuery.includes('savings') || lowercaseQuery.includes('opportunity')) {
        const sortedOps = [...opportunities].sort((a, b) => b.estimatedSavings - a.estimatedSavings);
        if (sortedOps.length > 0) {
          const topOp = sortedOps[0];
          aiText = `Based on current operational audits, your largest immediate cost-reduction pathway is **${topOp.title}** under **${topOp.vendor}**.\n\n* **Estimated Annual Savings**: ${formatCurrency(topOp.estimatedSavings)}\n* **Confidence Score**: ${topOp.confidence}%\n* **Evidence**: ${topOp.evidence}\n* **Action Item**: ${topOp.recommendation}`;
        } else {
          aiText = "Spend ledger is currently empty. Please load the default dataset or add custom expenses to enable automated opportunity audits.";
        }
      } else if (lowercaseQuery.includes('spending') || lowercaseQuery.includes('changes') || lowercaseQuery.includes('summarize')) {
        const total = expenses.reduce((sum, curr) => sum + curr.amount, 0);
        const flagged = expenses.filter(e => e.status === 'Flagged');
        aiText = `Your current monthly spend run-rate is **${formatCurrency(total)}** (${formatCurrency(total * 12)} annualized).\n\nHere is the department breakdown:\n` +
          Array.from(new Set(expenses.map(e => e.department))).map(dept => {
            const amt = expenses.filter(e => e.department === dept).reduce((sum, curr) => sum + curr.amount, 0);
            return `* **${dept}**: ${formatCurrency(amt)}`;
          }).join('\n') + 
          (flagged.length > 0 ? `\n\n⚠️ **Flagged Anomalies**: We detected ${flagged.length} transactions with high billing anomalies, including ${flagged.map(f => f.vendor).join(', ')}.` : '');
      } else if (lowercaseQuery.includes('renew') || lowercaseQuery.includes('risk')) {
        const sortedSubs = [...subscriptions].sort((a, b) => b.riskScore - a.riskScore);
        if (sortedSubs.length > 0) {
          const topSub = sortedSubs[0];
          aiText = `We detected critical exposure on the upcoming **${topSub.vendor}** renewal (${topSub.renewalDate}).\n\n* **Risk Rating**: ${topSub.riskScore}/100\n* **Key Finding**: ${topSub.description}\n* **Underutilization**: Active seats at only ${topSub.activeSeats} of ${topSub.seats} (${topSub.utilization}%).\n* **Frostic Recommendation**: ${topSub.recommendation} the contract to eliminate calculated leakage before the notice period closes.`;
        } else {
          aiText = "All active software subscriptions are healthy. No upcoming renewals are currently at risk.";
        }
      } else if (lowercaseQuery.includes('15') || lowercaseQuery.includes('roadmap')) {
        const total = expenses.reduce((sum, curr) => sum + curr.amount, 0);
        const targetSavings = total * 12 * 0.15;
        aiText = `### Frostic 15% Cost-Reduction Blueprint\nTo recover **${formatCurrency(targetSavings)}** in annualized expenditure, execute this structured roadmap:\n\n1. **Deprovision Dormant Software Licenses**: Downgrade unutilized seats under Notion and Figma teams immediately. (Est: $28,000/yr)\n2. **Consolidate Double-Billing Overlaps**: Terminate Miro premium workspaces and move active boards to Figma Jam. (Est: $17,400/yr)\n3. **De-provision Idle Compute Instances**: Downsize non-production AWS EC2 development instances to t3.large. (Est: $38,400/yr)`;
      } else {
        aiText = `I analyzed your queries against your corporate spend profiles. Your workspace encompasses **${expenses.length} active expenses**, **${subscriptions.length} recurring subscriptions**, and **${opportunities.length} identified saving targets**.\n\nPlease ask me to:\n* Explain our biggest savings opportunities\n* Map upcoming subscription renewals\n* Detect billing anomalies and price hikes\n* Simulate cost reduction roadmaps`;
      }

      const aiMsg: Message = {
        id: `a-${Date.now()}`,
        sender: 'ai',
        text: aiText,
        timestamp: 'Just now'
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="bg-slate-900/10 border border-slate-900 rounded-2xl h-[calc(100vh-120px)] flex flex-col justify-between overflow-hidden relative">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-900 bg-slate-950/40 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/30 border border-cyan-500/25 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">Frostic Cognitive Assistant</h3>
            <span className="text-[9px] text-emerald-400 font-mono tracking-wider block uppercase">SYSTEM INDEX STATUS: SYNCED_ONLINE</span>
          </div>
        </div>
        <Cpu className="w-4 h-4 text-slate-600 animate-pulse" />
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
            
            <div className={`w-8 h-8 rounded-full border shrink-0 flex items-center justify-center ${
              msg.sender === 'user' ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-cyan-950/40 border-cyan-500/25 text-cyan-400'
            }`}>
              {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div className={`space-y-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap border ${
                msg.sender === 'user' 
                  ? 'bg-cyan-950/15 border-cyan-500/20 text-slate-200 rounded-tr-none' 
                  : 'bg-slate-950 border-slate-900 text-slate-300 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
              <span className="text-[9px] text-slate-500 font-mono block px-1">{msg.timestamp}</span>
            </div>

          </div>
        ))}

        {isTyping && (
          <div className="flex gap-4 max-w-[80%]">
            <div className="w-8 h-8 rounded-full bg-cyan-950/40 border border-cyan-500/25 text-cyan-400 flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-slate-950 border border-slate-900 p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested Chips (Only shows if there's only 1 initial message or on neutral screens) */}
      <div className="p-4 border-t border-slate-900 bg-slate-950/20 space-y-3 shrink-0">
        <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block px-1">Suggested Inquiries</span>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((sug) => (
            <button
              key={sug.label}
              onClick={() => handleSendMessage(sug.query)}
              className="px-3 py-1.5 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-cyan-400 border border-slate-900 hover:border-cyan-500/25 rounded-xl text-[10px] font-semibold transition-all"
            >
              {sug.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="flex gap-2 pt-2">
          <input 
            type="text" 
            placeholder="Query expenses, renewals, anomalies, or cloud optimization templates..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputVal)}
            className="flex-1 bg-slate-950 border border-slate-900 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button 
            onClick={() => handleSendMessage(inputVal)}
            className="p-2.5 bg-cyan-500 hover:bg-cyan-600 rounded-xl text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
