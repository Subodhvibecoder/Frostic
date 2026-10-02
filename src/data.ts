/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  name: string;
  preferredName: string;
  email: string;
  role: string;
  phone: string;
  country: string;
  city: string;
  bio: string;
  avatar: string;
}

export interface CompanyProfile {
  name: string;
  website: string;
  industry: string;
  companyType: string;
  headquarters: string;
  foundedYear: number;
  description: string;
  size: string;
  annualRevenue: string;
  departments: string[];
  locationsCount: number;
  teamStructure: string;
  totalTeamSize: number;
  financeTeamSize: number;
  itTeamSize: number;
  procurementTeamSize: number;
  operationsTeamSize: number;
  managementTeamSize: number;
  officeMode: string;
}

export interface Expense {
  id: string;
  vendor: string;
  amount: number;
  date: string;
  category: string;
  department: string;
  type: 'Recurring' | 'One-Time';
  frequency: string;
  owner: string;
  status: 'Active' | 'Pending' | 'Flagged';
  riskScore: number;
  insight: string;
}

export interface Subscription {
  id: string;
  vendor: string;
  plan: string;
  cost: number; // Monthly cost
  seats: number;
  activeSeats: number;
  utilization: number; // percentage
  costPerUser: number;
  renewalDate: string;
  contractStatus: 'Auto-Renew' | 'Manual' | 'Cancel on Expiry';
  owner: string;
  department: string;
  riskScore: number;
  recommendation: 'Keep' | 'Review' | 'Downgrade' | 'Consolidate' | 'Renegotiate' | 'Cancel';
  description: string;
}

export interface Vendor {
  id: string;
  name: string;
  industry: string;
  monthlySpend: number;
  contractValue: number;
  seatsCount: number;
  activeUsers: number;
  renewalDate: string;
  riskScore: number;
  recommendation: string;
  category: string;
  description: string;
}

export interface Invoice {
  id: string;
  vendor: string;
  total: number;
  billingPeriod: string;
  lineItemsCount: number;
  confidence: number;
  anomaliesCount: number;
  date: string;
  status: 'Approved' | 'Flagged' | 'Under Audit';
  anomalies: string[];
}

export interface Contract {
  id: string;
  vendor: string;
  value: number;
  startDate: string;
  endDate: string;
  renewalDate: string;
  cancellationWindow: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  terms: string;
}

export interface CloudCosts {
  compute: number;
  storage: number;
  databases: number;
  networking: number;
  transfer: number;
  devResources: number;
  idlePercent: number;
}

export interface Budget {
  department: string;
  budget: number;
  actual: number;
  remaining: number;
  forecast: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  bio: string;
}

export interface SavingsOpportunity {
  id: string;
  title: string;
  vendor: string;
  estimatedSavings: number;
  confidence: number;
  difficulty: 'Low' | 'Medium' | 'High';
  deadline: string;
  owner: string;
  status: 'New' | 'Under Review' | 'Approved' | 'In Progress' | 'Completed' | 'Dismissed';
  problem: string;
  evidence: string;
  recommendation: string;
  impact: string;
}

export interface CurrencyConfig {
  code: string;
  symbol: string;
  rate: number; // relative to USD
}

export const CURRENCIES: Record<string, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', rate: 1.0 },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92 },
  GBP: { code: 'GBP', symbol: '£', rate: 0.78 },
  NPR: { code: 'NPR', symbol: '₨', rate: 133.0 },
  INR: { code: 'INR', symbol: '₹', rate: 83.5 },
  AUD: { code: 'AUD', symbol: 'A$', rate: 1.51 },
  CAD: { code: 'CAD', symbol: 'C$', rate: 1.36 }
};

export const INITIAL_USER: UserProfile = {
  name: '',
  preferredName: '',
  email: '',
  role: 'Founder / CTO',
  phone: '',
  country: 'United States',
  city: 'San Francisco',
  bio: 'Expert in financial intelligence, enterprise architecture, and cloud operations. Passionate about empowering organizations to protect every dollar.',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop'
};

