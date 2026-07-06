import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, Search, CheckSquare, Trash2, Edit, Calendar, 
  AlertCircle, Sparkles, Filter, CheckCircle2, Circle
} from 'lucide-react';
import { useFlowDesk } from '../context/FlowDeskContext';
import { Task } from '../types';
import { Card, CardContent, Badge, Button, Modal, Input, Label, Select } from '../components/UIComponents';

export const Tasks: React.FC = () => {
  const { tasks, clients, addTask, updateTask, deleteTask, toggleTaskStatus } = useFlowDesk();

  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'Low' | 'Medium' | 'High'>('All');
  const [statusTab, setStatusTab] = useState<'All' | 'To Do' | 'In Progress' | 'Review' | 'Done'>('All');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form states
  const [addForm, setAddForm] = useState({
    title: '',
    clientId: '',
    priority: 'Medium' as const,
    dueDate: '',
    status: 'To Do' as const
  });

  const [editForm, setEditForm] = useState({
    id: '',
    title: '',
    clientId: '',
    clientName: '',
    priority: 'Medium' as const,
    dueDate: '',
    status: 'To Do' as const
  });

  // Calculations
  const completedTasksCount = tasks.filter(t => t.status === 'Done').length;
  const totalTasksCount = tasks.length;
  const completionPercentage = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.title || !addForm.clientId) return;

    const chosenClient = clients.find(c => c.id === addForm.clientId);
    
    addTask({
      clientId: addForm.clientId,
      clientName: chosenClient ? chosenClient.name : 'Internal Work',
      title: addForm.title,
      priority: addForm.priority,
      dueDate: addForm.dueDate || new Date().toISOString().split('T')[0],
      status: addForm.status
    });

    setIsAddModalOpen(false);
    setAddForm({ title: '', clientId: '', priority: 'Medium', dueDate: '', status: 'To Do' });
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setEditForm({
      id: task.id,
      title: task.title,
      clientId: task.clientId,
      clientName: task.clientName,
      priority: task.priority,
      dueDate: task.dueDate,
      status: task.status
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.title || !editForm.clientId) return;

    const chosenClient = clients.find(c => c.id === editForm.clientId);

    updateTask({
      id: editForm.id,
      clientId: editForm.clientId,
      clientName: chosenClient ? chosenClient.name : editForm.clientName,
      title: editForm.title,
      priority: editForm.priority,
      dueDate: editForm.dueDate,
      status: editForm.status
    });

    setIsEditModalOpen(false);
    setEditingTask(null);
  };

  // Filter list
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          task.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    const matchesStatus = statusTab === 'All' || task.status === statusTab;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.04 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 350, damping: 25 } }
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Add trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Deliverables Planner</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
            Organize task backlogs, manage delivery priority guidelines, and log task completion.
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </Button>
      </div>

      {/* Completion Stat Progress bar banner */}
      <Card className="bg-gradient-to-r from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
        <CardContent className="p-5 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center gap-1.5 justify-center md:justify-start">
              <Sparkles className="w-4 h-4 text-accent-500" />
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Delivery Velocity</span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              You have completed <span className="font-bold text-zinc-800 dark:text-zinc-200">{completedTasksCount} of {totalTasksCount} tasks</span> ({completionPercentage}%) recorded in FlowDesk.
            </p>
          </div>

          <div className="w-full md:w-64 space-y-1.5">
            <div className="flex justify-between text-[11px] font-semibold text-zinc-400">
              <span>Overall Progress</span>
              <span className="font-mono text-zinc-700 dark:text-zinc-300">{completionPercentage}%</span>
            </div>
            <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-indigo-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters Section */}
      <div className="space-y-4">
        {/* Row 1: Search and priority filter */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-400">
              <Search className="w-4 h-4" />
            </span>
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search task titles, associated clients..."
              className="pl-9 h-10 bg-white/50 dark:bg-zinc-900/40"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto shrink-0 text-xs">
            <span className="text-zinc-400 font-semibold flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>Priority:</span>
            </span>
            {(['All', 'High', 'Medium', 'Low'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-3 py-1.5 font-medium rounded-lg border transition-all cursor-pointer ${
                  priorityFilter === p
                    ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-950 font-bold'
                    : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900/50'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Status tabs like Notion views */}
        <div className="flex border-b border-zinc-100 dark:border-zinc-900 overflow-x-auto shrink-0 pb-px gap-2">
          {(['All', 'To Do', 'In Progress', 'Review', 'Done'] as const).map((status) => {
            const count = status === 'All' ? tasks.length : tasks.filter(t => t.status === status).length;
            const isTabActive = statusTab === status;
            return (
              <button
                key={status}
                onClick={() => setStatusTab(status)}
                className={`px-4 py-2 text-xs font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isTabActive
                    ? 'border-indigo-500 text-zinc-900 dark:text-zinc-50'
                    : 'border-transparent text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                }`}
              >
                <span>{status}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isTabActive 
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400' 
                    : 'bg-zinc-50 text-zinc-400 dark:bg-zinc-900'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Task rows listing */}
      {filteredTasks.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col items-center justify-center p-6 bg-white/20 dark:bg-zinc-950/20">
          <CheckSquare className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-3" />
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">No tasks found</h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm">
            Try resetting your priority or status filters, or create a brand new task description.
          </p>
          <Button onClick={() => setIsAddModalOpen(true)} variant="outline" size="sm" className="mt-4 gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Task</span>
          </Button>
        </div>
      ) : (
        <motion.div 
          variants={listVariants}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {filteredTasks.map((task) => {
            const isDone = task.status === 'Done';
            return (
              <motion.div key={task.id} variants={itemVariants}>
                <Card className="hover:shadow-sm">
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                    {/* Left: Complete toggle + Title + due date */}
                    <div className="flex items-start gap-3.5 min-w-0">
                      <button
                        onClick={() => toggleTaskStatus(task.id)}
                        className="p-1 rounded-md text-zinc-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors cursor-pointer shrink-0 mt-0.5"
                        title={isDone ? "Mark as To Do" : "Mark as Completed"}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 stroke-2" />
                        ) : (
                          <Circle className="w-5 h-5 text-zinc-300 hover:text-indigo-500 transition-colors" />
                        )}
                      </button>

                      <div className="min-w-0 space-y-1">
                        <p className={`text-xs sm:text-sm font-semibold truncate ${
                          isDone ? 'line-through text-zinc-400 dark:text-zinc-500' : 'text-zinc-800 dark:text-zinc-100'
                        }`}>
                          {task.title}
                        </p>
                        
                        {/* Meta tags line */}
                        <div className="flex items-center gap-3 text-[10px] text-zinc-400 dark:text-zinc-500 flex-wrap">
                          <span className="font-semibold text-zinc-600 dark:text-zinc-400">{task.clientName}</span>
                          <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Badge priority + Status + Edit/Delete actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-3.5 shrink-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-900 pt-3 sm:pt-0">
                      <div className="flex items-center gap-2">
                        <Badge status={task.priority} />
                        <Badge status={task.status} />
                      </div>

                      <div className="flex items-center gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEdit(task)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors cursor-pointer"
                          title="Edit Task Details"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete task "${task.title}"?`)) {
                              deleteTask(task.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Delete Task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Add Task Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create Deliverable Task">
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <Label htmlFor="task-add-client">Client Relationship *</Label>
            <Select
              id="task-add-client"
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
            <Label htmlFor="task-add-title">Task Title / Specification *</Label>
            <Input
              id="task-add-title"
              value={addForm.title}
              onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
              placeholder="e.g. Set up typography stylesheets..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="task-add-priority">Priority Level</Label>
              <Select
                id="task-add-priority"
                value={addForm.priority}
                onChange={(e) => setAddForm({ ...addForm, priority: e.target.value as any })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="task-add-status">Working Status</Label>
              <Select
                id="task-add-status"
                value={addForm.status}
                onChange={(e) => setAddForm({ ...addForm, status: e.target.value as any })}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Done">Done</option>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="task-add-due">Due Date</Label>
            <Input
              id="task-add-due"
              type="date"
              value={addForm.dueDate}
              onChange={(e) => setAddForm({ ...addForm, dueDate: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Create Task
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Task Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Modify Task Deliverable">
        <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
          <div>
            <Label htmlFor="task-edit-client">Client Relationship</Label>
            <Select
              id="task-edit-client"
              value={editForm.clientId}
              onChange={(e) => setEditForm({ ...editForm, clientId: e.target.value })}
              required
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="task-edit-title">Task Title</Label>
            <Input
              id="task-edit-title"
              value={editForm.title}
              onInput={(e: any) => setEditForm({ ...editForm, title: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="task-edit-priority">Priority Level</Label>
              <Select
                id="task-edit-priority"
                value={editForm.priority}
                onChange={(e) => setEditForm({ ...editForm, priority: e.target.value as any })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="task-edit-status">Working Status</Label>
              <Select
                id="task-edit-status"
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Done">Done</option>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="task-edit-due">Due Date</Label>
            <Input
              id="task-edit-due"
              type="date"
              value={editForm.dueDate}
              onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
