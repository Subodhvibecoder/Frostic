/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  UserProfile, 
  CompanyProfile, 
  Expense, 
  Subscription, 
  Vendor, 
  Invoice, 
  CloudCosts, 
  Budget, 
  TeamMember, 
  SavingsOpportunity, 
  CurrencyConfig, 
  CURRENCIES,
  INITIAL_USER,
  INITIAL_COMPANY,
  INITIAL_OBJECTIVES,
  INITIAL_EXPENSES,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_VENDORS,
  INITIAL_INVOICES,
  INITIAL_CONTRACTS,
  INITIAL_CLOUD_COSTS,
  INITIAL_BUDGETS,
  INITIAL_TEAM,
  INITIAL_SAVINGS_OPPORTUNITIES,
  DEMO_EXPENSES,
  DEMO_SUBSCRIPTIONS,
  DEMO_VENDORS,
  DEMO_INVOICES,
  DEMO_CONTRACTS,
  DEMO_CLOUD_COSTS,
  DEMO_BUDGETS,
  DEMO_SAVINGS_OPPORTUNITIES,
  DEMO_TEAM
} from './data';

import Onboarding from './components/Onboarding';
import Sidebar from './components/Sidebar';
import CommandCenter from './components/CommandCenter';
import SpendIntelligence from './components/SpendIntelligence';
import PlanningIntelligence from './components/PlanningIntelligence';
import SavingsRecovery from './components/SavingsRecovery';
import AICopilot from './components/AICopilot';
import GeminiPlayground from './components/GeminiPlayground';
import CapabilityIndex from './components/CapabilityIndex';
import Administration from './components/Administration';

