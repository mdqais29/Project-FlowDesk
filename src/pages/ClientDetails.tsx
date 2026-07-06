import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Mail, Phone, Calendar, DollarSign, Edit, 
  Trash2, Plus, CheckSquare, Clock, FileText, AlertCircle, 
  Save, Briefcase, FileClock, ClipboardList, PenLine
} from 'lucide-react';
import { useFlowDesk } from '../context/FlowDeskContext';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Modal, Input, Label, Select, Textarea } from '../components/UIComponents';

export const ClientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    clients, tasks, invoices, updateClient, deleteClient, addTask, toggleTaskStatus, deleteTask, showToast 
  } = useFlowDesk();

  const client = clients.find((c) => c.id === id);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [newTaskDue, setNewTaskDue] = useState('');

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '', contactName: '', email: '', phone: '', status: 'Active' as any,
    project: '', budget: 0, deadline: '', paymentStatus: 'Paid' as any, notes: '', category: ''
  });

  // Load client into edit form on open
  const openEditModal = () => {
    if (!client) return;
    setEditForm({
      name: client.name,
      contactName: client.contactName,
      email: client.email,
      phone: client.phone,
      status: client.status,
      project: client.project,
      budget: client.budget,
      deadline: client.deadline,
      paymentStatus: client.paymentStatus,
      notes: client.notes,
      category: client.category
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!client) return;

    updateClient({
      ...editForm,
      id: client.id,
      budget: Number(editForm.budget)
    });
    setIsEditModalOpen(false);
  };

  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!client || !newTaskTitle.trim()) return;

    addTask({
      clientId: client.id,
      clientName: client.name,
      title: newTaskTitle,
      priority: newTaskPriority,
      dueDate: newTaskDue || new Date().toISOString().split('T')[0],
      status: 'To Do'
    });

    setNewTaskTitle('');
    setNewTaskPriority('Medium');
    setNewTaskDue('');
  };

  if (!client) {
    return (
      <div className="py-16 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl max-w-lg mx-auto flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-950 shadow-sm mt-10">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Client file not found</h3>
        <p className="text-xs text-zinc-400 mt-1">
          The client reference code may have expired or been deleted. Please consult your central directory.
        </p>
        <Button onClick={() => navigate('/clients')} size="sm" className="mt-4">
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          <span>Back to Clients</span>
        </Button>
      </div>
    );
  }

  // Filter tasks & invoices specific to this client
  const clientTasks = tasks.filter((t) => t.clientId === client.id);
  const clientInvoices = invoices.filter((i) => i.clientId === client.id);

  return (
    <div className="space-y-6">
      
      {/* Back & Title line */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/clients')}
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-400 font-mono tracking-wider uppercase">{client.category}</span>
              <Badge status={client.status} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mt-1">{client.name}</h1>
          </div>
        </div>

        {/* Edit & Delete Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={openEditModal} className="gap-1.5">
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              if (confirm(`Are you sure you want to delete client "${client.name}" and all associated files?`)) {
                deleteClient(client.id);
                navigate('/clients');
              }
            }}
            className="gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete File</span>
          </Button>
        </div>
      </div>

      {/* Main Grid: Info Overview Left, Tasks/Invoices Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Information Cards */}
        <div className="lg:col-span-1 space-y-6">
          {/* Card: Client Profile info */}
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-zinc-400" />
                <span>Account Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-xs">
              
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-400 block uppercase font-mono">Contact Person</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200">{client.contactName}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-zinc-400 block uppercase font-mono">Email Address</span>
                <a href={`mailto:${client.email}`} className="text-accent-600 dark:text-accent-400 font-semibold hover:underline block truncate">
                  {client.email}
                </a>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-zinc-400 block uppercase font-mono">Phone Number</span>
                <span className="text-zinc-700 dark:text-zinc-300 font-medium">{client.phone}</span>
              </div>

              <div className="h-px bg-zinc-100 dark:bg-zinc-900" />

              <div className="space-y-1">
                <span className="text-[10px] text-zinc-400 block uppercase font-mono">Active Project</span>
                <span className="text-zinc-800 dark:text-zinc-200 font-bold">{client.project}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-400 block uppercase font-mono">Budget Allocated</span>
                  <span className="font-bold font-mono text-zinc-800 dark:text-zinc-200 text-sm">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(client.budget)}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-400 block uppercase font-mono">Target Deadline</span>
                  <span className="font-bold font-mono text-zinc-800 dark:text-zinc-200 text-sm">
                    {new Date(client.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-zinc-400 block uppercase font-mono">Payment Status</span>
                <Badge status={client.paymentStatus} />
              </div>

            </CardContent>
          </Card>

          {/* Card: Client Internal Notes */}
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <PenLine className="w-4 h-4 text-zinc-400" />
                <span>Collaboration Notes</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed space-y-3">
              {client.notes ? (
                <p className="whitespace-pre-line">{client.notes}</p>
              ) : (
                <p className="text-zinc-400 italic">No collaborative notes recorded. Write some down to guide your workflows.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Interactive Tasks & Associated Invoices */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card: Client Task Deliverables */}
          <Card>
            <CardHeader className="py-4 flex flex-row items-center justify-between border-b border-zinc-100 dark:border-zinc-900">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-zinc-400" />
                <span>Task Deliverables ({clientTasks.length})</span>
              </CardTitle>
              <span className="text-[10px] text-zinc-400 font-mono">Client-specific</span>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              
              {/* Quick Task Injector Form */}
              <form onSubmit={handleAddNewTask} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <Input
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Assign new item (e.g. Wireframe sign-off)..."
                  className="flex-1 text-xs"
                  required
                />
                <div className="flex gap-2">
                  <Select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-24 text-xs h-10"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </Select>
                  <Button type="submit" size="sm" className="gap-1 shadow-sm shrink-0">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Assign</span>
                  </Button>
                </div>
              </form>

              {/* Tasks Checklist */}
              {clientTasks.length === 0 ? (
                <div className="py-8 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col items-center justify-center p-4">
                  <CheckSquare className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mb-2" />
                  <p className="text-xs text-zinc-400">All deliverables for this client are cleared!</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {clientTasks.map((task) => (
                    <div 
                      key={task.id}
                      className="p-3 border border-zinc-100 dark:border-zinc-900 rounded-xl flex items-center justify-between gap-4 hover:border-zinc-200 dark:hover:border-zinc-800 transition-all bg-white/40 dark:bg-zinc-950/20 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          onClick={() => toggleTaskStatus(task.id)}
                          className="p-1 rounded-md text-zinc-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors cursor-pointer shrink-0"
                        >
                          <CheckSquare className={`w-4 h-4 ${task.status === 'Done' ? 'text-emerald-500 stroke-2' : ''}`} />
                        </button>
                        <div className="min-w-0">
                          <p className={`text-xs font-semibold truncate ${
                            task.status === 'Done' ? 'line-through text-zinc-400 dark:text-zinc-500' : 'text-zinc-800 dark:text-zinc-200'
                          }`}>
                            {task.title}
                          </p>
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono mt-0.5 block">
                            Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Badge status={task.priority} />
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </CardContent>
          </Card>

          {/* Card: Client Financial Accounts */}
          <Card>
            <CardHeader className="py-4 flex flex-row items-center justify-between border-b border-zinc-100 dark:border-zinc-900">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <FileClock className="w-4 h-4 text-zinc-400" />
                <span>Associated Invoices ({clientInvoices.length})</span>
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => navigate('/invoices')}>
                <span>Invoice Ledger</span>
              </Button>
            </CardHeader>
            <CardContent className="p-5">
              {clientInvoices.length === 0 ? (
                <div className="py-8 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col items-center justify-center p-4">
                  <FileText className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mb-2" />
                  <p className="text-xs text-zinc-400">No invoices generated yet for this client.</p>
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  {clientInvoices.map((inv) => (
                    <div 
                      key={inv.id}
                      onClick={() => navigate('/invoices')}
                      className="p-3 rounded-xl border border-zinc-100 dark:border-zinc-900 hover:border-zinc-200 dark:hover:border-zinc-800 transition-all flex items-center justify-between gap-4 cursor-pointer bg-white/40 dark:bg-zinc-950/20 group"
                    >
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono text-zinc-400 block">{inv.id}</span>
                        <p className="font-bold text-zinc-800 dark:text-zinc-200 truncate mt-0.5">{inv.project}</p>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <span className="font-mono font-bold text-zinc-900 dark:text-zinc-50 block">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(inv.amount)}
                          </span>
                          <span className="text-[9px] text-zinc-400">Due {new Date(inv.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                        <Badge status={inv.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Update Client Profile">
        <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-name">Company Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-category">Category / Industry</Label>
              <Select
                id="edit-category"
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
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
              <Label htmlFor="edit-contact">Contact Person</Label>
              <Input
                id="edit-contact"
                value={editForm.contactName}
                onChange={(e) => setEditForm({ ...editForm, contactName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Contact Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-phone">Phone Number</Label>
              <Input
                id="edit-phone"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-status">Engagement Status</Label>
              <Select
                id="edit-status"
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
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
              <Label htmlFor="edit-project">Active Project</Label>
              <Input
                id="edit-project"
                value={editForm.project}
                onChange={(e) => setEditForm({ ...editForm, project: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-budget">Contract Budget ($)</Label>
              <Input
                id="edit-budget"
                type="number"
                value={editForm.budget || ''}
                onChange={(e) => setEditForm({ ...editForm, budget: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-deadline">Target Completion Date</Label>
              <Input
                id="edit-deadline"
                type="date"
                value={editForm.deadline}
                onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-payment">Payment Status</Label>
              <Select
                id="edit-payment"
                value={editForm.paymentStatus}
                onChange={(e) => setEditForm({ ...editForm, paymentStatus: e.target.value as any })}
              >
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Unpaid">Unpaid</option>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="edit-notes">Internal Notes & Collaboration Guidelines</Label>
            <Textarea
              id="edit-notes"
              value={editForm.notes}
              onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="gap-1.5">
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
