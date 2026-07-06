import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Users, CheckSquare, FileText, Settings, 
  Menu, X, Sun, Moon, Bell, Plus, Search, ChevronDown, 
  Sparkles, ShieldCheck, LogOut, FilePlus2, UserPlus, CheckSquare2
} from 'lucide-react';
import { useFlowDesk } from '../context/FlowDeskContext';
import { Button, Modal, Input, Label, Select, Textarea } from './UIComponents';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    theme, toggleTheme, profile, clients, addClient, addTask, addInvoice, showToast
  } = useFlowDesk();
  
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [quickActionType, setQuickActionType] = useState<'none' | 'client' | 'task' | 'invoice'>('none');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Form states for Quick Creation
  const [clientForm, setClientForm] = useState({
    name: '', contactName: '', email: '', phone: '', status: 'Active' as const,
    project: '', budget: 0, deadline: '', paymentStatus: 'Unpaid' as const, notes: '', category: 'Design & Development'
  });
  const [taskForm, setTaskForm] = useState({
    clientId: '', title: '', priority: 'Medium' as const, dueDate: '', status: 'To Do' as const
  });
  const [invoiceForm, setInvoiceForm] = useState({
    clientId: '', project: '', amount: 0, issueDate: '', dueDate: '', status: 'Draft' as const
  });

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Invoices', href: '/invoices', icon: FileText },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const handleQuickClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientForm.name || !clientForm.email) {
      showToast('Error', 'Please fill in required fields.', 'error');
      return;
    }
    addClient({
      ...clientForm,
      budget: Number(clientForm.budget),
      deadline: clientForm.deadline || new Date().toISOString().split('T')[0]
    });
    setIsQuickActionOpen(false);
    setQuickActionType('none');
    // reset
    setClientForm({
      name: '', contactName: '', email: '', phone: '', status: 'Active',
      project: '', budget: 0, deadline: '', paymentStatus: 'Unpaid', notes: '', category: 'Design & Development'
    });
  };

  const handleQuickTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title || !taskForm.clientId) {
      showToast('Error', 'Please select a client and enter a task title.', 'error');
      return;
    }
    const client = clients.find(c => c.id === taskForm.clientId);
    addTask({
      ...taskForm,
      clientName: client ? client.name : 'Internal'
    });
    setIsQuickActionOpen(false);
    setQuickActionType('none');
    setTaskForm({ clientId: '', title: '', priority: 'Medium', dueDate: '', status: 'To Do' });
  };

  const handleQuickInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceForm.clientId || !invoiceForm.amount) {
      showToast('Error', 'Please select a client and enter an amount.', 'error');
      return;
    }
    const client = clients.find(c => c.id === invoiceForm.clientId);
    addInvoice({
      ...invoiceForm,
      amount: Number(invoiceForm.amount),
      clientName: client ? client.name : 'Unknown Client',
      project: invoiceForm.project || (client ? client.project : 'General Retainer')
    });
    setIsQuickActionOpen(false);
    setQuickActionType('none');
    setInvoiceForm({ clientId: '', project: '', amount: 0, issueDate: '', dueDate: '', status: 'Draft' });
  };

  // Global search filtering
  const filteredClients = searchQuery 
    ? clients.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.project.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex">
      
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 bg-zinc-950 border-r border-zinc-900 h-screen sticky top-0 shrink-0 z-20">
        {/* Brand Logo */}
        <div className="h-16 flex items-center px-6 gap-2.5 border-b border-zinc-900">
          <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-950 font-bold text-lg shadow-sm">
            F
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-zinc-50 leading-none">FlowDesk</span>
          </div>
        </div>

        {/* Workspace Display */}
        <div className="px-4 py-3 border-b border-zinc-900">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-900/50 transition-colors group cursor-pointer">
            <div className="w-6 h-6 rounded-md bg-accent-600/10 text-accent-400 flex items-center justify-center font-bold text-xs">
              {profile.company ? profile.company.substring(0, 1) : 'R'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-zinc-200 truncate">{profile.company || 'Rivera Design Studio'}</p>
              <p className="text-[10px] text-zinc-500 truncate">{profile.role || 'Creative Director'}</p>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive 
                    ? 'bg-zinc-900 text-zinc-100 border border-zinc-800 shadow-xs' 
                    : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-100'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Lower Banner / Status */}
        <div className="p-4 border-t border-zinc-900 space-y-3">
          <div className="bg-zinc-900/40 border border-zinc-900 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-accent-400" />
              <span className="text-xs font-semibold text-zinc-200">Agency Pro</span>
            </div>
            <p className="text-[10px] text-zinc-500 leading-normal">Interactive Sandbox active. Keep building and scaling.</p>
          </div>

          {/* Sign Out demo */}
          <div className="flex items-center justify-end">
            <button 
              onClick={() => showToast('Demo Sign Out', 'This is a mock application. Auth state is persisted locally.')}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MOBILE HEADER & NAVIGATION DRAWER */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative flex flex-col w-72 max-w-xs bg-zinc-950 h-full p-6 border-r border-zinc-900 shadow-xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-950 font-bold text-lg shadow-sm">
                    F
                  </div>
                  <span className="font-bold text-base tracking-tight text-zinc-50">FlowDesk</span>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-900 cursor-pointer"
                >
                  <X className="w-4 h-4 text-zinc-400" />
                </button>
              </div>

              <nav className="flex-1 space-y-1.5">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive 
                          ? 'bg-zinc-900 text-zinc-100 border border-zinc-800 shadow-xs' 
                          : 'text-zinc-400 hover:bg-zinc-900/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-auto border-t border-zinc-900 pt-4 flex items-center justify-end">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-100 flex items-center justify-center font-bold text-xs">
                    {profile.avatar}
                  </div>
                  <span className="text-xs font-semibold text-zinc-300">{profile.name}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. CORE PAGE WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 bg-zinc-950">
        {/* Core header */}
        <header className="h-16 bg-zinc-950/90 border-b border-zinc-900 sticky top-0 z-30 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 md:px-8">
          
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger menu toggle */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-100 cursor-pointer"
            >
              <Menu className="w-4.5 h-4.5" />
            </button>

            {/* Global Search Command Container */}
            <div className="relative hidden sm:block">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-500">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(e.target.value.length > 0);
                }}
                onFocus={() => setShowSearchResults(searchQuery.length > 0)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                placeholder="Search..."
                className="w-44 md:w-56 focus:w-64 md:focus:w-72 h-8.5 pl-9 pr-4 text-xs bg-zinc-900 border border-zinc-800 rounded-full text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 ease-out shadow-inner"
              />
              {/* Search Results Dropdown */}
              <AnimatePresence>
                {showSearchResults && filteredClients.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    className="absolute top-11 left-0 w-80 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 p-2 border-t-2 border-t-indigo-500"
                  >
                    <p className="text-[10px] font-mono font-semibold text-zinc-500 px-3 py-1.5 uppercase tracking-wider">Clients Found</p>
                    <div className="space-y-0.5">
                      {filteredClients.map(c => (
                        <button
                          key={c.id}
                          onClick={() => navigate(`/clients/${c.id}`)}
                          className="w-full text-left px-3 py-2 rounded-md hover:bg-zinc-900 text-xs flex flex-col gap-0.5 transition-colors cursor-pointer"
                        >
                          <span className="font-semibold text-zinc-200">{c.name}</span>
                          <span className="text-[10px] text-zinc-500">{c.project}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick action brand trigger */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setIsQuickActionOpen(true);
                setQuickActionType('none');
              }}
              className="gap-1.5 shadow-sm rounded-lg"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-xs">New Action</span>
            </Button>

            {/* Notifications panel dropdown trigger */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-100 cursor-pointer relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500" />
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl z-50 p-2 overflow-hidden"
                    >
                      <div className="p-3 border-b border-zinc-900 flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-200">Agency Events</span>
                        <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full font-medium">New</span>
                      </div>
                      <div className="max-h-64 overflow-y-auto py-1 text-xs divide-y divide-zinc-900">
                        <div className="p-3 hover:bg-zinc-900 transition-colors">
                          <p className="font-semibold text-zinc-200">Acme Corporation Redesign</p>
                          <p className="text-[10px] text-zinc-400 mt-0.5">Budget logged: $12,500. Work is active.</p>
                        </div>
                        <div className="p-3 hover:bg-zinc-900 transition-colors">
                          <p className="font-semibold text-zinc-200">Invoice payment received</p>
                          <p className="text-[10px] text-zinc-400 mt-0.5">Nova Labs settled invoice INV-2026-001 ($8,000).</p>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Avatar and Name display */}
            <div 
              onClick={() => navigate('/settings')}
              className="flex items-center gap-2 pl-2 border-l border-zinc-900 hover:opacity-80 transition-opacity cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-100 flex items-center justify-center font-bold text-xs">
                {profile.avatar || 'AR'}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-zinc-300 leading-none group-hover:text-zinc-100">{profile.name}</span>
                <span className="text-[10px] text-zinc-500 leading-none mt-1">{profile.role}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content main stage */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* 4. MODALS (Quick actions controller) */}
      <Modal
        isOpen={isQuickActionOpen}
        onClose={() => {
          setIsQuickActionOpen(false);
          setQuickActionType('none');
        }}
        title={
          quickActionType === 'none' ? 'FlowDesk Quick Launcher' :
          quickActionType === 'client' ? 'Add Client' :
          quickActionType === 'task' ? 'Add Task' : 'Generate Invoice'
        }
      >
        {quickActionType === 'none' && (
          <div className="space-y-3.5">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">What would you like to create?</p>
            <button
              onClick={() => setQuickActionType('client')}
              className="w-full p-4 border border-zinc-100 dark:border-zinc-900 rounded-xl hover:border-zinc-200 dark:hover:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 flex items-center gap-4 transition-all text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-zinc-50">Create New Client</h4>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">Register client details, emails, budgets and schedules.</p>
              </div>
            </button>

            <button
              onClick={() => setQuickActionType('task')}
              className="w-full p-4 border border-zinc-100 dark:border-zinc-900 rounded-xl hover:border-zinc-200 dark:hover:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 flex items-center gap-4 transition-all text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <CheckSquare2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-zinc-50">Assign New Task</h4>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">Assign custom priorities, due dates, and track progress.</p>
              </div>
            </button>

            <button
              onClick={() => setQuickActionType('invoice')}
              className="w-full p-4 border border-zinc-100 dark:border-zinc-900 rounded-xl hover:border-zinc-200 dark:hover:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 flex items-center gap-4 transition-all text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <FilePlus2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-zinc-50">Generate Invoice</h4>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">Prepare drafts, track outstanding budgets, and manage paid accounts.</p>
              </div>
            </button>
          </div>
        )}

        {/* Client quick create form */}
        {quickActionType === 'client' && (
          <form onSubmit={handleQuickClientSubmit} className="space-y-4">
            <div>
              <Label htmlFor="client-name">Company / Client Name *</Label>
              <Input
                id="client-name"
                value={clientForm.name}
                onChange={e => setClientForm({ ...clientForm, name: e.target.value })}
                placeholder="e.g. Acme Corp"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client-contact">Contact Person</Label>
                <Input
                  id="client-contact"
                  value={clientForm.contactName}
                  onChange={e => setClientForm({ ...clientForm, contactName: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                />
              </div>
              <div>
                <Label htmlFor="client-email">Email Address *</Label>
                <Input
                  id="client-email"
                  type="email"
                  value={clientForm.email}
                  onChange={e => setClientForm({ ...clientForm, email: e.target.value })}
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client-project">Project Name</Label>
                <Input
                  id="client-project"
                  value={clientForm.project}
                  onChange={e => setClientForm({ ...clientForm, project: e.target.value })}
                  placeholder="e.g. Website Redesign"
                />
              </div>
              <div>
                <Label htmlFor="client-budget">Project Budget ($)</Label>
                <Input
                  id="client-budget"
                  type="number"
                  value={clientForm.budget || ''}
                  onChange={e => setClientForm({ ...clientForm, budget: Number(e.target.value) })}
                  placeholder="e.g. 5000"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="client-notes">Internal Notes</Label>
              <Textarea
                id="client-notes"
                value={clientForm.notes}
                onChange={e => setClientForm({ ...clientForm, notes: e.target.value })}
                placeholder="Specific requests, billing cycles..."
              />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setQuickActionType('none')}>
                Back
              </Button>
              <Button type="submit" size="sm">
                Save Client
              </Button>
            </div>
          </form>
        )}

        {/* Task quick create form */}
        {quickActionType === 'task' && (
          <form onSubmit={handleQuickTaskSubmit} className="space-y-4">
            <div>
              <Label htmlFor="task-client">Client Relationship *</Label>
              <Select
                id="task-client"
                value={taskForm.clientId}
                onChange={e => setTaskForm({ ...taskForm, clientId: e.target.value })}
                required
              >
                <option value="">-- Choose Client --</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="task-title">Task Title *</Label>
              <Input
                id="task-title"
                value={taskForm.title}
                onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                placeholder="What needs to be done?"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="task-priority">Task Priority</Label>
                <Select
                  id="task-priority"
                  value={taskForm.priority}
                  onChange={e => setTaskForm({ ...taskForm, priority: e.target.value as any })}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="task-due">Due Date</Label>
                <Input
                  id="task-due"
                  type="date"
                  value={taskForm.dueDate}
                  onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setQuickActionType('none')}>
                Back
              </Button>
              <Button type="submit" size="sm">
                Assign Task
              </Button>
            </div>
          </form>
        )}

        {/* Invoice quick create form */}
        {quickActionType === 'invoice' && (
          <form onSubmit={handleQuickInvoiceSubmit} className="space-y-4">
            <div>
              <Label htmlFor="inv-client">Invoice Client *</Label>
              <Select
                id="inv-client"
                value={invoiceForm.clientId}
                onChange={e => setInvoiceForm({ ...invoiceForm, clientId: e.target.value })}
                required
              >
                <option value="">-- Select Client --</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="inv-project">Project Reference</Label>
                <Input
                  id="inv-project"
                  value={invoiceForm.project}
                  onChange={e => setInvoiceForm({ ...invoiceForm, project: e.target.value })}
                  placeholder="e.g. Web Design Retainer"
                />
              </div>
              <div>
                <Label htmlFor="inv-amount">Invoice Amount ($) *</Label>
                <Input
                  id="inv-amount"
                  type="number"
                  value={invoiceForm.amount || ''}
                  onChange={e => setInvoiceForm({ ...invoiceForm, amount: Number(e.target.value) })}
                  placeholder="e.g. 2500"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="inv-issue">Issue Date</Label>
                <Input
                  id="inv-issue"
                  type="date"
                  value={invoiceForm.issueDate}
                  onChange={e => setInvoiceForm({ ...invoiceForm, issueDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="inv-due">Due Date</Label>
                <Input
                  id="inv-due"
                  type="date"
                  value={invoiceForm.dueDate}
                  onChange={e => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setQuickActionType('none')}>
                Back
              </Button>
              <Button type="submit" size="sm">
                Create Invoice
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
