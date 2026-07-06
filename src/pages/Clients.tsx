import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Plus, Search, Mail, Phone, DollarSign, Calendar, 
  ExternalLink, Trash2, Filter, AlertCircle, Building2
} from 'lucide-react';
import { useFlowDesk } from '../context/FlowDeskContext';
import { Card, CardContent, Badge, Button, Modal, Input, Label, Select, Textarea } from '../components/UIComponents';

export const Clients: React.FC = () => {
  const { clients, addClient, deleteClient } = useFlowDesk();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Completed' | 'On Hold' | 'Inquiry'>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: '',
    contactName: '',
    email: '',
    phone: '',
    status: 'Active' as const,
    project: '',
    budget: '',
    deadline: '',
    notes: '',
    category: 'Design & Development'
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;

    addClient({
      name: form.name,
      contactName: form.contactName,
      email: form.email,
      phone: form.phone || '+1 (555) 000-0000',
      status: form.status,
      project: form.project || 'General Partnership',
      budget: Number(form.budget) || 0,
      deadline: form.deadline || new Date().toISOString().split('T')[0],
      notes: form.notes,
      category: form.category
    });

    setIsAddModalOpen(false);
    // reset form
    setForm({
      name: '', contactName: '', email: '', phone: '', status: 'Active',
      project: '', budget: '', deadline: '', notes: '', category: 'Design & Development'
    });
  };

  // Filtering
  const filteredClients = clients.filter((client) => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || client.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Stagger animation setup
  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 350, damping: 25 } }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Client Directory</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
            Manage your customer accounts, active contracts, budgets, and key deadlines.
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          <span>Add Client</span>
        </Button>
      </div>

      {/* Filter and Search Bar Row */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-400">
            <Search className="w-4 h-4" />
          </span>
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search company, contact person or email..."
            className="pl-9 h-10 bg-white/50 dark:bg-zinc-900/40"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 shrink-0">
          <span className="text-xs font-semibold text-zinc-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>Status:</span>
          </span>
          {(['All', 'Active', 'Completed', 'On Hold', 'Inquiry'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                statusFilter === filter
                  ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-950 font-semibold'
                  : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900/50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Clients Cards Grid */}
      {filteredClients.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col items-center justify-center p-6 bg-white/20 dark:bg-zinc-950/20">
          <Building2 className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-3" />
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">No clients found</h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm">
            Try adjusting your search query, status filters, or add a brand new client account to start.
          </p>
          <Button onClick={() => setIsAddModalOpen(true)} variant="outline" size="sm" className="mt-4 gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Client</span>
          </Button>
        </div>
      ) : (
        <motion.div 
          variants={listVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredClients.map((client) => (
            <motion.div key={client.id} variants={cardVariants}>
              <Card className="h-full flex flex-col relative group">
                <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  {/* Top line Info */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <span className="text-[10px] text-zinc-400 font-mono tracking-wider uppercase">{client.category}</span>
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-accent-600 transition-colors truncate mt-0.5">
                          {client.name}
                        </h3>
                      </div>
                      <Badge status={client.status} className="shrink-0" />
                    </div>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                      Project: <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{client.project}</span>
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-zinc-100 dark:bg-zinc-900" />

                  {/* Mid lines Info: Contact & email */}
                  <div className="space-y-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">{client.contactName}</span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <a href={`mailto:${client.email}`} className="hover:underline hover:text-zinc-900 dark:hover:text-zinc-100 truncate">{client.email}</a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>{client.phone}</span>
                    </div>
                  </div>

                  {/* Financials & Deadline */}
                  <div className="grid grid-cols-2 gap-4 pt-1 text-xs">
                    <div className="p-2.5 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100/50 dark:border-zinc-800/40">
                      <span className="text-[10px] text-zinc-400 block mb-0.5">Contract Budget</span>
                      <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(client.budget)}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100/50 dark:border-zinc-800/40">
                      <span className="text-[10px] text-zinc-400 block mb-0.5">Target Due</span>
                      <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
                        {new Date(client.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Actions line */}
                  <div className="pt-2 flex items-center justify-between gap-2 mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/clients/${client.id}`)}
                      className="w-full text-xs font-semibold gap-1.5"
                    >
                      <span>Manage Client</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete client "${client.name}"?`)) {
                          deleteClient(client.id);
                        }
                      }}
                      className="p-2.5 rounded-lg border border-transparent text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:border-rose-100 dark:hover:border-rose-500/20 transition-all cursor-pointer"
                      title="Delete Client File"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Add Client Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create New Client Profile">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="add-name">Company Name *</Label>
              <Input
                id="add-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Stripe Inc"
                required
              />
            </div>
            <div>
              <Label htmlFor="add-category">Category / Industry</Label>
              <Select
                id="add-category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="Design & Development">Design & Development</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="Branding & Identity">Branding & Identity</option>
                <option value="E-commerce Development">E-commerce Development</option>
                <option value="Marketing & Presentation">Marketing & Presentation</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="add-contact">Primary Contact Person</Label>
              <Input
                id="add-contact"
                value={form.contactName}
                onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                placeholder="e.g. John Doe"
              />
            </div>
            <div>
              <Label htmlFor="add-email">Contact Email *</Label>
              <Input
                id="add-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="name@stripe.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="add-phone">Phone Number</Label>
              <Input
                id="add-phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div>
              <Label htmlFor="add-status">Engagement Status</Label>
              <Select
                id="add-status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
              >
                <option value="Active">Active</option>
                <option value="Inquiry">Inquiry</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="add-project">Active Project Name</Label>
              <Input
                id="add-project"
                value={form.project}
                onChange={(e) => setForm({ ...form, project: e.target.value })}
                placeholder="e.g. UI/UX Restructure"
              />
            </div>
            <div>
              <Label htmlFor="add-budget">Contract Budget ($)</Label>
              <Input
                id="add-budget"
                type="number"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                placeholder="e.g. 15000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="add-deadline">Target Completion Date</Label>
              <Input
                id="add-deadline"
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="add-notes">Internal Notes & Context</Label>
            <Textarea
              id="add-notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Prefers asynchronous communications, Slack channel handles, billing timelines..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Client Profile
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