export const INITIAL_COMPANY: CompanyProfile = {
  name: '',
  website: '',
  industry: '',
  companyType: 'SaaS / B2B Enterprise',
  headquarters: 'San Francisco, CA',
  foundedYear: 2023,
  description: 'A leading provider of multi-agent orchestration infrastructure and cognitive workflows for global financial institutions, enabling real-time analytical automation.',
  size: '11–50',
  annualRevenue: '$1M - $10M',
  departments: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'IT'],
  locationsCount: 1,
  teamStructure: 'Hybrid-first organization',
  totalTeamSize: 45,
  financeTeamSize: 2,
  itTeamSize: 3,
  procurementTeamSize: 2,
  operationsTeamSize: 12,
  managementTeamSize: 8,
  officeMode: 'Hybrid'
};

export const INITIAL_OBJECTIVES = [
  'Reduce unnecessary spending',
  'Find unused subscriptions',
  'Optimize cloud costs',
  'Detect invoice anomalies',
  'Track renewals',
  'Improve budgeting'
];

export const INITIAL_TEAM: TeamMember[] = [];

export const DEMO_TEAM: TeamMember[] = [
  { id: 'tm-1', name: 'Sarah Connor', role: 'VP of Engineering', department: 'Engineering', email: 'sarah@aethertech.io', bio: 'Sarah leads infrastructure and core product development.' },
  { id: 'tm-2', name: 'Michael Scott', role: 'VP of Sales', department: 'Sales', email: 'michael@aethertech.io', bio: 'Michael leads customer expansion and commercial relationships.' },
  { id: 'tm-3', name: 'Pam Beesly', role: 'VP of Operations', department: 'Operations', email: 'pam@aethertech.io', bio: 'Pam runs corporate operations, offices, and software licenses.' },
  { id: 'tm-4', name: 'Dwight Schrute', role: 'VP of IT', department: 'IT', email: 'dwight@aethertech.io', bio: 'Dwight oversees corporate security, hardware procurement, and digital tools.' }
];

/* ================= COMPLETE EXPENSE DATA RESET ================= */
// All default INITIAL data states are reset to 0 / empty vectors
export const INITIAL_EXPENSES: Expense[] = [];
export const INITIAL_SUBSCRIPTIONS: Subscription[] = [];
export const INITIAL_VENDORS: Vendor[] = [];
export const INITIAL_INVOICES: Invoice[] = [];
export const INITIAL_CONTRACTS: Contract[] = [];

export const INITIAL_CLOUD_COSTS: CloudCosts = {
  compute: 0,
  storage: 0,
  databases: 0,
  networking: 0,
  transfer: 0,
  devResources: 0,
  idlePercent: 0
};

export const INITIAL_BUDGETS: Budget[] = [
  { department: 'Engineering', budget: 50000, actual: 0, remaining: 50000, forecast: 0 },
  { department: 'Marketing', budget: 20000, actual: 0, remaining: 20000, forecast: 0 },
  { department: 'Sales', budget: 25000, actual: 0, remaining: 25000, forecast: 0 },
  { department: 'HR', budget: 5000, actual: 0, remaining: 5000, forecast: 0 },
  { department: 'Finance', budget: 10000, actual: 0, remaining: 10000, forecast: 0 },
  { department: 'Operations', budget: 15000, actual: 0, remaining: 15000, forecast: 0 },
  { department: 'IT', budget: 12000, actual: 0, remaining: 12000, forecast: 0 }
];

export const INITIAL_SAVINGS_OPPORTUNITIES: SavingsOpportunity[] = [];

