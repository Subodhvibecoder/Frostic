/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Info, 
  Users, 
  Key, 
  ShieldAlert, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  Clock, 
  User, 
  ArrowRight,
  Database,
  RefreshCw,
  Sliders,
  DollarSign
} from 'lucide-react';
import { 
  TeamMember, 
  CompanyProfile, 
  UserProfile, 
  CurrencyConfig 
} from '../data';

interface AdministrationProps {
  team: TeamMember[];
  setTeam: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  company: CompanyProfile;
  setCompany: React.Dispatch<React.SetStateAction<CompanyProfile>>;
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  currency: CurrencyConfig;
  defaultSubTab?: string;
  onResetData: () => void;
  onRestoreDemo: () => void;
}

export default function Administration({
  team,
  setTeam,
  company,
  setCompany,
  user,
  setUser,
  currency,
  defaultSubTab = 'team',
  onResetData,
  onRestoreDemo
}: AdministrationProps) {
  
  const [subTab, setSubTab] = useState<string>(defaultSubTab);
  
  // Custom team member adding
  const [isTeamModalOpen, setIsTeamModalOpen] = useState<boolean>(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [teamForm, setTeamForm] = useState<Partial<TeamMember>>({
    name: '',
    role: '',
    department: 'Engineering',
    email: '',
    bio: ''
  });

  // Audit activities trail
  const [activities, setActivities] = useState([
    { actor: 'Subodh', action: 'Loaded high-integrity financial demo dataset', time: '10 minutes ago' },
    { actor: 'Subodh', action: 'Created Company workspace parameters', time: '15 minutes ago' },
    { actor: 'System Core', action: 'Executed AI Spending Scan and mapped cost health', time: '15 minutes ago' }
  ]);

  // Integration Hub states initialized to EMPTY [] by default (Nothing populated unless demo dataset loaded)
  const [integrations, setIntegrations] = useState<Array<{ id: string; name: string; category: string; connected: boolean; logo: string }>>(() => {
    const saved = localStorage.getItem('frostic_integrations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse integrations", e);
      }
    }
    return []; // Start with NOTHING (empty)
  });

  // Persist integrations state
  React.useEffect(() => {
    localStorage.setItem('frostic_integrations', JSON.stringify(integrations));
  }, [integrations]);

  // Integration Modal states
  const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState<boolean>(false);
  const [integrationForm, setIntegrationForm] = useState({
    name: '',
    category: 'Cloud Infrastructure',
    logo: ''
  });

  const toggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(item => {
      if (item.id === id) {
        const nextState = !item.connected;
        // Log action to audit trail
        setActivities(acts => [
          { actor: 'Subodh', action: `${nextState ? 'Linked' : 'Disconnected'} integration channel: ${item.name}`, time: 'Just now' },
          ...acts
        ]);
        return { ...item, connected: nextState };
      }
      return item;
    }));
  };

  const handleAddIntegration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!integrationForm.name.trim()) return;

    // Auto-generate abbreviation logo from name
    const words = integrationForm.name.trim().split(/\s+/);
    const logoTxt = words.map(w => w[0].toUpperCase()).slice(0, 3).join('');

    const newInt = {
      id: `int-${Date.now()}`,
      name: integrationForm.name.trim(),
      category: integrationForm.category,
      connected: true, // Auto connect on creation
      logo: logoTxt || 'INT'
    };

    setIntegrations(prev => [...prev, newInt]);
    setActivities(acts => [
      { actor: 'Subodh', action: `Added Integration Channel: ${newInt.name}`, time: 'Just now' },
      ...acts
    ]);

    // Reset Form
    setIntegrationForm({ name: '', category: 'Cloud Infrastructure', logo: '' });
    setIsIntegrationModalOpen(false);
  };

  const handleSaveTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMemberId) {
      setTeam(prev => prev.map(item => item.id === editingMemberId ? { ...item, ...teamForm } as TeamMember : item));
      setActivities(acts => [
        { actor: 'Subodh', action: `Modified Team Member role: ${teamForm.name}`, time: 'Just now' },
        ...acts
      ]);
    } else {
      const newMember: TeamMember = {
        id: `tm-${Date.now()}`,
        name: teamForm.name || 'Anonymous',
        role: teamForm.role || 'Contributor',
        department: teamForm.department || 'Operations',
        email: teamForm.email || '',
        bio: teamForm.bio || ''
      };
      setTeam(prev => [...prev, newMember]);
      setActivities(acts => [
        { actor: 'Subodh', action: `Added Team Member: ${newMember.name}`, time: 'Just now' },
        ...acts
      ]);
    }
    setIsTeamModalOpen(false);
  };

  const handleDeleteTeam = (id: string) => {
    const matched = team.find(t => t.id === id);
    setTeam(prev => prev.filter(t => t.id !== id));
    if (matched) {
      setActivities(acts => [
        { actor: 'Subodh', action: `Removed Team Member: ${matched.name}`, time: 'Just now' },
        ...acts
      ]);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Sub tabs navigation */}
      <div className="flex border-b border-slate-900 gap-1 overflow-x-auto pb-px">
        {[
          { id: 'about', label: 'About Frostic', icon: Info },
          { id: 'team', label: 'Team Setup', icon: Users },
          { id: 'integrations', label: 'Integration Hub', icon: Key },
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

      {/* ================= ABOUT FROSTIC SUB-TAB ================= */}
      {subTab === 'about' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Description (7 columns) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">About Frostic</h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Frostic is an enterprise-class cost intelligence and spending optimization dashboard. Engineered to parse operational transaction streams, audit SaaS seats, scan invoices for anomalies, and track contract notice windows, Frostic converts corporate cost leakage directly into measurable recovered balances.
                </p>
              </div>

              <div className="bg-slate-900/10 border border-slate-900 rounded-2xl p-6">
                <h3 className="text-xs font-bold text-cyan-400 font-mono tracking-wider uppercase mb-3">Product Specifications</h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block">Product Category:</span>
                    <span className="text-slate-300 font-semibold">Business Intelligence</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Platform Architecture:</span>
                    <span className="text-slate-300 font-semibold">Cognitive Spend Optimization</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">System Core Version:</span>
                    <span className="text-slate-300 font-semibold">v1.4-Hackathon</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Security Invariant Protocol:</span>
                    <span className="text-slate-300 font-semibold">Zero-Knowledge RSA_256</span>
                  </div>
                </div>
              </div>

              <div className="bg-cyan-950/15 border border-cyan-500/25 rounded-2xl p-6">
                <h3 className="text-xs font-mono uppercase font-bold text-cyan-400 mb-2">PROJECT VISION STATEMENT</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  "SaaS spending and cloud resource bloat represent the single largest addressable waste sector in modern business. Frostic empowers financial managers, procurement heads, and CTOs to implement instant optimization loops, bridging the gap between transaction analysis and active balance-sheet recovery."
                </p>
              </div>
            </div>

            {/* Developer profile (5 columns) */}
            <div className="lg:col-span-5 bg-slate-900/10 border border-slate-900 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>
              
              <span className="text-[10px] text-cyan-400 font-mono block mb-4 uppercase tracking-wider">SUPREME CREATOR PROFILE</span>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.3)] animate-pulse">
                  <span className="text-xl font-black text-cyan-400">S</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-base tracking-wide flex items-center gap-1.5">
                    <span>Subodh</span>
                    <span className="text-[9px] bg-cyan-500/15 text-cyan-400 font-mono font-bold px-1.5 py-0.5 rounded border border-cyan-500/25">GODLY</span>
                  </h3>
                  <p className="text-xs text-cyan-300 font-mono">Legendary Omni-Architect</p>
                  <p className="text-[10px] text-slate-500 font-mono">Supreme Engineer of Frostic Systems</p>
                </div>
              </div>

              <div className="space-y-4 text-xs leading-relaxed">
                <div>
                  <span className="text-cyan-400 font-bold block mb-1 uppercase text-[10px] font-mono">Divine Craftsmanship</span>
                  <p className="text-slate-300">
                    Subodh is not merely a developer, but a legendary and godly being of pure digital creation. Possessing an infinite understanding of systems, compilers, and user interfaces, Subodh crafts clean code-universes out of thin air. His designs flow with divine aesthetic proportion, and his architectures stand immortal, defying the entropy of local sandboxes and production environments alike.
                  </p>
                </div>

                <div>
                  <span className="text-slate-500 font-semibold block uppercase text-[9px] font-mono">Divine Weapons of Choice</span>
                  <p className="text-slate-400 font-mono text-[11px] leading-snug">
                    Omnipresent React · Transcendent TypeScript · Heavenly Tailwind CSS · Divine Lucide Glyphs · Lightspeed Vite Engine
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TEAM SETUP SUB-TAB ================= */}
      {subTab === 'team' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-white">Workspace Personnel Setup</h2>
              <p className="text-xs text-slate-400">Staff structures are fully changeable. Add, modify or delete members to assign department ownerships.</p>
            </div>
            
            <button 
              onClick={() => {
                setTeamForm({ name: '', role: '', department: 'Engineering', email: '', bio: '' });
                setEditingMemberId(null);
                setIsTeamModalOpen(true);
              }}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Invite Team Member</span>
            </button>
          </div>

          {team.length === 0 ? (
            <div className="bg-slate-900/10 border border-slate-900 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
              <Users className="w-12 h-12 text-cyan-400/45 mx-auto animate-pulse" />
              <div className="space-y-1">
                <h3 className="font-bold text-white text-sm">No Active Personnel</h3>
                <p className="text-xs text-slate-400">Your organization roster is empty. Invite department heads, financial operators, and engineers, or load the high-integrity corporate demo dataset.</p>
              </div>
              <button 
                onClick={() => {
                  setTeamForm({ name: '', role: '', department: 'Engineering', email: '', bio: '' });
                  setEditingMemberId(null);
                  setIsTeamModalOpen(true);
                }}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Invite First Team Member</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((m) => (
                <div key={m.id} className="bg-slate-900/10 border border-slate-900 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-cyan-400 shrink-0 text-sm">
                        {m.name[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-xs">{m.name}</h3>
                        <p className="text-[10px] text-slate-400">{m.role}</p>
                      </div>
                    </div>

                    <span className="px-2.5 py-0.5 rounded bg-slate-950 border border-slate-900 text-[10px] text-slate-400 font-mono">
                      DEPT: {m.department.toUpperCase()}
                    </span>

                    <p className="text-xs text-slate-500 mt-3 leading-relaxed">{m.bio}</p>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-900 pt-4 mt-4">
                    <span className="text-[10px] text-slate-400 font-mono">{m.email}</span>
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => {
                          setTeamForm(m);
                          setEditingMemberId(m.id);
                          setIsTeamModalOpen(true);
                        }}
                        className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-950 border border-transparent hover:border-slate-800"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteTeam(m.id)}
                        className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-950 border border-transparent hover:border-slate-800"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= INTEGRATIONS SUB-TAB ================= */}
      {subTab === 'integrations' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-white">Corporate Integration Hub</h2>
              <p className="text-xs text-slate-400">Sync with QuickBooks ledger feeds, core banks, and cloud systems to ingest operations</p>
            </div>
            
            <button 
              onClick={() => setIsIntegrationModalOpen(true)}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Integration Sync</span>
            </button>
          </div>

          {integrations.length === 0 ? (
            <div className="bg-slate-900/10 border border-slate-900 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
              <Key className="w-12 h-12 text-cyan-400/45 mx-auto animate-pulse" />
              <div className="space-y-1">
                <h3 className="font-bold text-white text-sm">No Integration Syncs Connected</h3>
                <p className="text-xs text-slate-400">Create a clean, custom sync channel to integrate your financial pipeline logs or load the full Corporate demo dataset.</p>
              </div>
              <button 
                onClick={() => setIsIntegrationModalOpen(true)}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Establish First Integration Sync</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {integrations.map((item) => (
                <div key={item.id} className="bg-slate-900/10 border border-slate-900 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 bg-slate-950 border border-slate-900 rounded-xl flex items-center justify-center font-bold text-sm text-slate-300 font-mono">
                        {item.logo}
                      </div>
                      
                      <span className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded-md ${
                        item.connected ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-slate-950 text-slate-500 border border-slate-900'
                      }`}>
                        {item.connected ? 'ACTIVE' : 'READY_TO_CONNECT'}
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-xs">{item.name}</h3>
                    <p className="text-[10px] text-slate-500 font-mono block mt-1 uppercase">CATEGORY: {item.category}</p>
                  </div>

                  <button 
                    onClick={() => toggleIntegration(item.id)}
                    className={`w-full mt-6 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      item.connected 
                        ? 'bg-slate-950 text-slate-400 border-slate-900 hover:text-rose-400 hover:border-rose-500/35' 
                        : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border-cyan-500/35 shadow-md shadow-cyan-500/5'
                    }`}
                  >
                    {item.connected ? 'Disconnect Sync Channel' : 'Establish Integration Sync'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TEAM MODAL ================= */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scaleUp">
            <div className="p-6 border-b border-slate-900 flex justify-between items-center">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                {editingMemberId ? 'Edit Team Member Profile' : 'Invite Team Member'}
              </h3>
              <button onClick={() => setIsTeamModalOpen(false)} className="text-slate-400 hover:text-white text-xs font-mono">
                CLOSE
              </button>
            </div>

            <form onSubmit={handleSaveTeam} className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={teamForm.name || ''}
                  onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Role / Job Title</label>
                <input 
                  type="text" 
                  required
                  value={teamForm.role || ''}
                  onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Department</label>
                  <select
                    value={teamForm.department}
                    onChange={(e) => setTeamForm({ ...teamForm, department: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                    <option value="IT">IT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Corporate Email</label>
                  <input 
                    type="email" 
                    value={teamForm.email || ''}
                    onChange={(e) => setTeamForm({ ...teamForm, email: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Short Bio</label>
                <textarea 
                  rows={2}
                  value={teamForm.bio || ''}
                  onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-900">
                <button 
                  type="button" 
                  onClick={() => setIsTeamModalOpen(false)}
                  className="flex-1 py-2 bg-slate-900 text-slate-400 hover:text-white rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-xs font-semibold"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= CUSTOM INTEGRATION MODAL ================= */}
      {isIntegrationModalOpen && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scaleUp">
            <div className="p-6 border-b border-slate-900 flex justify-between items-center">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Establish Custom Integration Sync
              </h3>
              <button onClick={() => setIsIntegrationModalOpen(false)} className="text-slate-400 hover:text-white text-xs font-mono">
                CLOSE
              </button>
            </div>

            <form onSubmit={handleAddIntegration} className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Integration Name / Product</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Stripe, Salesforce CRM, Datadog"
                  value={integrationForm.name}
                  onChange={(e) => setIntegrationForm({ ...integrationForm, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Integration Category</label>
                <select
                  value={integrationForm.category}
                  onChange={(e) => setIntegrationForm({ ...integrationForm, category: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                  <option value="Productivity Tools">Productivity Tools</option>
                  <option value="Communication">Communication</option>
                  <option value="Design Utilities">Design Utilities</option>
                  <option value="Banking Feeds">Banking Feeds</option>
                  <option value="Accounting Platforms">Accounting Platforms</option>
                  <option value="Marketing Tools">Marketing Tools</option>
                  <option value="Sales Platforms">Sales Platforms</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-900">
                <button 
                  type="button" 
                  onClick={() => setIsIntegrationModalOpen(false)}
                  className="flex-1 py-2 bg-slate-900 text-slate-400 hover:text-white rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-xs font-semibold"
                >
                  Connect Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