export default function App() {
  // Read state from localStorage helper
  const getStorage = <T,>(key: string, defaultValue: T): T => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(`Failed to parse localStorage key ${key}`, e);
      }
    }
    return defaultValue;
  };

  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => getStorage('frostic_is_onboarded', false));
  const [activeTab, setActiveTab] = useState<string>('command-center');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => getStorage('frostic_is_collapsed', false));

  // Global settings state
  const [currency, setCurrency] = useState<CurrencyConfig>(() => getStorage('frostic_currency', CURRENCIES.USD));
  const [user, setUser] = useState<UserProfile>(() => getStorage('frostic_user', { ...INITIAL_USER }));
  const [company, setCompany] = useState<CompanyProfile>(() => getStorage('frostic_company', { ...INITIAL_COMPANY }));
  const [objectives, setObjectives] = useState<string[]>(() => getStorage('frostic_objectives', [...INITIAL_OBJECTIVES]));

  // Global data tables (Fully editable/CRUD)
  const [expenses, setExpenses] = useState<Expense[]>(() => getStorage('frostic_expenses', [...INITIAL_EXPENSES]));
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => getStorage('frostic_subscriptions', [...INITIAL_SUBSCRIPTIONS]));
  const [vendors, setVendors] = useState<Vendor[]>(() => getStorage('frostic_vendors', [...INITIAL_VENDORS]));
  const [invoices, setInvoices] = useState<Invoice[]>(() => getStorage('frostic_invoices', [...INITIAL_INVOICES]));
  const [cloudCosts, setCloudCosts] = useState<CloudCosts>(() => getStorage('frostic_cloud_costs', { ...INITIAL_CLOUD_COSTS }));
  const [budgets, setBudgets] = useState<Budget[]>(() => getStorage('frostic_budgets', [...INITIAL_BUDGETS]));
  const [team, setTeam] = useState<TeamMember[]>(() => getStorage('frostic_team', [...INITIAL_TEAM]));
  const [opportunities, setOpportunities] = useState<SavingsOpportunity[]>(() => getStorage('frostic_opportunities', [...INITIAL_SAVINGS_OPPORTUNITIES]));

  // Sync side effects
  React.useEffect(() => {
    localStorage.setItem('frostic_is_onboarded', JSON.stringify(isOnboarded));
  }, [isOnboarded]);

  React.useEffect(() => {
    localStorage.setItem('frostic_is_collapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  React.useEffect(() => {
    localStorage.setItem('frostic_currency', JSON.stringify(currency));
  }, [currency]);

  React.useEffect(() => {
    localStorage.setItem('frostic_user', JSON.stringify(user));
  }, [user]);

  React.useEffect(() => {
    localStorage.setItem('frostic_company', JSON.stringify(company));
  }, [company]);

  React.useEffect(() => {
    localStorage.setItem('frostic_objectives', JSON.stringify(objectives));
  }, [objectives]);

  React.useEffect(() => {
    localStorage.setItem('frostic_expenses', JSON.stringify(expenses));
  }, [expenses]);

  React.useEffect(() => {
    localStorage.setItem('frostic_subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  React.useEffect(() => {
    localStorage.setItem('frostic_vendors', JSON.stringify(vendors));
  }, [vendors]);

  React.useEffect(() => {
    localStorage.setItem('frostic_invoices', JSON.stringify(invoices));
  }, [invoices]);

  React.useEffect(() => {
    localStorage.setItem('frostic_cloud_costs', JSON.stringify(cloudCosts));
  }, [cloudCosts]);

  React.useEffect(() => {
    localStorage.setItem('frostic_budgets', JSON.stringify(budgets));
  }, [budgets]);

  React.useEffect(() => {
    localStorage.setItem('frostic_team', JSON.stringify(team));
  }, [team]);

  React.useEffect(() => {
    localStorage.setItem('frostic_opportunities', JSON.stringify(opportunities));
  }, [opportunities]);

  // Handle Onboarding Completion
  const handleOnboardingComplete = (newUser: UserProfile, newCompany: CompanyProfile, newObjectives: string[]) => {
    setUser(newUser);
    
    // Automatically adjust team allocations under Company Profile state based on onboarding numbers
    const updatedCompany: CompanyProfile = {
      ...newCompany,
      totalTeamSize: newCompany.totalTeamSize,
      financeTeamSize: newCompany.financeTeamSize || 2,
      itTeamSize: newCompany.itTeamSize || 3,
      operationsTeamSize: newCompany.operationsTeamSize || 8,
      procurementTeamSize: newCompany.procurementTeamSize || 2
    };

    setCompany(updatedCompany);
    setObjectives(newObjectives);
    setIsOnboarded(true);
  };

  // Complete data reset state trigger
  const handleResetData = () => {
    setExpenses([]);
    setSubscriptions([]);
    setVendors([]);
    setInvoices([]);
    setCloudCosts({ compute: 0, storage: 0, databases: 0, networking: 0, transfer: 0, devResources: 0, idlePercent: 0 });
    setBudgets(budgets.map(b => ({ ...b, actual: 0, remaining: b.budget, forecast: 0 })));
    setOpportunities([]);
    setTeam([]); // Clear active team roster
    localStorage.removeItem('frostic_integrations'); // Purge active integrations
    alert('Success: All operating expenses, subscriptions, budgets, team setups, and integration hubs reset to clean 0-Ledger.');
    window.location.reload(); // Instantly reload to synchronize UI caches
  };

  // Data restoration trigger
  const handleRestoreDemo = () => {
    setExpenses([...DEMO_EXPENSES]);
    setSubscriptions([...DEMO_SUBSCRIPTIONS]);
    setVendors([...DEMO_VENDORS]);
    setInvoices([...DEMO_INVOICES]);
    setCloudCosts({ ...DEMO_CLOUD_COSTS });
    setBudgets([...DEMO_BUDGETS]);
    setOpportunities([...DEMO_SAVINGS_OPPORTUNITIES]);
    setTeam([...DEMO_TEAM]); // Restore default team roster
    
    // Restore default integrations
    const demoIntegrations = [
      { id: 'aws', name: 'Amazon Web Services', category: 'Cloud Infrastructure', connected: true, logo: 'AWS' },
      { id: 'notion', name: 'Notion Workspace', category: 'Productivity Tools', connected: true, logo: 'Notion' },
      { id: 'slack', name: 'Slack Corporate', category: 'Communication', connected: true, logo: 'Slack' },
      { id: 'figma', name: 'Figma Enterprise', category: 'Design Utilities', connected: true, logo: 'Figma' },
      { id: 'plaid', name: 'Plaid Core Feeds', category: 'Banking Feeds', connected: false, logo: 'Plaid' },
      { id: 'quickbooks', name: 'QuickBooks Ledger', category: 'Accounting Platforms', connected: false, logo: 'QBO' },
    ];
    localStorage.setItem('frostic_integrations', JSON.stringify(demoIntegrations));
    
    alert('Success: High-integrity corporate demo dataset loaded successfully. Team rosters and integrations populated.');
    window.location.reload(); // Instantly reload to synchronize UI caches
  };

  // Switch workspace currency
  const handleSetCurrency = (code: string) => {
    const config = CURRENCIES[code];
    if (config) {
      setCurrency(config);
    }
  };

  // Logout Option - Reset onboarding & localStorage states
  const handleLogout = () => {
    setIsOnboarded(false);
    setUser({ ...INITIAL_USER });
    setCompany({ ...INITIAL_COMPANY });
    setObjectives([...INITIAL_OBJECTIVES]);
    
    localStorage.removeItem('frostic_is_onboarded');
    localStorage.removeItem('frostic_user');
    localStorage.removeItem('frostic_company');
    localStorage.removeItem('frostic_objectives');
    localStorage.removeItem('frostic_gemini_messages');
    localStorage.removeItem('frostic_copilot_messages');
  };

  if (!isOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      
      {/* Persistant Global Navigation Sidebar */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        company={company}
        currency={currency}
        setCurrency={handleSetCurrency}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        onLogout={handleLogout}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 overflow-y-auto p-8 relative flex flex-col justify-between scrollbar-thin">
        
        {/* Dynamic Light Background Sources */}
        <div className="absolute top-[5%] right-[5%] w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[10%] left-[10%] w-72 h-72 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl w-full mx-auto space-y-8 z-10">
          
          {/* Main Router Logic */}
          {activeTab === 'command-center' && (
            <CommandCenter 
              expenses={expenses}
              subscriptions={subscriptions}
              opportunities={opportunities}
              company={company}
              user={user}
              currency={currency}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onAnalyzeCompany={handleRestoreDemo}
              onResetData={handleResetData}
              onRestoreDemo={handleRestoreDemo}
              onAddExpense={() => setActiveTab('all-expenses')}
            />
          )}

          {activeTab === 'capability-index' && (
            <CapabilityIndex 
              setActiveTab={setActiveTab}
            />
          )}

          {/* Spend Intelligence Tabs */}
          {activeTab === 'all-expenses' && (
            <SpendIntelligence 
              expenses={expenses}
              setExpenses={setExpenses}
              subscriptions={subscriptions}
              setSubscriptions={setSubscriptions}
              vendors={vendors}
              setVendors={setVendors}
              invoices={invoices}
              setInvoices={setInvoices}
              cloudCosts={cloudCosts}
              setCloudCosts={setCloudCosts}
              currency={currency}
              defaultSubTab="expenses"
            />
          )}

          {activeTab === 'subscriptions' && (
            <SpendIntelligence 
              expenses={expenses}
              setExpenses={setExpenses}
              subscriptions={subscriptions}
              setSubscriptions={setSubscriptions}
              vendors={vendors}
              setVendors={setVendors}
              invoices={invoices}
              setInvoices={setInvoices}
              cloudCosts={cloudCosts}
              setCloudCosts={setCloudCosts}
              currency={currency}
              defaultSubTab="subscriptions"
            />
          )}

          {activeTab === 'vendors' && (
            <SpendIntelligence 
              expenses={expenses}
              setExpenses={setExpenses}
              subscriptions={subscriptions}
              setSubscriptions={setSubscriptions}
              vendors={vendors}
              setVendors={setVendors}
              invoices={invoices}
              setInvoices={setInvoices}
              cloudCosts={cloudCosts}
              setCloudCosts={setCloudCosts}
              currency={currency}
              defaultSubTab="vendors"
            />
          )}

          {activeTab === 'invoices' && (
            <SpendIntelligence 
              expenses={expenses}
              setExpenses={setExpenses}
              subscriptions={subscriptions}
              setSubscriptions={setSubscriptions}
              vendors={vendors}
              setVendors={setVendors}
              invoices={invoices}
              setInvoices={setInvoices}
              cloudCosts={cloudCosts}
              setCloudCosts={setCloudCosts}
              currency={currency}
              defaultSubTab="invoices"
            />
          )}

          {activeTab === 'cloud-costs' && (
            <SpendIntelligence 
              expenses={expenses}
              setExpenses={setExpenses}
              subscriptions={subscriptions}
              setSubscriptions={setSubscriptions}
              vendors={vendors}
              setVendors={setVendors}
              invoices={invoices}
              setInvoices={setInvoices}
              cloudCosts={cloudCosts}
              setCloudCosts={setCloudCosts}
              currency={currency}
              defaultSubTab="cloud"
            />
          )}

          {/* Optimization & Planning Tabs */}
          {activeTab === 'savings-opportunities' && (
            <PlanningIntelligence 
              opportunities={opportunities}
              setOpportunities={setOpportunities}
              budgets={budgets}
              setBudgets={setBudgets}
              subscriptions={subscriptions}
              setSubscriptions={setSubscriptions}
              expenses={expenses}
              setExpenses={setExpenses}
              currency={currency}
              defaultSubTab="opportunities"
            />
          )}

          {activeTab === 'savings-simulator' && (
            <PlanningIntelligence 
              opportunities={opportunities}
              setOpportunities={setOpportunities}
              budgets={budgets}
              setBudgets={setBudgets}
              subscriptions={subscriptions}
              setSubscriptions={setSubscriptions}
              expenses={expenses}
              setExpenses={setExpenses}
              currency={currency}
              defaultSubTab="simulator"
            />
          )}

          {activeTab === 'duplicate-detector' && (
            <PlanningIntelligence 
              opportunities={opportunities}
              setOpportunities={setOpportunities}
              budgets={budgets}
              setBudgets={setBudgets}
              subscriptions={subscriptions}
              setSubscriptions={setSubscriptions}
              expenses={expenses}
              setExpenses={setExpenses}
              currency={currency}
              defaultSubTab="duplicates"
            />
          )}

          {activeTab === 'scenario-lab' && (
            <PlanningIntelligence 
              opportunities={opportunities}
              setOpportunities={setOpportunities}
              budgets={budgets}
              setBudgets={setBudgets}
              subscriptions={subscriptions}
              setSubscriptions={setSubscriptions}
              expenses={expenses}
              setExpenses={setExpenses}
              currency={currency}
              defaultSubTab="scenario-lab"
            />
          )}

          {activeTab === 'budgets' && (
            <PlanningIntelligence 
              opportunities={opportunities}
              setOpportunities={setOpportunities}
              budgets={budgets}
              setBudgets={setBudgets}
              subscriptions={subscriptions}
              setSubscriptions={setSubscriptions}
              expenses={expenses}
              setExpenses={setExpenses}
              currency={currency}
              defaultSubTab="budgets"
            />
          )}

          {activeTab === 'renewals' && (
            <PlanningIntelligence 
              opportunities={opportunities}
              setOpportunities={setOpportunities}
              budgets={budgets}
              setBudgets={setBudgets}
              subscriptions={subscriptions}
              setSubscriptions={setSubscriptions}
              expenses={expenses}
              setExpenses={setExpenses}
              currency={currency}
              defaultSubTab="renewals"
            />
          )}

          {/* Intelligence & Realization Tabs */}
          {activeTab === 'anomalies' && (
            <SpendIntelligence 
              expenses={expenses}
              setExpenses={setExpenses}
              subscriptions={subscriptions}
              setSubscriptions={setSubscriptions}
              vendors={vendors}
              setVendors={setVendors}
              invoices={invoices}
              setInvoices={setInvoices}
              cloudCosts={cloudCosts}
              setCloudCosts={setCloudCosts}
              currency={currency}
              defaultSubTab="invoices"
            />
          )}

          {activeTab === 'ai-copilot' && (
            <AICopilot 
              expenses={expenses}
              subscriptions={subscriptions}
              opportunities={opportunities}
              currency={currency}
            />
          )}

          {activeTab === 'gemini-playground' && (
            <GeminiPlayground 
              currency={currency}
              expenses={expenses}
              subscriptions={subscriptions}
              opportunities={opportunities}
              budgets={budgets}
              company={company}
            />
          )}

          {activeTab === 'savings-recovery' && (
            <SavingsRecovery 
              opportunities={opportunities}
              currency={currency}
            />
          )}

          {/* Administration Tabs */}
          {activeTab === 'team' && (
            <Administration 
              team={team}
              setTeam={setTeam}
              company={company}
              setCompany={setCompany}
              user={user}
              setUser={setUser}
              currency={currency}
              defaultSubTab="team"
              onResetData={handleResetData}
              onRestoreDemo={handleRestoreDemo}
            />
          )}

          {activeTab === 'integrations' && (
            <Administration 
              team={team}
              setTeam={setTeam}
              company={company}
              setCompany={setCompany}
              user={user}
              setUser={setUser}
              currency={currency}
              defaultSubTab="integrations"
              onResetData={handleResetData}
              onRestoreDemo={handleRestoreDemo}
            />
          )}

          {activeTab === 'settings' && (
            <Administration 
              team={team}
              setTeam={setTeam}
              company={company}
              setCompany={setCompany}
              user={user}
              setUser={setUser}
              currency={currency}
              defaultSubTab="security"
              onResetData={handleResetData}
              onRestoreDemo={handleRestoreDemo}
            />
          )}

          {activeTab === 'about' && (
            <Administration 
              team={team}
              setTeam={setTeam}
              company={company}
              setCompany={setCompany}
              user={user}
              setUser={setUser}
              currency={currency}
              defaultSubTab="about"
              onResetData={handleResetData}
              onRestoreDemo={handleRestoreDemo}
            />
          )}

        </div>

        {/* Global Compact Footer */}
        <footer className="mt-12 text-[10px] text-slate-600 font-mono tracking-wider flex flex-col md:flex-row justify-between items-center z-10 border-t border-slate-900/60 pt-4 gap-2">
          <span>COGNITIVE CORE INDEX: SYNC_READY</span>
          <span>© 2026 FROSTIC INC. SYSTEM PRIVACY RULES VERIFIED</span>
        </footer>
      </main>
    </div>
  );
}