/* ================= STORE DEMO DATA IN MEMORY FOR RESTORE ACTS ================= */
export const DEMO_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    vendor: 'Amazon Web Services',
    amount: 34200,
    date: '2026-09-28',
    category: 'Cloud Infrastructure',
    department: 'Engineering',
    type: 'Recurring',
    frequency: 'Monthly',
    owner: 'Sarah Connor',
    status: 'Active',
    riskScore: 45,
    insight: 'EC2 instances show high idle capacity (average CPU < 8%). Overprovisioned storage detected in US-East-1.'
  },
  {
    id: 'exp-2',
    vendor: 'Salesforce CRM',
    amount: 18500,
    date: '2026-09-25',
    category: 'Sales Software',
    department: 'Sales',
    type: 'Recurring',
    frequency: 'Monthly',
    owner: 'Michael Scott',
    status: 'Active',
    riskScore: 20,
    insight: 'Usage is consistently high. 96% seat allocation, 88% active usage. Safe renewal recommended.'
  },
  {
    id: 'exp-3',
    vendor: 'GitHub Enterprise',
    amount: 4800,
    date: '2026-09-24',
    category: 'Developer Tools',
    department: 'Engineering',
    type: 'Recurring',
    frequency: 'Monthly',
    owner: 'Linus Torvalds',
    status: 'Active',
    riskScore: 12,
    insight: 'Healthy distribution. 160 of 170 seats occupied with high commit frequency.'
  },
  {
    id: 'exp-4',
    vendor: 'Notion Teams',
    amount: 3100,
    date: '2026-09-22',
    category: 'Productivity',
    department: 'Operations',
    type: 'Recurring',
    frequency: 'Monthly',
    owner: 'Pam Beesly',
    status: 'Flagged',
    riskScore: 78,
    insight: 'Severe seat leakage. 250 licenses purchased but 120 are dormant (no login in last 45 days).'
  },
  {
    id: 'exp-5',
    vendor: 'Slack Technologies',
    amount: 5200,
    date: '2026-09-20',
    category: 'Communication',
    department: 'Operations',
    type: 'Recurring',
    frequency: 'Monthly',
    owner: 'Pam Beesly',
    status: 'Active',
    riskScore: 15,
    insight: 'Central communication hub. High active utilization across all teams.'
  },
  {
    id: 'exp-6',
    vendor: 'Google Workspace',
    amount: 2900,
    date: '2026-09-18',
    category: 'Productivity',
    department: 'IT',
    type: 'Recurring',
    frequency: 'Monthly',
    owner: 'Dwight Schrute',
    status: 'Active',
    riskScore: 25,
    insight: 'Under-utilization of premium Google Drive accounts. 15 accounts have less than 1GB stored.'
  },
  {
    id: 'exp-7',
    vendor: 'Figma Pro',
    amount: 2100,
    date: '2026-09-15',
    category: 'Design Tools',
    department: 'Marketing',
    type: 'Recurring',
    frequency: 'Monthly',
    owner: 'Aris Tolle',
    status: 'Flagged',
    riskScore: 82,
    insight: 'Redundant overlaps. Figma accounts exist under separate Marketing and Engineering corporate sub-billing.'
  },
  {
    id: 'exp-8',
    vendor: 'Miro Boards',
    amount: 1450,
    date: '2026-09-12',
    category: 'Productivity',
    department: 'Engineering',
    type: 'Recurring',
    frequency: 'Monthly',
    owner: 'Sarah Connor',
    status: 'Flagged',
    riskScore: 68,
    insight: 'Low active engagement. Only 12 of 85 boards updated in the last 60 days.'
  },
  {
    id: 'exp-9',
    vendor: 'Zoom Enterprise',
    amount: 3500,
    date: '2026-09-10',
    category: 'Communication',
    department: 'IT',
    type: 'Recurring',
    frequency: 'Monthly',
    owner: 'Dwight Schrute',
    status: 'Active',
    riskScore: 50,
    insight: 'Duplicate tool with Slack Huddles and Google Meet. Substantial communication overhead detected.'
  },
  {
    id: 'exp-10',
    vendor: 'HubSpot Marketing',
    amount: 12500,
    date: '2026-09-08',
    category: 'Marketing Automation',
    department: 'Marketing',
    type: 'Recurring',
    frequency: 'Monthly',
    owner: 'Aris Tolle',
    status: 'Active',
    riskScore: 30,
    insight: 'Expensive premium features are dormant. Core landing page builder is highly active but lists are stale.'
  }
];

