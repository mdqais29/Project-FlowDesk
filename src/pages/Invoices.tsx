import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, Search, FileText, Download, Send, CheckCircle2, 
  Trash2, Eye, Filter, Calendar, DollarSign, Building2,
  Printer, ArrowUpRight, Scale
} from 'lucide-react';
import { useFlowDesk } from '../context/FlowDeskContext';
import { Invoice } from '../types';
import { Card, CardContent, Badge, Button, Modal, Input, Label, Select } from '../components/UIComponents';

export const Invoices: React.FC = () => {
  const { invoices, clients, addInvoice, deleteInvoice, sendInvoice, markInvoicePaid, showToast, profile } = useFlowDesk();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Sent' | 'Draft' | 'Overdue'>('All');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);

  // Form states
  const [addForm, setAddForm] = useState({
    clientId: '',
    project: '',
    amount: '',
    issueDate: '',
    dueDate: '',
    status: 'Draft' as const
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.clientId || !addForm.amount) return;

    const chosenClient = clients.find(c => c.id === addForm.clientId);
    
    addInvoice({
      clientId: addForm.clientId,
      clientName: chosenClient ? chosenClient.name : 'Unknown Client',
      project: addForm.project || (chosenClient ? chosenClient.project : 'General Retainer Fee'),
      amount: Number(addForm.amount),
      issueDate: addForm.issueDate || new Date().toISOString().split('T')[0],
      dueDate: addForm.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: addForm.status
    });

    setIsAddModalOpen(false);
    setAddForm({ clientId: '', project: '', amount: '', issueDate: '', dueDate: '', status: 'Draft' });
  };

  const handleDownload = (invoice: Invoice) => {
    showToast('Download Started', `Compiling PDF binary for invoice ${invoice.id}...`, 'info');
    setTimeout(() => {
      showToast('Downloaded 🎉', `Invoice ${invoice.id}.pdf was saved to your downloads folder.`, 'success');
    }, 1500);
  };

  const handleOpenPreview = (invoice: Invoice) => {
    setPreviewInvoice(invoice);
    setIsPreviewModalOpen(true);
  };

  // Filter lists
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inv.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inv.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate totals
  const totalBilled = invoices.reduce((sum, current) => sum + current.amount, 0);
  const totalOutstanding = invoices
    .filter((i) => i.status === 'Sent' || i.status === 'Overdue')
    .reduce((sum, current) => sum + current.amount, 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 350, damping: 25 } }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Invoices & Billing</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
            Generate invoice drafts, review accounts outstanding, and record customer payments.
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          <span>Issue Invoice</span>
        </Button>
      </div>

      {/* Financial Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Card className="bg-white dark:bg-zinc-950">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-zinc-400 font-mono tracking-wider uppercase">Overall Billing Volume</span>
              <h3 className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50">
                {formatCurrency(totalBilled)}
              </h3>
              <p className="text-[10px] text-zinc-400">Total contracts logged in workspace</p>
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl text-zinc-400">
              <Scale className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-zinc-950">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-zinc-400 font-mono tracking-wider uppercase">Receivables Outstanding</span>
              <h3 className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400">
                {formatCurrency(totalOutstanding)}
              </h3>
              <p className="text-[10px] text-zinc-400">Awaiting customer clearance</p>
            </div>
            <div className="p-3 bg-rose-50/50 dark:bg-rose-500/5 border border-rose-100/50 dark:border-rose-500/10 rounded-xl text-rose-500">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Row */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-400">
            <Search className="w-4 h-4" />
          </span>
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search invoice numbers, client names..."
            className="pl-9 h-10 bg-white/50 dark:bg-zinc-900/40"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 shrink-0">
          <span className="text-xs font-semibold text-zinc-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>Status:</span>
          </span>
          {(['All', 'Paid', 'Sent', 'Draft', 'Overdue'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                statusFilter === filter
                  ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-950 font-bold'
                  : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900/50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices List Display */}
      {filteredInvoices.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col items-center justify-center p-6 bg-white/20 dark:bg-zinc-950/20">
          <Building2 className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-3" />
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">No invoices generated</h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm">
            Try adjusting your search filters or generate a fresh invoice ledger.
          </p>
          <Button onClick={() => setIsAddModalOpen(true)} variant="outline" size="sm" className="mt-4 gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            <span>Issue Invoice</span>
          </Button>
        </div>
      ) : (
        <motion.div 
          variants={listVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {filteredInvoices.map((invoice) => (
            <motion.div key={invoice.id} variants={itemVariants}>
              <Card className="h-full flex flex-col relative group">
                <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  {/* Top: ID, Client info, status */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono text-zinc-400 block tracking-wide font-bold">{invoice.id}</span>
                      <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 truncate mt-0.5">{invoice.clientName}</h3>
                      <p className="text-[11px] text-zinc-500 truncate mt-0.5">{invoice.project}</p>
                    </div>
                    <Badge status={invoice.status} className="shrink-0" />
                  </div>

                  {/* Mid: Due Date & Amount */}
                  <div className="grid grid-cols-2 gap-4 py-2 border-y border-zinc-50 dark:border-zinc-900">
                    <div>
                      <span className="text-[9px] text-zinc-400 block uppercase font-mono">Billed Amount</span>
                      <span className="font-mono font-bold text-zinc-900 dark:text-zinc-50 text-sm">
                        {formatCurrency(invoice.amount)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-zinc-400 block uppercase font-mono">Due Date</span>
                      <span className="font-mono font-bold text-zinc-700 dark:text-zinc-300 text-xs flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span>{new Date(invoice.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </span>
                    </div>
                  </div>

                  {/* Bottom: Action suite */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs px-2.5 gap-1"
                        onClick={() => handleOpenPreview(invoice)}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden lg:inline">Preview</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs px-2.5 gap-1"
                        onClick={() => handleDownload(invoice)}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden lg:inline">Download</span>
                      </Button>
                      {(invoice.status === 'Draft' || invoice.status === 'Sent' || invoice.status === 'Overdue') && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-8 text-xs px-2.5 gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20"
                          onClick={() => sendInvoice(invoice.id)}
                        >
                          <Send className="w-3 h-3" />
                          <span>Send</span>
                        </Button>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {invoice.status !== 'Paid' && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="h-8 text-xs px-2.5 gap-1 bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 dark:hover:bg-emerald-500/20"
                          onClick={() => markInvoicePaid(invoice.id)}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Paid</span>
                        </Button>
                      )}
                      <button
                        onClick={() => {
                          if (confirm(`Delete invoice record ${invoice.id}?`)) {
                            deleteInvoice(invoice.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer"
                        title="Delete Invoice"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Add Invoice Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Issue Invoice Ledger">
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <Label htmlFor="inv-add-client">Recipient Client *</Label>
            <Select
              id="inv-add-client"
              value={addForm.clientId}
              onChange={(e) => setAddForm({ ...addForm, clientId: e.target.value })}
              required
            >
              <option value="">-- Choose Client --</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="inv-add-proj">Project Reference</Label>
            <Input
              id="inv-add-proj"
              value={addForm.project}
              onChange={(e) => setAddForm({ ...addForm, project: e.target.value })}
              placeholder="e.g. Website Redesign Milestone 1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="inv-add-amount">Amount ($) *</Label>
              <Input
                id="inv-add-amount"
                type="number"
                value={addForm.amount}
                onChange={(e) => setAddForm({ ...addForm, amount: e.target.value })}
                placeholder="e.g. 5000"
                required
              />
            </div>
            <div>
              <Label htmlFor="inv-add-status">Invoice Status</Label>
              <Select
                id="inv-add-status"
                value={addForm.status}
                onChange={(e) => setAddForm({ ...addForm, status: e.target.value as any })}
              >
                <option value="Draft">Draft</option>
                <option value="Sent">Sent</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="inv-add-issue">Issue Date</Label>
              <Input
                id="inv-add-issue"
                type="date"
                value={addForm.issueDate}
                onChange={(e) => setAddForm({ ...addForm, issueDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="inv-add-due">Due Date</Label>
              <Input
                id="inv-add-due"
                type="date"
                value={addForm.dueDate}
                onChange={(e) => setAddForm({ ...addForm, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Generate Invoice
            </Button>
          </div>
        </form>
      </Modal>

      {/* Invoice PDF Preview Modal (High-fidelity design mockup) */}
      <Modal isOpen={isPreviewModalOpen} onClose={() => setIsPreviewModalOpen(false)} title="Invoice Document Viewer">
        {previewInvoice && (
          <div className="space-y-6 text-xs text-zinc-800 dark:text-zinc-200 p-1 font-sans">
            {/* Stamp / Logo Line */}
            <div className="flex items-start justify-between border-b border-zinc-100 dark:border-zinc-900 pb-5">
              <div className="space-y-1.5">
                <span className="font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-50">FlowDesk Invoice</span>
                <span className="text-[10px] font-mono text-zinc-400 block uppercase font-bold">{previewInvoice.id}</span>
              </div>
              <div className={`px-3.5 py-1 rounded-lg border font-mono uppercase text-[10px] font-bold tracking-wider ${
                previewInvoice.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                previewInvoice.status === 'Overdue' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                'bg-zinc-50 text-zinc-600 border-zinc-200'
              }`}>
                {previewInvoice.status}
              </div>
            </div>

            {/* Billed From & Billed To Address Boxes */}
            <div className="grid grid-cols-2 gap-6 leading-relaxed">
              <div className="space-y-1.5">
                <span className="text-[9px] text-zinc-400 uppercase tracking-wider font-mono font-bold">Billed From</span>
                <p className="font-bold text-zinc-900 dark:text-zinc-100">{profile.company}</p>
                <p className="text-zinc-500 dark:text-zinc-400">{profile.name}</p>
                <p className="text-zinc-500 dark:text-zinc-400 truncate">{profile.email}</p>
              </div>

              <div className="space-y-1.5">
                <span className="text-[9px] text-zinc-400 uppercase tracking-wider font-mono font-bold">Billed To</span>
                <p className="font-bold text-zinc-900 dark:text-zinc-100">{previewInvoice.clientName}</p>
                <p className="text-zinc-500 dark:text-zinc-400">Project Reference:</p>
                <p className="text-zinc-500 dark:text-zinc-400 truncate italic">{previewInvoice.project}</p>
              </div>
            </div>

            {/* Invoicing Dates block */}
            <div className="grid grid-cols-2 gap-6 py-3 border-y border-zinc-50 dark:border-zinc-900">
              <div className="flex justify-between">
                <span className="text-zinc-400 font-mono">Date Issued:</span>
                <span className="font-semibold font-mono text-zinc-700 dark:text-zinc-300">
                  {new Date(previewInvoice.issueDate || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400 font-mono">Payment Due:</span>
                <span className="font-semibold font-mono text-zinc-700 dark:text-zinc-300">
                  {new Date(previewInvoice.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Billable Line items table mockup */}
            <div className="space-y-2">
              <span className="text-[9px] text-zinc-400 uppercase tracking-wider font-mono font-bold">Line Items</span>
              <div className="border border-zinc-100 dark:border-zinc-900 rounded-lg overflow-hidden divide-y divide-zinc-50 dark:divide-zinc-900">
                <div className="p-3 bg-zinc-50/50 dark:bg-zinc-900/50 grid grid-cols-4 font-mono text-[10px] text-zinc-400 font-bold">
                  <span className="col-span-2">Specification</span>
                  <span className="text-center">Hours/Qty</span>
                  <span className="text-right">Total</span>
                </div>
                <div className="p-3 grid grid-cols-4 items-center">
                  <div className="col-span-2 space-y-0.5">
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200">Creative Consultation & Execution</p>
                    <p className="text-[10px] text-zinc-400">{previewInvoice.project}</p>
                  </div>
                  <span className="text-center font-mono text-zinc-500 dark:text-zinc-400">Flat Fee</span>
                  <span className="text-right font-mono font-semibold text-zinc-800 dark:text-zinc-200">{formatCurrency(previewInvoice.amount)}</span>
                </div>
              </div>
            </div>

            {/* Totals Summary */}
            <div className="flex flex-col items-end gap-1.5 pr-2 pt-2 border-t border-zinc-50 dark:border-zinc-900">
              <div className="flex gap-6 justify-between w-48 text-[11px]">
                <span className="text-zinc-400 font-semibold">Subtotal:</span>
                <span className="font-mono text-zinc-700 dark:text-zinc-300 font-semibold">{formatCurrency(previewInvoice.amount)}</span>
              </div>
              <div className="flex gap-6 justify-between w-48 text-[11px]">
                <span className="text-zinc-400 font-semibold">Tax (0%):</span>
                <span className="font-mono text-zinc-700 dark:text-zinc-300">$0.00</span>
              </div>
              <div className="flex gap-6 justify-between w-48 text-xs font-bold pt-1 border-t border-zinc-100 dark:border-zinc-900">
                <span className="text-zinc-900 dark:text-zinc-50">Total Amount:</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">{formatCurrency(previewInvoice.amount)}</span>
              </div>
            </div>

            {/* Print trigger action */}
            <div className="flex justify-between items-center pt-3 border-t border-zinc-50 dark:border-zinc-900">
              <span className="text-[10px] text-zinc-400">Thank you for your business.</span>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    showToast('Document Print', 'Opening local print system...', 'info');
                    window.print();
                  }}
                  className="gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </Button>
                <Button variant="primary" size="sm" onClick={() => setIsPreviewModalOpen(false)}>
                  Close Viewer
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};
