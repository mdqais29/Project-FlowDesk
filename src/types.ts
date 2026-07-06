export interface Client {
  id: string;
  name: string; // Company name
  contactName: string;
  email: string;
  phone: string;
  status: 'Active' | 'On Hold' | 'Completed' | 'Inquiry';
  project: string;
  budget: number;
  deadline: string;
  paymentStatus: 'Paid' | 'Partial' | 'Unpaid';
  notes: string;
  category: string;
}

export interface Task {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  status: 'To Do' | 'In Progress' | 'Review' | 'Done';
}

export interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  project: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: 'Paid' | 'Sent' | 'Draft' | 'Overdue';
}

export interface ActivityLog {
  id: string;
  type: 'client' | 'task' | 'invoice' | 'system';
  title: string;
  description: string;
  timestamp: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  company: string;
  avatar: string;
}

export interface NotificationSettings {
  emailAlerts: boolean;
  taskReminders: boolean;
  invoicePaid: boolean;
  weeklyDigest: boolean;
}