export const DEMO_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub-1',
    vendor: 'Notion Teams',
    plan: 'Enterprise Tier',
    cost: 3100,
    seats: 250,
    activeSeats: 130,
    utilization: 52,
    costPerUser: 12.4,
    renewalDate: '2026-11-15',
    contractStatus: 'Auto-Renew',
    owner: 'Pam Beesly',
    department: 'Operations',
    riskScore: 78,
    recommendation: 'Downgrade',
    description: 'Collaborative document workspace. 120 users have not accessed Notion in 45 days.'
  },
  {
    id: 'sub-2',
    vendor: 'Figma Pro',
    plan: 'Professional Organization',
    cost: 2100,
    seats: 95,
    activeSeats: 48,
    utilization: 50,
    costPerUser: 22.1,
    renewalDate: '2026-10-18',
    contractStatus: 'Auto-Renew',
    owner: 'Aris Tolle',
    department: 'Marketing',
    riskScore: 82,
    recommendation: 'Consolidate',
    description: 'Design and prototyping platform. Overlaps with Figma Enterprise subscription in Engineering.'
  },
  {
    id: 'sub-3',
    vendor: 'Zoom Enterprise',
    plan: 'Pro Plan',
    cost: 3500,
    seats: 150,
    activeSeats: 60,
    utilization: 40,
    costPerUser: 23.3,
    renewalDate: '2026-12-01',
    contractStatus: 'Manual',
    owner: 'Dwight Schrute',
    department: 'IT',
    riskScore: 65,
    recommendation: 'Review',
    description: 'Video conferencing. Significant overlap with Google Meet and Slack Huddles.'
  },
  {
    id: 'sub-4',
    vendor: 'Miro Boards',
    plan: 'Business Plan',
    cost: 1450,
    seats: 85,
    activeSeats: 30,
    utilization: 35,
    costPerUser: 17.0,
    renewalDate: '2026-11-20',
    contractStatus: 'Auto-Renew',
    owner: 'Sarah Connor',
    department: 'Engineering',
    riskScore: 68,
    recommendation: 'Cancel',
    description: 'Virtual whiteboards. Most boards are inactive. Recommend migration to Free/Figma Jam.'
  },
  {
    id: 'sub-5',
    vendor: 'Slack Technologies',
    plan: 'Plus Plan',
    cost: 5200,
    seats: 130,
    activeSeats: 128,
    utilization: 98,
    costPerUser: 40.0,
    renewalDate: '2027-02-14',
    contractStatus: 'Auto-Renew',
    owner: 'Pam Beesly',
    department: 'Operations',
    riskScore: 15,
    recommendation: 'Keep',
    description: 'Team messaging platform. Vital business operations component with high adoption.'
  },
  {
    id: 'sub-6',
    vendor: 'GitHub Enterprise',
    plan: 'Enterprise Cloud',
    cost: 4800,
    seats: 170,
    activeSeats: 160,
    utilization: 94,
    costPerUser: 28.2,
    renewalDate: '2026-12-25',
    contractStatus: 'Auto-Renew',
    owner: 'Linus Torvalds',
    department: 'Engineering',
    riskScore: 12,
    recommendation: 'Keep',
    description: 'Developer workspace and version control. Essential tool with maximum compliance.'
  }
];

export const DEMO_VENDORS: Vendor[] = [
  {
    id: 'ven-1',
    name: 'Amazon Web Services',
    industry: 'Cloud Infrastructure',
    monthlySpend: 34200,
    contractValue: 410400,
    seatsCount: 45,
    activeUsers: 41,
    renewalDate: '2027-06-30',
    riskScore: 45,
    recommendation: 'Optimize infrastructure (delete idle volumes, downsize EC2s).',
    category: 'Cloud Providers',
    description: 'Principal cloud computing provider hosting all development and production services.'
  },
  {
    id: 'ven-2',
    name: 'Salesforce CRM',
    industry: 'Sales Software',
    monthlySpend: 18500,
    contractValue: 222000,
    seatsCount: 150,
    activeUsers: 144,
    renewalDate: '2027-01-15',
    riskScore: 20,
    recommendation: 'Safe to renew. Plan to lock long-term discount during next cycle.',
    category: 'Sales Platforms',
    description: 'Core CRM pipeline, opportunity management, and customer contact engine.'
  },
  {
    id: 'ven-3',
    name: 'HubSpot',
    industry: 'Marketing Automation',
    monthlySpend: 12500,
    contractValue: 150000,
    seatsCount: 20,
    activeUsers: 12,
    renewalDate: '2026-12-10',
    riskScore: 55,
    recommendation: 'Negotiate tier downgrade. High contact list cleanup required.',
    category: 'Marketing Tools',
    description: 'Inbound marketing campaign, landing pages, newsletters, and lead captures.'
  },
  {
    id: 'ven-4',
    name: 'Slack Technologies',
    industry: 'Communication',
    monthlySpend: 5200,
    contractValue: 62400,
    seatsCount: 130,
    activeUsers: 128,
    renewalDate: '2027-02-14',
    riskScore: 15,
    recommendation: 'Safe to auto-renew. Consider switching from monthly to annual billing.',
    category: 'Communication',
    description: 'Central hub for day-to-day team communication, alerts, and integrations.'
  },
  {
    id: 'ven-5',
    name: 'Google LLC',
    industry: 'Productivity',
    monthlySpend: 2900,
    contractValue: 34800,
    seatsCount: 124,
    activeUsers: 121,
    renewalDate: '2026-11-30',
    riskScore: 25,
    recommendation: 'Reassign unused premium Google Drive accounts.',
    category: 'Productivity',
    description: 'Corporate email hosting, file storage, shared calendars, and documentation.'
  }
];

