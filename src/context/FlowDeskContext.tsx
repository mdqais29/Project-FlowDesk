import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, Task, Invoice, ActivityLog, UserProfile, NotificationSettings } from '../types';

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'info' | 'error' | 'warning';
}

interface FlowDeskContextType {
  clients: Client[];
  tasks: Task[];
  invoices: Invoice[];
  activities: ActivityLog[];
  profile: UserProfile;
  notifications: NotificationSettings;
  theme: 'light' | 'dark';
  toasts: ToastMessage[];
  
  // Client Operations
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
  
  // Task Operations
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  
  // Invoice Operations
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  updateInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
  sendInvoice: (id: string) => void;
  markInvoicePaid: (id: string) => void;
  
  // Settings Operations
  updateProfile: (profile: UserProfile) => void;
  updateNotifications: (notifications: NotificationSettings) => void;
  toggleTheme: () => void;
  
  // UI Toast helper
  showToast: (title: string, description: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;
}

const FlowDeskContext = createContext<FlowDeskContextType | undefined>(undefined);

const initialClients: Client[] = [
  {
    id: 'c1',
    name: 'Acme Corporation',
    contactName: 'Sarah Jenkins',
    email: 'sarah@acme.co',
    phone: '+1 (555) 234-5678',
    status: 'Active',
    project: 'Website Redesign',
    budget: 12500,
    deadline: '2026-08-15',
    paymentStatus: 'Paid',
    notes: 'Prefers minimalist visual aesthetics. High-priority client from SaaS ecosystem.',
    category: 'Design & Development'
  },
  {
    id: 'c2',
    name: 'Capsule Industries',
    contactName: 'Marcus Aurel',
    email: 'm.aurel@capsule.io',
    phone: '+1 (555) 876-5432',
    status: 'Active',
    project: 'Mobile App v2.0',
    budget: 24000,
    deadline: '2026-09-30',
    paymentStatus: 'Partial',
    notes: 'Require weekly touchpoint on Tuesdays. Focus is on smooth micro-interactions.',
    category: 'Mobile Development'
  },
  {
    id: 'c3',
    name: 'Nova Labs',
    contactName: 'Dr. Elena Rostova',
    email: 'elena@novalabs.tech',
    phone: '+1 (555) 456-7890',
    status: 'Completed',
    project: 'Brand Identity',
    budget: 8000,
    deadline: '2026-06-30',
    paymentStatus: 'Paid',
    notes: 'Extremely satisfied with the delivery. Moving into a retainer phase soon.',
    category: 'Branding & Identity'
  },
  {
    id: 'c4',
    name: 'Horizon Ventures',
    contactName: 'Liam O\'Connor',
    email: 'liam@horizon.vc',
    phone: '+1 (555) 987-6543',
    status: 'Inquiry',
    project: 'Fundraising Pitch Deck',
    budget: 4500,
    deadline: '2026-07-20',
    paymentStatus: 'Unpaid',
    notes: 'Awaiting copy assets and final investment terms spreadsheet.',
    category: 'Marketing & Presentation'
  },
  {
    id: 'c5',
    name: 'Zenith Studio',
    contactName: 'Aiko Tanaka',
    email: 'aiko@zenith.design',
    phone: '+1 (555) 345-6789',
    status: 'On Hold',
    project: 'E-commerce Portal',
    budget: 18200,
    deadline: '2026-11-10',
    paymentStatus: 'Unpaid',
    notes: 'Project paused due to internal restructuring. Expected to resume late Q3.',
    category: 'E-commerce Development'
  }
];

const initialTasks: Task[] = [
  {
    id: 't1',
    clientId: 'c3',
    clientName: 'Nova Labs',
    title: 'Deliver final brand guidelines PDF',
    priority: 'High',
    dueDate: '2026-06-25',
    status: 'Done'
  },
  {
    id: 't2',
    clientId: 'c1',
    clientName: 'Acme Corporation',
    title: 'Homepage high-fidelity mockups',
    priority: 'High',
    dueDate: '2026-07-10',
    status: 'In Progress'
  },
  {
    id: 't3',
    clientId: 'c2',
    clientName: 'Capsule Industries',
    title: 'Map user onboarding flows and wireframes',
    priority: 'Medium',
    dueDate: '2026-07-20',
    status: 'To Do'
  },
  {
    id: 't4',
    clientId: 'c4',
    clientName: 'Horizon Ventures',
    title: 'Draft content review and restructuring',
    priority: 'Low',
    dueDate: '2026-07-18',
    status: 'To Do'
  },
  {
    id: 't5',
    clientId: 'c5',
    clientName: 'Zenith Studio',
    title: 'Asset preparation and image processing',
    priority: 'Medium',
    dueDate: '2026-08-01',
    status: 'Review'
  },
  {
    id: 't6',
    clientId: 'c1',
    clientName: 'Acme Corporation',
    title: 'Setup dark mode color palette',
    priority: 'Medium',
    dueDate: '2026-07-15',
    status: 'In Progress'
  }
];

const initialInvoices: Invoice[] = [
  {
    id: 'INV-2026-001',
    clientId: 'c3',
    clientName: 'Nova Labs',
    project: 'Brand Identity',
    amount: 8000,
    issueDate: '2026-06-01',
    dueDate: '2026-06-30',
    status: 'Paid'
  },
  {
    id: 'INV-2026-002',
    clientId: 'c1',
    clientName: 'Acme Corporation',
    project: 'Website Redesign - 50% Deposit',
    amount: 6250,
    issueDate: '2026-06-15',
    dueDate: '2026-07-15',
    status: 'Paid'
  },
  {
    id: 'INV-2026-003',
    clientId: 'c2',
    clientName: 'Capsule Industries',
    project: 'Mobile App - Phase 1 Milestone',
    amount: 12000,
    issueDate: '2026-06-20',
    dueDate: '2026-07-20',
    status: 'Sent'
  },
  {
    id: 'INV-2026-004',
    clientId: 'c4',
    clientName: 'Horizon Ventures',
    project: 'Pitch Deck Consultation Fee',
    amount: 4500,
    issueDate: '2026-07-01',
    dueDate: '2026-07-31',
    status: 'Draft'
  },
  {
    id: 'INV-2026-005',
    clientId: 'c5',
    clientName: 'Zenith Studio',
    project: 'Discovery & Initial Mapping',
    amount: 3500,
    issueDate: '2026-05-10',
    dueDate: '2026-06-10',
    status: 'Overdue'
  }
];

const initialActivities: ActivityLog[] = [
  {
    id: 'act1',
    type: 'invoice',
    title: 'Invoice Paid',
    description: 'Acme Corporation paid INV-2026-002 ($6,250)',
    timestamp: '1 hour ago'
  },
  {
    id: 'act2',
    type: 'task',
    title: 'Task Completed',
    description: 'Elena Rostova marked "Deliver final brand guidelines PDF" as completed',
    timestamp: '4 hours ago'
  },
  {
    id: 'act3',
    type: 'client',
    title: 'New Client Inquiry',
    description: 'Horizon Ventures requested a "Fundraising Pitch Deck" project',
    timestamp: 'Yesterday'
  },
  {
    id: 'act4',
    type: 'invoice',
    title: 'Invoice Overdue Warning',
    description: 'Zenith Studio\'s invoice INV-2026-005 is now marked as Overdue',
    timestamp: '3 days ago'
  }
];

export const FlowDeskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('flowdesk_clients');
    return saved ? JSON.parse(saved) : initialClients;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('flowdesk_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('flowdesk_invoices');
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  const [activities, setActivities] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('flowdesk_activities');
    return saved ? JSON.parse(saved) : initialActivities;
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('flowdesk_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Alex Rivera',
      email: 'alex@flowdesk.agency',
      role: 'Creative Director',
      company: 'Rivera Design Studio',
      avatar: 'AR'
    };
  });

  const [notifications, setNotifications] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('flowdesk_notifications');
    return saved ? JSON.parse(saved) : {
      emailAlerts: true,
      taskReminders: true,
      invoicePaid: true,
      weeklyDigest: false
    };
  });

  const theme = 'dark';

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('flowdesk_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('flowdesk_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('flowdesk_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('flowdesk_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('flowdesk_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('flowdesk_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('flowdesk_theme', 'dark');
    const root = window.document.documentElement;
    root.classList.add('dark');
  }, []);

  // Toast notifications helpers
  const showToast = (title: string, description: string, type: ToastMessage['type'] = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    
    // Auto remove toast after 4 seconds
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Activity Log helper
  const addActivity = (type: ActivityLog['type'], title: string, description: string) => {
    const newActivity: ActivityLog = {
      id: `act_${Date.now()}`,
      type,
      title,
      description,
      timestamp: 'Just now'
    };
    setActivities((prev) => [newActivity, ...prev].slice(0, 20)); // Limit to 20 logs
  };

  // Client Operations
  const addClient = (newClientData: Omit<Client, 'id'>) => {
    const id = `c_${Date.now()}`;
    const newClient: Client = { ...newClientData, id };
    setClients((prev) => [newClient, ...prev]);
    addActivity('client', 'Client Added', `Added client "${newClient.name}"`);
    showToast('Success', `Client "${newClient.name}" has been created successfully.`);
  };

  const updateClient = (updatedClient: Client) => {
    setClients((prev) => prev.map((c) => (c.id === updatedClient.id ? updatedClient : c)));
    // Also update clientName in tasks and invoices
    setTasks((prev) => prev.map((t) => (t.clientId === updatedClient.id ? { ...t, clientName: updatedClient.name } : t)));
    setInvoices((prev) => prev.map((i) => (i.clientId === updatedClient.id ? { ...i, clientName: updatedClient.name } : i)));
    
    addActivity('client', 'Client Updated', `Updated client "${updatedClient.name}"`);
    showToast('Updated', `Client "${updatedClient.name}" has been updated.`);
  };

  const deleteClient = (id: string) => {
    const clientToDelete = clients.find((c) => c.id === id);
    if (!clientToDelete) return;

    setClients((prev) => prev.filter((c) => c.id !== id));
    // Optionally clean up or adjust tasks & invoices
    addActivity('client', 'Client Deleted', `Removed client "${clientToDelete.name}"`);
    showToast('Removed', `Client "${clientToDelete.name}" was deleted.`, 'warning');
  };

  // Task Operations
  const addTask = (newTaskData: Omit<Task, 'id'>) => {
    const id = `t_${Date.now()}`;
    const newTask: Task = { ...newTaskData, id };
    setTasks((prev) => [newTask, ...prev]);
    addActivity('task', 'Task Created', `Created task "${newTask.title}"`);
    showToast('Task Created', `"${newTask.title}" has been assigned.`);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    addActivity('task', 'Task Updated', `Updated task "${updatedTask.title}"`);
    showToast('Task Updated', `"${updatedTask.title}" details updated.`);
  };

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find((t) => t.id === id);
    if (!taskToDelete) return;

    setTasks((prev) => prev.filter((t) => t.id !== id));
    addActivity('task', 'Task Deleted', `Deleted task "${taskToDelete.title}"`);
    showToast('Task Deleted', `"${taskToDelete.title}" was deleted.`, 'warning');
  };

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) => prev.map((t) => {
      if (t.id === id) {
        const nextStatus = t.status === 'Done' ? 'To Do' : 'Done';
        addActivity('task', nextStatus === 'Done' ? 'Task Completed' : 'Task Reopened', 
          `Task "${t.title}" was marked as ${nextStatus === 'Done' ? 'completed' : 'todo'}`
        );
        showToast(
          nextStatus === 'Done' ? 'Task Completed 🎉' : 'Task Reopened', 
          `"${t.title}" status changed.`
        );
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  // Invoice Operations
  const addInvoice = (newInvoiceData: Omit<Invoice, 'id'>) => {
    const nextNum = invoices.length + 1;
    const id = `INV-2026-${String(nextNum).padStart(3, '0')}`;
    const newInvoice: Invoice = { ...newInvoiceData, id };
    setInvoices((prev) => [newInvoice, ...prev]);
    addActivity('invoice', 'Invoice Created', `Generated invoice ${id} for ${newInvoice.clientName}`);
    showToast('Invoice Created', `Invoice ${id} created as Draft.`);
  };

  const updateInvoice = (updatedInvoice: Invoice) => {
    setInvoices((prev) => prev.map((i) => (i.id === updatedInvoice.id ? updatedInvoice : i)));
    addActivity('invoice', 'Invoice Updated', `Updated invoice ${updatedInvoice.id}`);
    showToast('Invoice Updated', `Invoice ${updatedInvoice.id} has been modified.`);
  };

  const deleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((i) => i.id !== id));
    addActivity('invoice', 'Invoice Deleted', `Deleted invoice ${id}`);
    showToast('Invoice Deleted', `Invoice ${id} was deleted.`, 'warning');
  };

  const sendInvoice = (id: string) => {
    setInvoices((prev) => prev.map((i) => {
      if (i.id === id) {
        addActivity('invoice', 'Invoice Sent', `Emailed invoice ${id} to ${i.clientName}`);
        showToast('Invoice Sent ✉️', `Invoice ${id} has been emailed to client.`);
        return { ...i, status: i.status === 'Draft' ? 'Sent' : i.status };
      }
      return i;
    }));
  };

  const markInvoicePaid = (id: string) => {
    setInvoices((prev) => prev.map((i) => {
      if (i.id === id) {
        addActivity('invoice', 'Invoice Marked Paid', `${i.clientName} paid invoice ${id} (${i.amount})`);
        showToast('Payment Logged 💰', `Invoice ${id} was marked as fully Paid.`);
        
        // Also update client paymentStatus if relevant
        setClients((clientsPrev) => clientsPrev.map((c) => {
          if (c.id === i.clientId) {
            return { ...c, paymentStatus: 'Paid' };
          }
          return c;
        }));

        return { ...i, status: 'Paid' };
      }
      return i;
    }));
  };

  // Settings
  const updateProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    showToast('Profile Updated', 'Your profile details have been saved.');
  };

  const updateNotifications = (updatedNotifications: NotificationSettings) => {
    setNotifications(updatedNotifications);
    showToast('Notifications Updated', 'Preference updates applied.');
  };

  const toggleTheme = () => {
    // Permanently locked to dark mode
  };

  return (
    <FlowDeskContext.Provider
      value={{
        clients,
        tasks,
        invoices,
        activities,
        profile,
        notifications,
        theme,
        toasts,
        addClient,
        updateClient,
        deleteClient,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        sendInvoice,
        markInvoicePaid,
        updateProfile,
        updateNotifications,
        toggleTheme,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </FlowDeskContext.Provider>
  );
};

export const useFlowDesk = () => {
  const context = useContext(FlowDeskContext);
  if (context === undefined) {
    throw new Error('useFlowDesk must be used within a FlowDeskProvider');
  }
  return context;
};
