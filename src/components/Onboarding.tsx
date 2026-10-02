/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Snowflake, Sparkles, ArrowRight, User, Briefcase, Target, DollarSign, Users, Check, AlertCircle } from 'lucide-react';
import { UserProfile, CompanyProfile, INITIAL_USER, INITIAL_COMPANY, INITIAL_OBJECTIVES } from '../data';

interface OnboardingProps {
  onComplete: (user: UserProfile, company: CompanyProfile, objectives: string[]) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<number>(0); // 0 = Welcome/Login, 1 = Personal, 2 = Company, 3 = Team, 4 = Objectives, 5 = Review
  const [password, setPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  
  // Forms states
  const [userForm, setUserForm] = useState<UserProfile>({ ...INITIAL_USER });
  const [companyForm, setCompanyForm] = useState<CompanyProfile>({ ...INITIAL_COMPANY });
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([...INITIAL_OBJECTIVES]);
  const [soloMode, setSoloMode] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<number>(0);

  const OBJECTIVE_OPTIONS = [
    { label: 'Reduce unnecessary spending', desc: 'Identify dormant or duplicate software tools' },
    { label: 'Find unused subscriptions', desc: 'De-provision seats for inactive accounts' },
    { label: 'Optimize cloud costs', desc: 'Downsize overprovisioned cloud infrastructure' },
    { label: 'Detect invoice anomalies', desc: 'Audit invoices for price hikes and double-billing' },
    { label: 'Track renewals', desc: 'Get ahead of cancellation windows to negotiate' },
    { label: 'Improve budgeting', desc: 'Align department spend allocations dynamically' },
    { label: 'Forecast future expenses', desc: 'Utilize predictive curves to predict cash flow' },
    { label: 'Monitor financial risks', desc: 'Track single-vendor concentrations and exposure' }
  ];

  const ANALYSIS_STEPS = [
    'Scanning current transaction streams...',
    'Analyzing software subscriptions and active licenses...',
    'Correlating multi-department vendor overlaps...',
    'Auditing historical invoices for price escalations...',
    'Detecting idle and overprovisioned cloud compute resources...',
    'Mapping contract expiration timelines and notice windows...',
    'Generating optimal spending recommendations...'
  ];

  const handleNextStep = () => {
    setStep(prev => prev + 1);
  };

  const handleTryNextStep = () => {
    if (step === 0) {
      if (password !== 'Subodh') {
        setPasswordError("Incorrect decryption key. Only authorized users possessing the creator's password ('Subodh') can enter the Frostic Workspace.");
        return;
      }
    }
    setPasswordError('');
    handleNextStep();
  };

  const handleBackStep = () => {
    setStep(prev => Math.max(0, prev - 1));
  };

  const handleObjectiveToggle = (obj: string) => {
    setSelectedObjectives(prev => 
      prev.includes(obj) ? prev.filter(item => item !== obj) : [...prev, obj]
    );
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisStep(0);
    
    const interval = setInterval(() => {
      setAnalysisStep(prev => {
        if (prev >= ANALYSIS_STEPS.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete(userForm, companyForm, selectedObjectives);
          }, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleTryStartAnalysis = () => {
    if (step === 0) {
      if (password !== 'Subodh') {
        setPasswordError("Incorrect decryption key. Only authorized users possessing the creator's password ('Subodh') can enter the Frostic Workspace.");
        return;
      }
    }
    setPasswordError('');
    startAnalysis();
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 relative overflow-hidden">
        {/* Abstract icy light effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-lg text-center z-10">
          <div className="inline-flex p-4 rounded-2xl bg-cyan-950/60 border border-cyan-400/50 mb-8 shadow-lg shadow-cyan-500/20 animate-pulse">
            <Snowflake className="w-12 h-12 text-cyan-400" />
          </div>
          
          <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Analyzing {companyForm.name}</h2>
          <p className="text-cyan-400 text-sm mb-12 font-medium">Frostic Cognitive Engine is auditing your business data model</p>
          
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 mb-8 text-left">
            <div className="space-y-4">
              {ANALYSIS_STEPS.map((stepText, idx) => {
                const isDone = idx < analysisStep;
                const isActive = idx === analysisStep;
                return (
                  <div key={idx} className={`flex items-center gap-3 transition-opacity duration-300 ${isDone ? 'opacity-100' : isActive ? 'opacity-100' : 'opacity-30'}`}>
                    {isDone ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-emerald-400" />
                      </div>
                    ) : isActive ? (
                      <div className="w-5 h-5 rounded-full border border-cyan-400/50 flex items-center justify-center shrink-0 animate-spin">
                        <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-slate-700 shrink-0"></div>
                    )}
                    <span className="text-sm font-medium text-slate-300">{stepText}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-1000 ease-out"
              style={{ width: `${((analysisStep + 1) / ANALYSIS_STEPS.length) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-500 font-mono">
            <span>ENGINE STATUS: ONBOARDING_SCAN</span>
            <span>{Math.round(((analysisStep + 1) / ANALYSIS_STEPS.length) * 100)}%</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between p-6 relative overflow-hidden font-sans">
      {/* Dynamic light sources */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Top row */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between z-10 py-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/10">
            <Snowflake className="w-5 h-5 text-cyan-400 animate-spin-slow" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white block">Frostic</span>
            <span className="text-[10px] text-cyan-400 font-mono tracking-wider uppercase font-semibold">Protect Every Dollar.</span>
          </div>
        </div>

        {step > 0 && step < 6 && (
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div 
                key={s} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s < step ? 'w-6 bg-emerald-500/80' : s === step ? 'w-10 bg-cyan-400' : 'w-2 bg-slate-800'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main Form container */}
      <div className="w-full max-w-4xl mx-auto my-auto z-10 py-12 flex flex-col items-center">
        
        {/* STEP 0: Landing / Login */}
        {step === 0 && (
          <div className="w-full text-center max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-400/30 text-xs text-cyan-400 mb-6 font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>Next-Gen Financial Operations Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-none mb-6">
              Stop Paying for <br className="hidden md:inline" />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 bg-clip-text text-transparent drop-shadow-sm">What You Don't Need.</span>
            </h1>
            
            <p className="text-slate-300 text-lg max-w-xl mx-auto mb-10 leading-relaxed font-medium">
              Frostic finds hidden waste, audits subscriptions, detects anomalies, predicts cost exposure, and converts financial leakage into recovered savings.
            </p>

            <div className="bg-slate-900/60 backdrop-blur-md border border-cyan-500/25 rounded-2xl p-8 mb-10 text-left max-w-lg mx-auto shadow-xl shadow-cyan-500/5">
              <h3 className="text-sm font-semibold text-white mb-4">Initialize Demo Workspace</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Business Owner / Lead Name</label>
                  <input 
                    type="text" 
                    value={userForm.name}
                    onChange={(e) => {
                      setUserForm({ ...userForm, name: e.target.value, preferredName: e.target.value });
                    }}
                    placeholder="Enter Owner Name"
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Company Name</label>
                  <input 
                    type="text" 
                    value={companyForm.name}
                    onChange={(e) => {
                      setCompanyForm({ ...companyForm, name: e.target.value });
                    }}
                    placeholder="Enter Company Name"
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5 font-medium">Team Configuration</label>
                    <select 
                      value={soloMode ? 'solo' : 'team'}
                      onChange={(e) => {
                        const isSolo = e.target.value === 'solo';
                        setSoloMode(isSolo);
                        setCompanyForm({
                          ...companyForm,
                          size: isSolo ? 'Solo / Founder' : '11–50',
                          totalTeamSize: isSolo ? 1 : 45
                        });
                      }}
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    >
                      <option value="team">Team / Organisation</option>
                      <option value="solo">Solo Operator</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5 font-medium">Industry</label>
                    <input 
                      type="text" 
                      value={companyForm.industry}
                      onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })}
                      placeholder="e.g. AI & Cloud Services"
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Secure Decryption Gateway Gated with password 'Subodh' */}
                <div className="border-t border-slate-800 pt-4 mt-4">
                  <label className="block text-[10px] text-cyan-400 mb-1.5 font-bold uppercase tracking-wider font-mono">WORKSPACE DECRYPTION PASSWORD</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError('');
                    }}
                    placeholder="Enter Creator's Signature Password"
                    className="w-full bg-slate-950 border border-cyan-500/30 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-700 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                  />
                  {passwordError ? (
                    <p className="text-[10px] text-rose-400 font-mono font-semibold mt-2 flex items-start gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <span>{passwordError}</span>
                    </p>
                  ) : (
                    <span className="text-[9px] text-slate-500 font-mono mt-1 block">Authentication strictly enforced. Access only unlocked via Creator's password ('Subodh').</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={handleTryNextStep}
                disabled={!userForm.name || !companyForm.name || !password}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-500 hover:to-blue-700 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/35 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>Decrypt & Enter Setup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={handleTryStartAnalysis}
                disabled={!password}
                className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 rounded-xl font-semibold text-slate-200 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Decrypt & Load Demo</span>
              </button>
            </div>

            {/* FEATURE DIRECTORY INDEX - Visible on Login Panel */}
            <div className="mt-12 pt-12 border-t border-slate-900 w-full text-left">
              <h3 className="text-xs font-bold text-cyan-400 font-mono tracking-widest uppercase text-center mb-6">
                FROSTIC SPENDING INTELLIGENCE CORE CAPABILITIES
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  {
                    title: "Spend Intelligence",
                    desc: "Track recurring outlays across departments, analyze active seat adoption, and verify vendor metrics.",
                    badge: "LEDGER_INTEGRATED"
                  },
                  {
                    title: "Planning & Forecasts",
                    desc: "Visualize multi-cloud resource models, detect idle server groups, and forecast upcoming costs.",
                    badge: "INFRA_OPTIMIZER"
                  },
                  {
                    title: "Savings Recovery Engine",
                    desc: "Conduct high-confidence overcharge claims, audit invoices, and manage renewal windows.",
                    badge: "AUTO_CLAIM"
                  },
                  {
                    title: "Cognitive AI Copilot",
                    desc: "Multi-agent spend summaries that map contract risks and draft renegotiation drafts instantly.",
                    badge: "COGNITIVE_AGENT"
                  },
                  {
                    title: "Gemini Playground",
                    desc: "Unrestricted, context-aware sandboxed playground to run general logic, code, or letter templates.",
                    badge: "LIVE_SANDBOX"
                  },
                  {
                    title: "Workspace Integration Hub",
                    desc: "Establish secure data links to QuickBooks, Core Banking APIs, AWS CloudWatch, and team structures.",
                    badge: "BANK_INTEGRATED"
                  },
                  {
                    title: "Invoice Anomaly Auditor",
                    desc: "Scan ledger attachments with automated OCR to flag double-billings, contract rate hikes, and unnotified tier spikes.",
                    badge: "ANOMALY_GUARD"
                  },
                  {
                    title: "Notice Window Renewals",
                    desc: "Proactive contract timers tracking notice-period triggers to let you opt-out or renegotiate rates on time.",
                    badge: "RENEWAL_ALERTS"
                  },
                  {
                    title: "Savings Optimizer Simulator",
                    desc: "Run predictive sliders to simulate immediate staff down-provisioning, cloud shrinkages, and SaaS consolidation.",
                    badge: "SIMULATOR_CORE"
                  }
                ].map((feat, idx) => (
                  <div key={idx} className="bg-slate-950/40 border border-slate-900 rounded-xl p-5 hover:border-cyan-500/20 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-cyan-500/10 transition-colors"></div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-white text-xs tracking-tight">{feat.title}</span>
                      <span className="text-[7.5px] bg-cyan-950/55 text-cyan-400 font-mono px-1.5 py-0.5 rounded border border-cyan-400/15">{feat.badge}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal">{feat.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <p className="text-[10px] text-cyan-400 font-mono mt-8 uppercase tracking-wider font-semibold">
              HACKATHON RELEASE v1.4 // DEVELOPED BY SUBODH
            </p>
          </div>
        )}

        {/* STEP 1: Personal Information */}
        {step === 1 && (
          <div className="w-full max-w-xl">
            <div className="flex items-center gap-3 mb-4 text-cyan-400">
              <User className="w-5 h-5" />
              <span className="text-xs font-mono uppercase tracking-wider">Step 1 of 5</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Tell us about yourself</h2>
            <p className="text-slate-400 text-sm mb-8">Personalize your user profile to determine your system dashboard privileges.</p>
            
            <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 space-y-4 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Full Name</label>
                  <input 
                    type="text" 
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Preferred Name</label>
                  <input 
                    type="text" 
                    value={userForm.preferredName}
                    onChange={(e) => setUserForm({ ...userForm, preferredName: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Work Email Address</label>
                <input 
                  type="email" 
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Job Title / Corporate Role</label>
                  <input 
                    type="text" 
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Phone Number</label>
                  <input 
                    type="text" 
                    value={userForm.phone}
                    onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Country</label>
                  <input 
                    type="text" 
                    value={userForm.country}
                    onChange={(e) => setUserForm({ ...userForm, country: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">City / Base</label>
                  <input 
                    type="text" 
                    value={userForm.city}
                    onChange={(e) => setUserForm({ ...userForm, city: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button onClick={handleBackStep} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                Back
              </button>
              <button onClick={handleNextStep} className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 rounded-xl font-semibold text-white flex items-center gap-1.5 transition-colors">
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Company Setup */}
        {step === 2 && (
          <div className="w-full max-w-xl">
            <div className="flex items-center gap-3 mb-4 text-cyan-400">
              <Briefcase className="w-5 h-5" />
              <span className="text-xs font-mono uppercase tracking-wider">Step 2 of 5</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Configure corporate parameters</h2>
            <p className="text-slate-400 text-sm mb-8">This determines initial operational spending models and industry SaaS indexes.</p>
            
            <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 space-y-4 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Company Name</label>
                  <input 
                    type="text" 
                    value={companyForm.name}
                    onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Website</label>
                  <input 
                    type="text" 
                    value={companyForm.website}
                    onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Company Type</label>
                  <input 
                    type="text" 
                    value={companyForm.companyType}
                    onChange={(e) => setCompanyForm({ ...companyForm, companyType: e.target.value })}
                    placeholder="e.g. Enterprise SaaS"
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Headquarters Location</label>
                  <input 
                    type="text" 
                    value={companyForm.headquarters}
                    onChange={(e) => setCompanyForm({ ...companyForm, headquarters: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Founded Year</label>
                  <input 
                    type="number" 
                    value={companyForm.foundedYear}
                    onChange={(e) => setCompanyForm({ ...companyForm, foundedYear: parseInt(e.target.value) || 2025 })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Annual Revenue Range</label>
                  <select 
                    value={companyForm.annualRevenue}
                    onChange={(e) => setCompanyForm({ ...companyForm, annualRevenue: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="<$1M">&lt; $1M USD</option>
                    <option value="$1M - $10M">$1M - $10M USD</option>
                    <option value="$10M - $50M">$10M - $50M USD</option>
                    <option value="$50M - $250M">$50M - $250M USD</option>
                    <option value="$250M+">$250M+ USD</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Business Description (Brief)</label>
                <textarea 
                  rows={2}
                  value={companyForm.description}
                  onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                  placeholder="Tell us what the company does..."
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button onClick={handleBackStep} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                Back
              </button>
              <button onClick={handleNextStep} className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 rounded-xl font-semibold text-white flex items-center gap-1.5 transition-colors">
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Team Configuration */}
        {step === 3 && (
          <div className="w-full max-w-xl">
            <div className="flex items-center gap-3 mb-4 text-cyan-400">
              <Users className="w-5 h-5" />
              <span className="text-xs font-mono uppercase tracking-wider">Step 3 of 5</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Team structure & departments</h2>
            <p className="text-slate-400 text-sm mb-8">All values like staffs and operations are fully changeable. Modify them now or alter them later in the profile settings.</p>
            
            <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 space-y-4 mb-8">
              {soloMode ? (
                <div className="text-center py-6">
                  <p className="text-slate-300 text-sm mb-3">You selected <strong>Solo Operator Mode</strong>.</p>
                  <p className="text-xs text-slate-500">All other staff allocations are disabled. You can disable Solo Mode to allocate multi-department budgets.</p>
                  <button 
                    onClick={() => setSoloMode(false)}
                    className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors"
                  >
                    Switch to Org / Team Mode
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5 font-medium">Total Staff Count</label>
                      <input 
                        type="number" 
                        value={companyForm.totalTeamSize}
                        onChange={(e) => setCompanyForm({ ...companyForm, totalTeamSize: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5 font-medium">Workplace Environment</label>
                      <select 
                        value={companyForm.officeMode}
                        onChange={(e) => setCompanyForm({ ...companyForm, officeMode: e.target.value })}
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="Hybrid">Hybrid (Node Offices)</option>
                        <option value="Remote">100% Remote / Distributed</option>
                        <option value="Onsite">In-Office Operations</option>
                      </select>
                    </div>
                  </div>

                  <div className="border-t border-slate-800/60 my-4 pt-4">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4">Department Staff Sizes</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1 font-medium">Finance Team Size</label>
                        <input 
                          type="number" 
                          value={companyForm.financeTeamSize}
                          onChange={(e) => setCompanyForm({ ...companyForm, financeTeamSize: parseInt(e.target.value) || 0 })}
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1 font-medium">IT Team Size</label>
                        <input 
                          type="number" 
                          value={companyForm.itTeamSize}
                          onChange={(e) => setCompanyForm({ ...companyForm, itTeamSize: parseInt(e.target.value) || 0 })}
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1 font-medium">Operations Team Size</label>
                        <input 
                          type="number" 
                          value={companyForm.operationsTeamSize}
                          onChange={(e) => setCompanyForm({ ...companyForm, operationsTeamSize: parseInt(e.target.value) || 0 })}
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1 font-medium">Procurement Team Size</label>
                        <input 
                          type="number" 
                          value={companyForm.procurementTeamSize}
                          onChange={(e) => setCompanyForm({ ...companyForm, procurementTeamSize: parseInt(e.target.value) || 0 })}
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-between items-center">
              <button onClick={handleBackStep} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                Back
              </button>
              <button onClick={handleNextStep} className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 rounded-xl font-semibold text-white flex items-center gap-1.5 transition-colors">
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Objectives */}
        {step === 4 && (
          <div className="w-full max-w-2xl">
            <div className="flex items-center gap-3 mb-4 text-cyan-400">
              <Target className="w-5 h-5" />
              <span className="text-xs font-mono uppercase tracking-wider">Step 4 of 5</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Determine primary business objectives</h2>
            <p className="text-slate-400 text-sm mb-8">We will prioritize insights and configure alerts aligned with your selections.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {OBJECTIVE_OPTIONS.map((opt) => {
                const isSelected = selectedObjectives.includes(opt.label);
                return (
                  <button 
                    key={opt.label}
                    onClick={() => handleObjectiveToggle(opt.label)}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      isSelected 
                        ? 'bg-cyan-950/35 border-cyan-500/55 shadow-md shadow-cyan-500/5' 
                        : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700/80'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className={`text-sm font-semibold ${isSelected ? 'text-cyan-400' : 'text-slate-200'}`}>{opt.label}</span>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'border-cyan-400 bg-cyan-400/10' : 'border-slate-700'
                      }`}>
                        {isSelected && <Check className="w-2.5 h-2.5 text-cyan-400 stroke-[3]" />}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">{opt.desc}</p>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between items-center">
              <button onClick={handleBackStep} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                Back
              </button>
              <button onClick={handleNextStep} className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 rounded-xl font-semibold text-white flex items-center gap-1.5 transition-colors">
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Review and Complete */}
        {step === 5 && (
          <div className="w-full max-w-xl">
            <div className="flex items-center gap-3 mb-4 text-emerald-400">
              <Check className="w-5 h-5" />
              <span className="text-xs font-mono uppercase tracking-wider">Step 5 of 5</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Review workspace parameters</h2>
            <p className="text-slate-400 text-sm mb-8">Confirm all collected information to spin up your personalized cost intelligence engine.</p>
            
            <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 space-y-6 mb-8 text-left">
              <div>
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block mb-2">Lead Administrator</span>
                <div className="flex items-center gap-3 bg-slate-950/40 p-3 rounded-lg border border-slate-900">
                  <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-cyan-400">{userForm.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{userForm.name}</p>
                    <p className="text-xs text-slate-400">{userForm.role} · {userForm.email}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block mb-1">Company Profile</span>
                  <p className="text-sm font-semibold text-white">{companyForm.name}</p>
                  <p className="text-xs text-slate-400">{companyForm.website}</p>
                  <p className="text-xs text-slate-400">{companyForm.industry}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block mb-1">Operational Structure</span>
                  <p className="text-sm font-semibold text-white">
                    {soloMode ? 'Solo Operator' : `${companyForm.totalTeamSize} Employees`}
                  </p>
                  <p className="text-xs text-slate-400">Workplace: {companyForm.officeMode}</p>
                  {!soloMode && (
                    <p className="text-xs text-slate-500">
                      Ops: {companyForm.operationsTeamSize} · IT: {companyForm.itTeamSize} · Finance: {companyForm.financeTeamSize}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block mb-2">Primary Targets ({selectedObjectives.length})</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedObjectives.map((obj) => (
                    <span key={obj} className="text-[10px] bg-slate-950 px-2.5 py-1 rounded-md border border-slate-900 text-slate-400">
                      {obj}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button onClick={handleBackStep} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                Back
              </button>
              <button 
                onClick={startAnalysis}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl font-semibold text-white flex items-center gap-2 shadow-lg shadow-cyan-500/10 transition-colors"
              >
                <span>Activate Dashboard Audit</span>
                <ArrowRight className="w-4 h-4 animate-bounce" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Bottom status */}
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-[11px] text-cyan-400 font-mono border-t border-slate-900 pt-4 z-10 gap-2 font-semibold">
        <span>SECURITY PROTOCOL: RSA_SHA256 // ZERO-KNOWLEDGE</span>
        <span>© 2026 FROSTIC INC. ALL RIGHTS RESERVED.</span>
      </div>
    </div>
  );
}