export const DEMO_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    vendor: 'Amazon Web Services',
    total: 34200,
    billingPeriod: 'Aug 1, 2026 - Aug 31, 2026',
    lineItemsCount: 35,
    confidence: 99,
    anomaliesCount: 0,
    date: '2026-09-02',
    status: 'Approved',
    anomalies: []
  },
  {
    id: 'inv-2',
    vendor: 'Notion Teams',
    total: 4500,
    billingPeriod: 'Sep 1, 2026 - Sep 30, 2026',
    lineItemsCount: 12,
    confidence: 94,
    anomaliesCount: 2,
    date: '2026-09-22',
    status: 'Flagged',
    anomalies: [
      'Duplicate Charge: Line item 4 duplicates seat additions from previous month.',
      'Price Escalation: License rate increased by 14% without notification.'
    ]
  },
  {
    id: 'inv-3',
    vendor: 'Zoom Enterprise',
    total: 4200,
    billingPeriod: 'Sep 1, 2026 - Sep 30, 2026',
    lineItemsCount: 8,
    confidence: 97,
    anomaliesCount: 1,
    date: '2026-09-10',
    status: 'Flagged',
    anomalies: [
      'Unused commitment fee: Incurred $700 charge for unused premium webinars.'
    ]
  },
  {
    id: 'inv-4',
    vendor: 'Salesforce CRM',
    total: 18500,
    billingPeriod: 'Aug 1, 2026 - Aug 31, 2026',
    lineItemsCount: 42,
    confidence: 98,
    anomaliesCount: 0,
    date: '2026-09-01',
    status: 'Approved',
    anomalies: []
  }
];

export const DEMO_CONTRACTS: Contract[] = [
  {
    id: 'con-1',
    vendor: 'Salesforce CRM',
    value: 222000,
    startDate: '2026-01-15',
    endDate: '2027-01-15',
    renewalDate: '2027-01-15',
    cancellationWindow: '30 Days Notice',
    riskLevel: 'Medium',
    terms: 'Fixed 150 seat minimum commitment. Includes Premium Premier Success tier support.'
  },
  {
    id: 'con-2',
    vendor: 'HubSpot',
    value: 150000,
    startDate: '2025-12-10',
    endDate: '2026-12-10',
    renewalDate: '2026-12-10',
    cancellationWindow: '45 Days Notice',
    riskLevel: 'High',
    terms: 'Annual contract. Limits active contacts to 50,000. Excess contacts trigger automatic billing tier spikes.'
  },
  {
    id: 'con-3',
    vendor: 'Amazon Web Services',
    value: 410400,
    startDate: '2026-07-01',
    endDate: '2027-06-30',
    renewalDate: '2027-06-30',
    cancellationWindow: 'N/A (On-Demand / Savings Plan)',
    riskLevel: 'Low',
    terms: '1-Year Compute Savings Plan offering up to 45% discount on EC2 and Lambda instances.'
  }
];

export const DEMO_CLOUD_COSTS: CloudCosts = {
  compute: 18200,
  storage: 6400,
  databases: 4800,
  networking: 2500,
  transfer: 1200,
  devResources: 1100,
  idlePercent: 35
};

export const DEMO_BUDGETS: Budget[] = [
  { department: 'Engineering', budget: 50000, actual: 44900, remaining: 5100, forecast: 46200 },
  { department: 'Marketing', budget: 20000, actual: 17200, remaining: 2800, forecast: 18100 },
  { department: 'Sales', budget: 25000, actual: 18500, remaining: 6500, forecast: 19000 },
  { department: 'HR', budget: 5000, actual: 2100, remaining: 2900, forecast: 2200 },
  { department: 'Finance', budget: 10000, actual: 8200, remaining: 1800, forecast: 8500 },
  { department: 'Operations', budget: 15000, actual: 13500, remaining: 1500, forecast: 13800 },
  { department: 'IT', budget: 12000, actual: 9900, remaining: 2100, forecast: 10100 }
];

