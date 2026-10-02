/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, HelpCircle, ArrowRight, Cpu, Key, AlertCircle, Info, Zap } from 'lucide-react';
import { 
  CurrencyConfig, 
  Expense, 
  Subscription, 
  SavingsOpportunity, 
  Budget, 
  CompanyProfile 
} from '../data';

interface GeminiPlaygroundProps {
  currency: CurrencyConfig;
  expenses: Expense[];
  subscriptions: Subscription[];
  opportunities: SavingsOpportunity[];
  budgets: Budget[];
  company: CompanyProfile;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  isLocal: boolean;
  time: string;
}

export default function GeminiPlayground({ 
  currency,
  expenses,
  subscriptions,
  opportunities,
  budgets,
  company
}: GeminiPlaygroundProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('frostic_gemini_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved messages", e);
      }
    }
    return [
      {
        id: 'g-init',
        sender: 'gemini',
        text: "Welcome to **Frostic Gemini Playground**! Ask me any question of your choice—from complex financial strategy modeling, procurement negotiations, and software audit checklists, to general knowledge, coding, or analytics.",
        isLocal: false,
        time: 'Just now'
      }
    ];
  });
  const [input, setInput] = useState<string>('');
  const [systemPrompt, setSystemInstruction] = useState<string>("You are Frostic Gemini, an elite personal and enterprise intelligence AI companion. You have full context of the active company finance databases, but you are completely unrestricted and eager to answer ANY general knowledge, math, science, creative writing, programming, or conversational query requested by the user, regardless of whether it is business-related.");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiKeyMissing, setApiKeyMissing] = useState<boolean>(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('frostic_gemini_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const STARTER_PROMPTS = [
    { label: "Draft a vendor contract renegotiation letter", prompt: "Draft a highly professional, polite but firm contract renegotiation letter to a software provider requesting a 15% discount based on long-term commitment." },
    { label: "Explain cloud server autoscaling mechanics", prompt: "Explain how AWS auto-scaling groups and RDS database storage tiering can decrease monthly running costs without creating service latency." },
    { label: "Outline a corporate SaaS audit checklist", prompt: "Outline a complete step-by-step corporate SaaS license audit checklist for an IT team to run over a weekend." },
    { label: "Write a python script to parse CSV expenses", prompt: "Write a python script using pandas to parse a CSV of expenses, aggregate totals by category, and list items with cost > $5,000." }
  ];

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      isLocal: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          systemInstruction: systemPrompt,
          context: {
            company,
            expenses,
            subscriptions,
            opportunities,
            budgets
          }
        })
      });

      const data = await response.json();

      if (data.error === "API_KEY_MISSING") {
        setApiKeyMissing(true);
        // Trigger a highly smart local fallback response so the user gets an instant premium answer!
        setTimeout(() => {
          let fallbackText = "";
          const q = text.toLowerCase();

          if (q.includes('letter') || q.includes('renegotiat') || q.includes('draft')) {
            fallbackText = `### Corporate Vendor Renegotiation Blueprint\n\nHere is a premium drafted letter template customized for your operations:\n\n\`\`\`text\nSubject: Partner Engagement & Annual Subscription Review\n\nDear Partner Engagement Team,\n\nAs we approach our upcoming subscription renewal cycle, we are conducting a comprehensive audit of our technical tools and software dependencies across all business branches.\n\nWe value our collaboration and are eager to retain your product as a core element of our workspace. However, to align with our current operational budget directives, we are requesting a review of our pricing tiers. Specifically, we would like to explore options to secure a 15% rate adjustment in exchange for locking in a 12-month multi-year commitment or pre-paying our annual seat licenses.\n\nPlease let us know if we can schedule a brief 10-minute sync this week to explore optimal options.\n\nSincerely,\nLead Administrator\n\`\`\``;
          } else if (q.includes('cloud') || q.includes('aws') || q.includes('autoscaling') || q.includes('scaling')) {
            fallbackText = `### AWS & Cloud Cost-Optimization Blueprint\n\nDeploying cloud-native mechanisms can lower compute run-rates by up to 35%:\n\n1. **Auto-Scaling Groups (ASGs)**: Automatically match EC2 server nodes with actual user request traffic. Downsize node pools to 1 instance during off-peak hours (e.g. 10 PM to 6 AM).\n2. **RDS Storage Autoscaling**: Start with conservative database allocations (e.g., 20GB) and let AWS dynamically scale up disk volumes as memory bounds are crossed, avoiding unutilized provisioned SSD overhead.\n3. **Spot Instance Classes**: Utilize Spot instances for development queues, offering discounts up to 90% compared to typical On-Demand pricing maps.`;
          } else if (q.includes('checklist') || q.includes('audit')) {
            fallbackText = `### IT SaaS Licensing Audit Checklist\n\n* **Phase 1: Discovery**\n  * Extract single-sign-on (SSO) login logs across Google Workspace and Okta channels.\n  * Map duplicate software tools across separate department budgets.\n* **Phase 2: Utilization Mapping**\n  * Audit dormant accounts (no login within 30 days).\n  * Audit unassigned licenses inside administrative dashboards.\n* **Phase 3: Cleanup**\n  * Downgrade unused premium seats to free/standard plans.\n  * Consolidate duplicate vendors (e.g. migrate Zoom/Miro to Google Meet/Figma).`;
          } else if (q.includes('python') || q.includes('script') || q.includes('csv')) {
            fallbackText = `### Python Expense-Ledger Parser Script\n\n\`\`\`python\nimport pandas as pd\n\ndef parse_expenses(filepath):\n    # Load spending ledger\n    df = pd.read_csv(filepath)\n    \n    # Group spending by category\n    totals = df.groupby('category')['amount'].sum().reset_index()\n    print("--- CATEGORY ALLOCATIONS ---")\n    print(totals.to_string(index=False))\n    \n    # Flag high value items\n    outliers = df[df['amount'] > 5000]\n    print("\\n--- HIGH VALUE OUTLIERS (> $5,000) ---")\n    print(outliers[['vendor', 'amount', 'category']])\n\n# Run parser\nparse_expenses('expenses.csv')\n\`\`\``;
          } else {
            fallbackText = `### Frostic AI Cognitive Response\n\nThank you for asking: "${text}"\n\nSince this workspace is running in local preview mode with no cloud API keys initialized, I have answered using Frostic's local cost intelligence libraries. To fetch real-time global information, connect your live model key.\n\n* **Key Recommendation**: Review your active **Savings Opportunities** to identify direct balance-sheet recovery vectors.\n* **Suggested Query**: Try asking me to "Draft a vendor contract renegotiation letter" or "Outline a corporate SaaS audit checklist" for a high-integrity custom demonstration template!`;
          }

          const fallbackMsg: ChatMessage = {
            id: `g-${Date.now()}`,
            sender: 'gemini',
            text: fallbackText,
            isLocal: true,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };

          setMessages(prev => [...prev, fallbackMsg]);
          setIsLoading(false);
        }, 800);
      } else if (data.text) {
        const geminiMsg: ChatMessage = {
          id: `g-${Date.now()}`,
          sender: 'gemini',
          text: data.text,
          isLocal: false,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, geminiMsg]);
        setIsLoading(false);
      } else {
        throw new Error(data.error || "No response received");
      }
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `g-err-${Date.now()}`,
        sender: 'gemini',
        text: `⚠️ **Connection Failure**: Failed to transmit request to server endpoint. Details: ${err.message || 'Unknown network error'}.`,
        isLocal: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/10 border border-slate-900 rounded-2xl h-[calc(100vh-120px)] flex flex-col justify-between overflow-hidden relative animate-fadeIn">
      {/* Light highlights */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Playgound Header */}
      <div className="p-4 border-b border-slate-900 bg-slate-950/40 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/40 border border-cyan-400/30 flex items-center justify-center shrink-0">
            <Bot className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">Frostic Gemini Playground</h3>
            <span className="text-[9px] text-cyan-400 font-mono tracking-wider block uppercase">POWERED BY GEMINI-3.8-FLASH // SECURE SESSION</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {apiKeyMissing ? (
            <div className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[10px] text-amber-400 font-mono flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              <span>LOCAL FALLBACK ENGINE ACTIVE</span>
            </div>
          ) : (
            <div className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5" />
              <span>LIVE CLOUD API INTEGRATION</span>
            </div>
          )}
        </div>
      </div>

      {/* Main chat history list */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
        {apiKeyMissing && (
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 leading-relaxed max-w-2xl mx-auto flex gap-3">
            <Key className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block mb-1">Missing GEMINI_API_KEY Secrets</span>
              <span>We detected that no live API key is provisioned in your Workspace Secrets. Frostic has smoothly switched to a high-fidelity local response engine. Add your key in the Secrets panel to activate live cloud intelligence.</span>
            </div>
          </div>
        )}

        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full border shrink-0 flex items-center justify-center ${
                msg.sender === 'user' ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-cyan-950/40 border-cyan-400/20 text-cyan-400'
              }`}>
                {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div className="space-y-1">
                <div className={`p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap border ${
                  msg.sender === 'user' 
                    ? 'bg-cyan-950/15 border-cyan-500/20 text-slate-200 rounded-tr-none' 
                    : 'bg-slate-950 border-slate-900 text-slate-300 rounded-tl-none markdown-container'
                }`}>
                  {msg.text}
                </div>
                <div className="flex justify-between items-center px-1">
                  <span className="text-[9px] text-slate-500 font-mono">{msg.time}</span>
                  {msg.isLocal && (
                    <span className="text-[9px] text-cyan-500 font-mono uppercase font-semibold">Frostic Local Response</span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-cyan-950/40 border border-cyan-400/20 text-cyan-400 flex items-center justify-center shrink-0">
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
      </div>

      {/* Suggested prompts & Chat input area */}
      <div className="p-4 border-t border-slate-900 bg-slate-950/20 space-y-4 shrink-0">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>Select Starter Prompt Blueprint</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {STARTER_PROMPTS.map((starter) => (
              <button
                key={starter.label}
                onClick={() => handleSend(starter.prompt)}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-cyan-500/25 text-left text-[11px] text-slate-400 hover:text-cyan-400 font-medium transition-all"
              >
                {starter.label}
              </button>
            ))}
          </div>

          {/* System Instructions adjust settings (collapsible / advanced toggle) */}
          <div className="flex items-center gap-3 bg-slate-950/50 p-2 border border-slate-900 rounded-xl">
            <span className="text-[10px] text-slate-500 font-mono shrink-0">AI SYSTEM INSTRUCTION:</span>
            <input 
              type="text" 
              value={systemPrompt}
              onChange={(e) => setSystemInstruction(e.target.value)}
              className="flex-1 bg-transparent text-[11px] text-slate-300 focus:outline-none focus:border-b focus:border-cyan-500"
            />
          </div>

          {/* Input textfield */}
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Ask anything you want... Just like in Google Gemini!"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              className="flex-1 bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow-inner"
            />
            <button 
              onClick={() => handleSend(input)}
              className="px-5 bg-cyan-500 hover:bg-cyan-600 rounded-xl text-white font-semibold transition-colors flex items-center gap-1.5"
            >
              <span>Query</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
