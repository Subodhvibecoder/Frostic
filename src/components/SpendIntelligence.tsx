/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  DollarSign, 
  RefreshCw, 
  Users, 
  FileText, 
  Database, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Edit2, 
  AlertTriangle, 
  Check, 
  Sparkles, 
  UploadCloud, 
  Info,
  Layers,
  TrendingDown,
  ArrowRight,
  User
} from 'lucide-react';
import { 
  Expense, 
  Subscription, 
  Vendor, 
  Invoice, 
  CloudCosts, 
  CurrencyConfig 
} from '../data';

interface SpendIntelligenceProps {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  subscriptions: Subscription[];
  setSubscriptions: React.Dispatch<React.SetStateAction<Subscription[]>>;
  vendors: Vendor[];
  setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  cloudCosts: CloudCosts;
  setCloudCosts: React.Dispatch<React.SetStateAction<CloudCosts>>;
  currency: CurrencyConfig;
  defaultSubTab?: string;
}

export default function SpendIntelligence({
  expenses,
  setExpenses,
  subscriptions,
  setSubscriptions,
  vendors,
  setVendors,
  invoices,
  setInvoices,
  cloudCosts,
  setCloudCosts,
  currency,
  defaultSubTab = 'expenses'
}: SpendIntelligenceProps) {
  
  const [subTab, setSubTab] = useState<string>(defaultSubTab);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');

  // Modal forms states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'expense' | 'subscription' | 'vendor' | 'invoice' | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form values
  const [expenseForm, setExpenseForm] = useState<Partial<Expense>>({});
  const [subForm, setSubForm] = useState<Partial<Subscription>>({});
  const [vendorForm, setVendorForm] = useState<Partial<Vendor>>({});

  // Invoice scan simulations
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [isScanningInvoice, setIsScanningInvoice] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<number>(0);
  const [scannedInvoice, setScannedInvoice] = useState<Partial<Invoice> | null>(null);

  const formatCurrency = (val: number) => {
    const adjusted = val * currency.rate;
    return `${currency.symbol}${adjusted.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  const SCAN_STEPS = [
    'Parsing file layout and rendering OCR components...',
    'Extracting purchase line items, totals, and tax codes...',
    'Matching signature against current vendor contracts...',
    'Comparing prices with preceding billing historical records...',
    'Detecting billing anomalies and quantity spikes...'
  ];

  // Unique categories & departments for dropdowns
  const categories = ['All', ...Array.from(new Set(expenses.map(e => e.category)))];
  const departments = ['All', ...Array.from(new Set(expenses.map(e => e.department)))];

  // Actions for CRUD
  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const handleDeleteSubscription = (id: string) => {
    setSubscriptions(prev => prev.filter(s => s.id !== id));
  };

  const handleDeleteVendor = (id: string) => {
    setVendors(prev => prev.filter(v => v.id !== id));
  };

  const handleDeleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(i => i.id !== id));
  };

  const handleOpenAddExpense = () => {
    setExpenseForm({
      vendor: '',
      amount: 1200,
      category: 'Productivity',
      department: 'Engineering',
      type: 'Recurring',
      frequency: 'Monthly',
      owner: 'Subodh',
      status: 'Active',
      riskScore: 10,
      insight: 'Freshly logged recurring expense.'
    });
    setEditingId(null);
    setModalType('expense');
    setIsModalOpen(true);
  };

  const handleOpenEditExpense = (item: Expense) => {
    setExpenseForm(item);
    setEditingId(item.id);
    setModalType('expense');
    setIsModalOpen(true);
  };

  const handleOpenAddSubscription = () => {
    setSubForm({
      vendor: '',
      plan: 'Professional Tier',
      cost: 150,
      seats: 10,
      activeSeats: 10,
      utilization: 100,
      costPerUser: 15,
      renewalDate: '2026-12-31',
      contractStatus: 'Auto-Renew',
      owner: 'Subodh',
      department: 'Engineering',
      riskScore: 10,
      recommendation: 'Keep',
      description: 'Active software utility subscription.'
    });
    setEditingId(null);
    setModalType('subscription');
    setIsModalOpen(true);
  };

  const handleOpenEditSubscription = (item: Subscription) => {
    setSubForm(item);
    setEditingId(item.id);
    setModalType('subscription');
    setIsModalOpen(true);
  };

  const handleOpenAddVendor = () => {
    setVendorForm({
      name: '',
      industry: 'Software',
      monthlySpend: 500,
      contractValue: 6000,
      seatsCount: 5,
      activeUsers: 5,
      renewalDate: '2027-01-01',
      riskScore: 10,
      recommendation: 'Healthy',
      category: 'Productivity',
      description: 'Business software supplier.'
    });
    setEditingId(null);
    setModalType('vendor');
    setIsModalOpen(true);
  };

  const handleOpenEditVendor = (item: Vendor) => {
    setVendorForm(item);
    setEditingId(item.id);
    setModalType('vendor');
    setIsModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === 'expense') {
      if (editingId) {
        setExpenses(prev => prev.map(item => item.id === editingId ? { ...item, ...expenseForm } as Expense : item));
      } else {
        const newExp: Expense = {
          id: `exp-${Date.now()}`,
          ...expenseForm
        } as Expense;
        setExpenses(prev => [newExp, ...prev]);
      }
    } else if (modalType === 'subscription') {
      const calculatedUtil = subForm.seats && subForm.seats > 0 
        ? Math.round(((subForm.activeSeats || 0) / subForm.seats) * 100) 
        : 100;
      const calculatedCostPerUser = subForm.seats && subForm.seats > 0 
        ? parseFloat(((subForm.cost || 0) / subForm.seats).toFixed(2)) 
        : subForm.cost || 0;
      
      const populatedSub = {
        ...subForm,
        utilization: calculatedUtil,
        costPerUser: calculatedCostPerUser
      };

      if (editingId) {
        setSubscriptions(prev => prev.map(item => item.id === editingId ? { ...item, ...populatedSub } as Subscription : item));
      } else {
        const newSub: Subscription = {
          id: `sub-${Date.now()}`,
          ...populatedSub
        } as Subscription;
        setSubscriptions(prev => [newSub, ...prev]);
      }
    } else if (modalType === 'vendor') {
      if (editingId) {
        setVendors(prev => prev.map(item => item.id === editingId ? { ...item, ...vendorForm } as Vendor : item));
      } else {
        const newVendor: Vendor = {
          id: `ven-${Date.now()}`,
          ...vendorForm
        } as Vendor;
        setVendors(prev => [newVendor, ...prev]);
      }
    }
    setIsModalOpen(false);
  };

  // Drag-and-drop or select file simulation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setInvoiceFile(file);
      setIsScanningInvoice(true);
      setScanStep(0);

      const interval = setInterval(() => {
        setScanStep(prev => {
          if (prev >= SCAN_STEPS.length - 1) {
            clearInterval(interval);
            
            // Randomly match loaded vendors or default
            const potentialVendors = ['Notion Teams', 'AWS Enterprise', 'Miro Boards', 'GitHub LLC', 'Figma Pro'];
            const matchedVendor = file.name.toLowerCase().includes('notion') 
              ? 'Notion Teams' 
              : file.name.toLowerCase().includes('aws')
              ? 'Amazon Web Services'
              : potentialVendors[Math.floor(Math.random() * potentialVendors.length)];
            
            const scanResult: Partial<Invoice> = {
              id: `inv-${Date.now()}`,
              vendor: matchedVendor,
              total: file.size % 100 === 0 ? 3400 : Math.round(1500 + (file.size % 4500)),
              billingPeriod: 'Sep 1, 2026 - Sep 30, 2026',
              lineItemsCount: 8,
              confidence: 96,
              anomaliesCount: file.size % 3 === 0 ? 2 : 1,
              date: new Date().toISOString().split('T')[0],
              status: 'Flagged',
              anomalies: file.size % 3 === 0 ? [
                'Duplicate seat charges: 15 seats billed twice in the same monthly window.',
                'Discrepancy: Base plan rate is 14% higher than negotiated contract values.'
              ] : [
                'Unused seat billing detected: 8 seats allocated to dormant users (no log-ins).'
              ]
            };

            setScannedInvoice(scanResult);
            setIsScanningInvoice(false);
            return prev;
          }
          return prev + 1;
        });
      }, 700);
    }
  };

  const handleApproveInvoice = () => {
    if (scannedInvoice) {
      const approved: Invoice = {
        ...scannedInvoice,
        status: 'Approved',
        anomaliesCount: 0,
        anomalies: []
      } as Invoice;
      setInvoices(prev => [approved, ...prev]);
      setScannedInvoice(null);
      setInvoiceFile(null);
    }
  };

  const handleFlagInvoice = () => {
    if (scannedInvoice) {
      const flagged: Invoice = {
        ...scannedInvoice,
        status: 'Flagged'
      } as Invoice;
      setInvoices(prev => [flagged, ...prev]);
      setScannedInvoice(null);
      setInvoiceFile(null);
    }
  };

  // Filtered lists
  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = exp.vendor.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          exp.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          exp.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || exp.category === categoryFilter;
    const matchesDepartment = departmentFilter === 'All' || exp.department === departmentFilter;
    return matchesSearch && matchesCategory && matchesDepartment;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Sub Tabs Bar */}
      <div className="flex border-b border-slate-900 gap-1 overflow-x-auto pb-px">
        {[
          { id: 'expenses', label: 'All Expenses', icon: DollarSign },
          { id: 'subscriptions', label: 'Subscription Auditor', icon: RefreshCw },
          { id: 'vendors', label: 'Vendor Directory', icon: Users },
          { id: 'invoices', label: 'Invoice Scanner', icon: FileText },
          { id: 'cloud', label: 'Cloud Infrastructure Optimizer', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setSubTab(tab.id);
                setSearchQuery('');
              }}
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

      {/* ================= ALL EXPENSES SUB-TAB ================= */}
      {subTab === 'expenses' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Operational Spend Ledger</h2>
              <p className="text-xs text-slate-400">Total verified expenses tracked in active billing profiles</p>
            </div>
            
            <button 
              onClick={handleOpenAddExpense}
              className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-600 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 transition-colors self-stretch sm:self-auto justify-center"
            >
              <Plus className="w-4 h-4" />
              <span>Log Custom Expense</span>
            </button>
          </div>

          {/* Table Utilities Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/10 p-4 border border-slate-900 rounded-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search vendor, category, owner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>)}
              </select>
            </div>

            <div>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
              >
                {departments.map(dept => <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>)}
              </select>
            </div>
          </div>

          {/* Expenses Table */}
          <div className="bg-slate-900/10 border border-slate-900 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 bg-slate-950/40 text-[10px] font-mono uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">Vendor</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Dept</th>
                    <th className="py-3 px-4">Owner</th>
                    <th className="py-3 px-4">Audit Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-xs text-slate-300">
                  {filteredExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        No matching expenses found. Click "Log Custom Expense" to add some!
                      </td>
                    </tr>
                  ) : (
                    filteredExpenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-slate-900/20 transition-all group">
                        <td className="py-3.5 px-4 font-semibold text-white">{exp.vendor}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">{formatCurrency(exp.amount)}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-400">{exp.date}</td>
                        <td className="py-3.5 px-4 text-slate-400">{exp.category}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-900 text-[10px]">
                            {exp.department}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">{exp.owner}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              exp.status === 'Active' ? 'bg-emerald-500' : exp.status === 'Pending' ? 'bg-amber-500' : 'bg-rose-500 animate-pulse'
                            }`} />
                            <span className={exp.status === 'Flagged' ? 'text-rose-400 font-semibold' : ''}>{exp.status}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5opacity-60 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleOpenEditExpense(exp)}
                              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-900"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteExpense(exp.id)}
                              className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-900"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUBSCRIPTIONS SUB-TAB ================= */}
      {subTab === 'subscriptions' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Subscription Auditor Command</h2>
              <p className="text-xs text-slate-400">Continuous license usage, seat allocations, and cost efficiency</p>
            </div>
            
            <button 
              onClick={handleOpenAddSubscription}
              className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-600 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 transition-colors self-stretch sm:self-auto justify-center"
            >
              <Plus className="w-4 h-4" />
              <span>Link Subscription</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptions.map((sub) => (
              <div key={sub.id} className="bg-slate-900/10 border border-slate-900 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-white text-sm">{sub.vendor}</h3>
                      <span className="text-[10px] text-slate-500 font-mono tracking-wider block uppercase mt-0.5">{sub.plan}</span>
                    </div>
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md ${
                      sub.recommendation === 'Keep' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      sub.recommendation === 'Downgrade' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {sub.recommendation.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{sub.description}</p>

                  <div className="space-y-3 bg-slate-950/40 p-4 border border-slate-900 rounded-xl mb-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Monthly Spend:</span>
                      <span className="font-mono font-bold text-white">{formatCurrency(sub.cost)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Seat Utilization:</span>
                      <span className="font-mono text-slate-300">{sub.activeSeats} / {sub.seats} ({sub.utilization}%)</span>
                    </div>
                    <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${sub.utilization > 80 ? 'bg-emerald-500' : sub.utilization > 50 ? 'bg-amber-500' : 'bg-rose-500 animate-pulse'}`} 
                        style={{ width: `${sub.utilization}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs pt-1.5 border-t border-slate-900">
                      <span className="text-slate-500">Annual Waste Estimate:</span>
                      <span className="font-mono text-rose-400 font-bold">
                        {formatCurrency(sub.cost * 12 * (1 - sub.utilization / 100))}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-900 pt-4 mt-2">
                  <span className="text-[10px] text-slate-500 font-mono">RENEWAL: {sub.renewalDate}</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleOpenEditSubscription(sub)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-950 border border-transparent hover:border-slate-800 rounded-lg"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteSubscription(sub.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-950 border border-transparent hover:border-slate-800 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= VENDORS SUB-TAB ================= */}
      {subTab === 'vendors' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Vendor Directory & Risk Profiles</h2>
              <p className="text-xs text-slate-400">Comprehensive profiles and active commitments</p>
            </div>
            
            <button 
              onClick={handleOpenAddVendor}
              className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-600 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 transition-colors self-stretch sm:self-auto justify-center"
            >
              <Plus className="w-4 h-4" />
              <span>Register Vendor</span>
            </button>
          </div>

          <div className="bg-slate-900/10 border border-slate-900 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-900 bg-slate-950/40 text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Vendor Profile</th>
                  <th className="py-3 px-4">Industry Sector</th>
                  <th className="py-3 px-4">Monthly Run-rate</th>
                  <th className="py-3 px-4">Contract Value</th>
                  <th className="py-3 px-4">Active Seats</th>
                  <th className="py-3 px-4">Renewal Window</th>
                  <th className="py-3 px-4">Risk Exposure</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-xs text-slate-300">
                {vendors.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-900/20 transition-all group">
                    <td className="py-3.5 px-4 font-semibold text-white">{v.name}</td>
                    <td className="py-3.5 px-4 text-slate-400">{v.industry}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-200">{formatCurrency(v.monthlySpend)}</td>
                    <td className="py-3.5 px-4 font-mono text-cyan-400 font-bold">{formatCurrency(v.contractValue)}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{v.activeUsers} / {v.seatsCount}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{v.renewalDate}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-950 border border-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${v.riskScore > 60 ? 'bg-rose-500 animate-pulse' : v.riskScore > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                            style={{ width: `${v.riskScore}%` }}
                          />
                        </div>
                        <span className="font-mono text-[10px] text-slate-400">{v.riskScore}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenEditVendor(v)}
                          className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-900"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteVendor(v.id)}
                          className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-900"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= INVOICE SCANNER SUB-TAB ================= */}
      {subTab === 'invoices' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Invoice Intelligence Engine</h2>
            <p className="text-xs text-slate-400">Upload corporate invoices to cross-reference historical rates and flag double-billing</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Upload Zone (5 columns) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-900/10 border-2 border-dashed border-slate-800 hover:border-cyan-500/40 rounded-2xl p-8 text-center transition-all relative">
                <input 
                  type="file" 
                  accept=".pdf,.png,.jpg,.jpeg,.csv"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isScanningInvoice}
                />
                <UploadCloud className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-sm font-semibold text-white mb-1">Drag and drop invoice file</h3>
                <p className="text-xs text-slate-500 mb-4">Accepts PDF, JPG, PNG, CSV up to 10MB</p>
                <div className="inline-block px-3 py-1 bg-slate-950 border border-slate-900 rounded-lg text-[10px] text-cyan-400 font-mono">
                  SCAN FOR DOUBLE-BILLING & HIKE ANOMALIES
                </div>
              </div>

              {isScanningInvoice && (
                <div className="bg-slate-900/20 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin shrink-0"></div>
                    <span className="text-xs font-semibold text-white">Ingesting Invoice...</span>
                  </div>
                  <div className="space-y-2">
                    {SCAN_STEPS.map((stepTxt, idx) => (
                      <div key={idx} className={`text-[11px] font-mono flex items-center gap-2 ${idx <= scanStep ? 'text-slate-300' : 'text-slate-600'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${idx < scanStep ? 'bg-emerald-500' : idx === scanStep ? 'bg-cyan-400 animate-pulse' : 'bg-slate-800'}`} />
                        <span>{stepTxt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scanned Result display */}
              {scannedInvoice && (
                <div className="bg-slate-900/40 border-2 border-rose-500/30 rounded-2xl p-6 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                    <div>
                      <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block">SCANNED VENDOR</span>
                      <h3 className="text-sm font-extrabold text-white">{scannedInvoice.vendor}</h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-rose-400">Flagged Anomalies</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                    <div>
                      <span className="text-slate-500 block">INVOICE TOTAL:</span>
                      <span className="text-sm font-bold text-white">{formatCurrency(scannedInvoice.total || 0)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">CONFIDENCE RATING:</span>
                      <span className="text-sm font-bold text-cyan-400">{scannedInvoice.confidence}%</span>
                    </div>
                  </div>

                  <div className="space-y-2 bg-rose-500/5 p-3 rounded-xl border border-rose-500/20 text-[11px] text-rose-300 leading-relaxed">
                    <p className="font-semibold flex items-center gap-1.5 text-rose-400">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Anomaly Report ({scannedInvoice.anomaliesCount})</span>
                    </p>
                    {scannedInvoice.anomalies?.map((an, aIdx) => (
                      <p key={aIdx}>· {an}</p>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={handleApproveInvoice}
                      className="flex-1 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold transition-colors"
                    >
                      Bypass and Approve
                    </button>
                    <button 
                      onClick={handleFlagInvoice}
                      className="flex-1 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-semibold transition-colors"
                    >
                      Flag for Audit
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Historical Invoices List (7 columns) */}
            <div className="lg:col-span-7 bg-slate-900/10 border border-slate-900 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-slate-200 mb-4">Invoice Ledger Audit</h3>
              
              <div className="space-y-3">
                {invoices.map((inv) => (
                  <div key={inv.id} className="bg-slate-950/60 p-4 border border-slate-900 rounded-xl flex items-center justify-between hover:border-slate-800 transition-all">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-white text-xs">{inv.vendor}</span>
                        <span className={`px-1.5 py-0.5 text-[9px] rounded font-semibold ${
                          inv.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' : 'bg-rose-500/10 text-rose-400 border border-rose-500/15 animate-pulse'
                        }`}>
                          {inv.status}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono block mt-1">PERIOD: {inv.billingPeriod}</span>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-sm font-bold text-white block">{formatCurrency(inv.total)}</span>
                      <button 
                        onClick={() => handleDeleteInvoice(inv.id)}
                        className="text-[10px] text-slate-500 hover:text-rose-400 underline font-mono"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= CLOUD COSTS SUB-TAB ================= */}
      {subTab === 'cloud' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-white">Cloud Infrastructure Optimization</h2>
              <p className="text-xs text-slate-400">AWS / GCP overprovisioning maps and idle compute terminators</p>
            </div>
            
            <div className="bg-slate-950 border border-slate-900 px-3 py-1 rounded-xl text-xs font-mono text-rose-400 flex items-center gap-1.5 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{cloudCosts.idlePercent}% Idle Capacity</span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { label: 'Compute Instances (EC2/VM)', value: cloudCosts.compute, key: 'compute', desc: 'Over-allocated core sizes', max: 40000 },
              { label: 'Cloud Storage (S3/EBS)', value: cloudCosts.storage, key: 'storage', desc: 'Dormant unattached volumes', max: 15000 },
              { label: 'Managed Databases (RDS)', value: cloudCosts.databases, key: 'databases', desc: 'Overprovisioned IOPS bounds', max: 12000 },
              { label: 'Networking & Gateways', value: cloudCosts.networking, key: 'networking', desc: 'Idle NAT Gateway channels', max: 8000 },
              { label: 'Data Transfer & Egress', value: cloudCosts.transfer, key: 'transfer', desc: 'Cross-region transfer waste', max: 5000 },
              { label: 'Dev & Testing Sandbox', value: cloudCosts.devResources, key: 'devResources', desc: 'Resources running over weekends', max: 4000 },
            ].map((sect) => (
              <div key={sect.key} className="bg-slate-900/10 border border-slate-900 rounded-2xl p-6">
                <span className="text-[10px] text-slate-500 font-mono tracking-wider block uppercase mb-1">{sect.label}</span>
                <h3 className="text-2xl font-bold text-white font-mono">{formatCurrency(sect.value)}</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">{sect.desc}</p>
                
                <div className="flex gap-2">
                  <input 
                    type="range" 
                    min="0" 
                    max={sect.max} 
                    value={sect.value}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setCloudCosts(prev => ({ ...prev, [sect.key]: val }));
                    }}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Cloud Action Brief */}
          <div className="bg-cyan-950/20 border border-cyan-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs text-cyan-400 font-mono uppercase tracking-wider block font-semibold">RECOMMENDED ACTION</span>
              <p className="text-sm font-semibold text-white">Automate Weekend De-provisioning of Non-Production Environments</p>
              <p className="text-xs text-slate-400 leading-relaxed">This will permanently downsize your dev Sandbox run-rate, recovering up to $3,400 annually with zero impact on team pipelines.</p>
            </div>
            
            <button 
              onClick={() => {
                setCloudCosts(prev => ({ ...prev, devResources: Math.round(prev.devResources * 0.4) }));
                alert('Success: Sandboxes downsized by 60%! Spend has updated across all operational graphs.');
              }}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-xs font-semibold whitespace-nowrap"
            >
              Execute Instant Downsize
            </button>
          </div>
        </div>
      )}

      {/* ================= EDIT / ADD MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-scaleUp">
            <div className="p-6 border-b border-slate-900 flex justify-between items-center">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                {editingId ? `Edit ${modalType}` : `Create New ${modalType}`}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-xs font-mono">
                CLOSE
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 space-y-4">
              
              {/* EXPENSE FORM */}
              {modalType === 'expense' && (
                <>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1 font-medium">Vendor Name</label>
                    <input 
                      type="text" 
                      required
                      value={expenseForm.vendor || ''}
                      onChange={(e) => setExpenseForm({ ...expenseForm, vendor: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1 font-medium">Amount</label>
                      <input 
                        type="number" 
                        required
                        value={expenseForm.amount || 0}
                        onChange={(e) => setExpenseForm({ ...expenseForm, amount: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1 font-medium">Category</label>
                      <input 
                        type="text" 
                        value={expenseForm.category || ''}
                        onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1 font-medium">Department</label>
                      <input 
                        type="text" 
                        value={expenseForm.department || ''}
                        onChange={(e) => setExpenseForm({ ...expenseForm, department: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1 font-medium">Audit Status</label>
                      <select 
                        value={expenseForm.status}
                        onChange={(e) => setExpenseForm({ ...expenseForm, status: e.target.value as any })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      >
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Flagged">Flagged</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* SUBSCRIPTION FORM */}
              {modalType === 'subscription' && (
                <>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1 font-medium">Vendor Name</label>
                    <input 
                      type="text" 
                      required
                      value={subForm.vendor || ''}
                      onChange={(e) => setSubForm({ ...subForm, vendor: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1 font-medium">Monthly Cost</label>
                      <input 
                        type="number" 
                        required
                        value={subForm.cost || 0}
                        onChange={(e) => setSubForm({ ...subForm, cost: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1 font-medium">Plan Name</label>
                      <input 
                        type="text" 
                        value={subForm.plan || ''}
                        onChange={(e) => setSubForm({ ...subForm, plan: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1 font-medium">Total Seats</label>
                      <input 
                        type="number" 
                        value={subForm.seats || 0}
                        onChange={(e) => setSubForm({ ...subForm, seats: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1 font-medium">Active Seats</label>
                      <input 
                        type="number" 
                        value={subForm.activeSeats || 0}
                        onChange={(e) => setSubForm({ ...subForm, activeSeats: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1 font-medium">Recommendation</label>
                      <select 
                        value={subForm.recommendation}
                        onChange={(e) => setSubForm({ ...subForm, recommendation: e.target.value as any })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      >
                        <option value="Keep">Keep</option>
                        <option value="Review">Review</option>
                        <option value="Downgrade">Downgrade</option>
                        <option value="Consolidate">Consolidate</option>
                        <option value="Renegotiate">Renegotiate</option>
                        <option value="Cancel">Cancel</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1 font-medium">Renewal Date</label>
                      <input 
                        type="date" 
                        value={subForm.renewalDate || ''}
                        onChange={(e) => setSubForm({ ...subForm, renewalDate: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white text-slate-400"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* VENDOR FORM */}
              {modalType === 'vendor' && (
                <>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1 font-medium">Vendor Name</label>
                    <input 
                      type="text" 
                      required
                      value={vendorForm.name || ''}
                      onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1 font-medium">Monthly Spend</label>
                      <input 
                        type="number" 
                        required
                        value={vendorForm.monthlySpend || 0}
                        onChange={(e) => setVendorForm({ ...vendorForm, monthlySpend: parseInt(e.target.value) || 0, contractValue: (parseInt(e.target.value) || 0) * 12 })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1 font-medium">Contract Value (Annual)</label>
                      <input 
                        type="number" 
                        value={vendorForm.contractValue || 0}
                        onChange={(e) => setVendorForm({ ...vendorForm, contractValue: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-4 border-t border-slate-900">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 bg-slate-900 text-slate-400 hover:text-white rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-xs font-semibold"
                >
                  Commit Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