export const DEMO_SAVINGS_OPPORTUNITIES: SavingsOpportunity[] = [
  {
    id: 'op-1',
    title: 'Notion Seat De-provisioning',
    vendor: 'Notion Teams',
    estimatedSavings: 17800,
    confidence: 95,
    difficulty: 'Low',
    deadline: '2026-11-15',
    owner: 'Pam Beesly',
    status: 'New',
    problem: '120 active licenses remain entirely dormant with no login activity in 45 days.',
    evidence: 'Frostic user audit confirms 120 of 250 seats are in a "dormant state".',
    recommendation: 'Remove the 120 inactive licenses in the upcoming billing cycle before the renewal window closes.',
    impact: 'Saves $1,480/month immediately, totaling $17,760 in recurring annual software overhead.'
  },
  {
    id: 'op-2',
    title: 'Figma Sub-billing Consolidation',
    vendor: 'Figma Pro',
    estimatedSavings: 11200,
    confidence: 90,
    difficulty: 'Medium',
    deadline: '2026-10-18',
    owner: 'Aris Tolle',
    status: 'New',
    problem: 'Marketing and Engineering design teams maintain separate corporate credit card billings.',
    evidence: 'Duplicate premium Figma organization contracts identified for aethertech.io domain.',
    recommendation: 'Merge separate plans into a unified enterprise contract to leverage volume seat discounts.',
    impact: 'Reduces cost-per-seat from $25 to $15, saving $11,200 annually while simplifying billing processes.'
  },
  {
    id: 'op-3',
    title: 'AWS EC2 Instance Downsizing',
    vendor: 'Amazon Web Services',
    estimatedSavings: 38400,
    confidence: 85,
    difficulty: 'High',
    deadline: '2026-11-01',
    owner: 'Sarah Connor',
    status: 'New',
    problem: 'EC2 instances show high idle capacity (average CPU < 8%). Overprovisioned storage detected in US-East-1.',
    evidence: 'AWS CloudWatch integration logs average CPU usage at 4.2% on multiple m5.2xlarge development VMs.',
    recommendation: 'Downsize development VMs from m5.2xlarge to t3.large during off-peak and utilize auto-scaling.',
    impact: 'Cuts infrastructure spend by $3,200/month, resulting in $38,400 of calculated annual optimizations.'
  },
  {
    id: 'op-4',
    title: 'Miro Subscription Cancellation',
    vendor: 'Miro Boards',
    estimatedSavings: 17400,
    confidence: 98,
    difficulty: 'Low',
    deadline: '2026-11-20',
    owner: 'Sarah Connor',
    status: 'New',
    problem: 'Extremely low active engagement. Only 12 of 85 boards updated in the last 60 days.',
    evidence: 'Workspace telemetry reveals only 5 active team contributors in the last month.',
    recommendation: 'Cancel the premium Miro enterprise team plan entirely and migrate critical designs to Figma Jam/Free.',
    impact: 'Instantly recovers $1,450/month ($17,400 annually) with minimal disruption.'
  }
];

export function calculateStats(
  expenses: Expense[],
  subscriptions: Subscription[],
  opportunities: SavingsOpportunity[]
) {
  const monthlyExpenses = expenses.reduce((acc, curr) => {
    return acc + curr.amount;
  }, 0);

  const totalSpend = monthlyExpenses;
  const projectedAnnualSpend = totalSpend * 12;

  const potentialSavings = opportunities
    .filter(op => op.status !== 'Completed' && op.status !== 'Dismissed')
    .reduce((acc, curr) => acc + curr.estimatedSavings, 0);

  const savingsRecovered = opportunities
    .filter(op => op.status === 'Completed')
    .reduce((acc, curr) => acc + curr.estimatedSavings, 0);

  const activeVendors = Array.from(new Set(expenses.map(e => e.vendor))).length;
  const activeSubscriptions = subscriptions.filter(s => s.recommendation !== 'Cancel' || s.cost > 0).length;

  const costEfficiency = totalSpend === 0 ? 100 : Math.round((1 - (potentialSavings / projectedAnnualSpend)) * 100);
  const financialRisk = potentialSavings > 50000 ? 'High' : potentialSavings > 20000 ? 'Medium' : 'Low';

  return {
    totalSpend,
    projectedAnnualSpend,
    potentialSavings,
    savingsRecovered,
    activeVendors,
    activeSubscriptions,
    costEfficiency: Math.max(0, Math.min(100, costEfficiency)),
    financialRisk
  };
}
