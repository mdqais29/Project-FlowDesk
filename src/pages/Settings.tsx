import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, Bell, Save, Shield, Settings as ConfigIcon
} from 'lucide-react';
import { useFlowDesk } from '../context/FlowDeskContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input, Label } from '../components/UIComponents';

export const Settings: React.FC = () => {
  const { 
    profile, updateProfile, 
    notifications, updateNotifications
  } = useFlowDesk();

  // Settings submenu tabs
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications'>('profile');

  // Form states initialized with context values
  const [profileForm, setProfileForm] = useState({
    name: profile.name,
    email: profile.email,
    role: profile.role,
    company: profile.company
  });

  const [notifForm, setNotifForm] = useState({
    emailAlerts: notifications.emailAlerts,
    taskReminders: notifications.taskReminders,
    invoicePaid: notifications.invoicePaid,
    weeklyDigest: notifications.weeklyDigest
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate simple initials for avatar
    const words = profileForm.name.trim().split(' ');
    const initials = words.map(w => w[0]).join('').substring(0, 2).toUpperCase();

    updateProfile({
      ...profileForm,
      avatar: initials || 'AR'
    });
  };

  const handleNotificationsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateNotifications(notifForm);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">System Settings</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
          Configure your personal profile details, application aesthetics, and automated workflow triggers.
        </p>
      </div>

      {/* Main Settings Panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Navigation Tabs List Left */}
        <div className="md:col-span-1 flex flex-col gap-1 text-xs">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-semibold text-left transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 font-bold'
                : 'text-zinc-400 hover:bg-zinc-50 hover:text-zinc-800 dark:hover:bg-zinc-900/50 dark:hover:text-zinc-200'
            }`}
          >
            <User className="w-4 h-4 shrink-0" />
            <span>Profile Details</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-semibold text-left transition-all cursor-pointer ${
              activeTab === 'notifications'
                ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 font-bold'
                : 'text-zinc-400 hover:bg-zinc-50 hover:text-zinc-800 dark:hover:bg-zinc-900/50 dark:hover:text-zinc-200'
            }`}
          >
            <Bell className="w-4 h-4 shrink-0" />
            <span>Notifications</span>
          </button>
        </div>

        {/* Configurations Forms Right */}
        <div className="md:col-span-3">
          
          {/* TAB: PROFILE DETAILS */}
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Agency & Profile Specifics</CardTitle>
                  <CardDescription>Configure the identifiers displayed on client portals and issued PDF bills.</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="prof-name">Full Display Name</Label>
                        <Input
                          id="prof-name"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          placeholder="e.g. Alex Rivera"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="prof-email">Notification & Billing Email</Label>
                        <Input
                          id="prof-email"
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          placeholder="alex@flowdesk.agency"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="prof-role">Professional Title</Label>
                        <Input
                          id="prof-role"
                          value={profileForm.role}
                          onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                          placeholder="e.g. Principal Consultant"
                        />
                      </div>
                      <div>
                        <Label htmlFor="prof-company">Agency / Brand Company</Label>
                        <Input
                          id="prof-company"
                          value={profileForm.company}
                          onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                          placeholder="e.g. Rivera Studio"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-900 flex justify-end">
                      <Button type="submit" size="sm" className="gap-1.5 shadow-sm">
                        <Save className="w-3.5 h-3.5" />
                        <span>Update Profile Details</span>
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* TAB: NOTIFICATIONS CONFIG */}
          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Notification Triggers</CardTitle>
                  <CardDescription>Determine what background automated events dispatch warning summaries.</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleNotificationsSubmit} className="space-y-5 text-xs text-zinc-800 dark:text-zinc-200">
                    
                    {/* Email Alerts toggle */}
                    <div className="flex items-center justify-between p-3 border border-zinc-50 dark:border-zinc-900 rounded-xl hover:bg-zinc-50/40 transition-colors">
                      <div className="space-y-0.5 max-w-sm">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100 block">Critical Email Alerts</span>
                        <span className="text-[10px] text-zinc-400">Transmit security updates and platform downtime warnings.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifForm.emailAlerts}
                        onChange={(e) => setNotifForm({ ...notifForm, emailAlerts: e.target.checked })}
                        className="w-4 h-4 text-indigo-500 border-zinc-200 focus:ring-indigo-500 rounded cursor-pointer"
                      />
                    </div>

                    {/* Task reminders toggle */}
                    <div className="flex items-center justify-between p-3 border border-zinc-50 dark:border-zinc-900 rounded-xl hover:bg-zinc-50/40 transition-colors">
                      <div className="space-y-0.5 max-w-sm">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100 block">Task Due Reminders</span>
                        <span className="text-[10px] text-zinc-400">Receive alert summaries 48 hours prior to milestone deadlines.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifForm.taskReminders}
                        onChange={(e) => setNotifForm({ ...notifForm, taskReminders: e.target.checked })}
                        className="w-4 h-4 text-indigo-500 border-zinc-200 focus:ring-indigo-500 rounded cursor-pointer"
                      />
                    </div>

                    {/* Invoice Paid toggle */}
                    <div className="flex items-center justify-between p-3 border border-zinc-50 dark:border-zinc-900 rounded-xl hover:bg-zinc-50/40 transition-colors">
                      <div className="space-y-0.5 max-w-sm">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100 block">Invoice Payment Receipts</span>
                        <span className="text-[10px] text-zinc-400">Dispatch alerts as soon as clients clear outstanding bill balances.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifForm.invoicePaid}
                        onChange={(e) => setNotifForm({ ...notifForm, invoicePaid: e.target.checked })}
                        className="w-4 h-4 text-indigo-500 border-zinc-200 focus:ring-indigo-500 rounded cursor-pointer"
                      />
                    </div>

                    {/* Weekly digest toggle */}
                    <div className="flex items-center justify-between p-3 border border-zinc-50 dark:border-zinc-900 rounded-xl hover:bg-zinc-50/40 transition-colors">
                      <div className="space-y-0.5 max-w-sm">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100 block">Weekly Performance Digest</span>
                        <span className="text-[10px] text-zinc-400">Email overall revenue progress statistics every Monday morning.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifForm.weeklyDigest}
                        onChange={(e) => setNotifForm({ ...notifForm, weeklyDigest: e.target.checked })}
                        className="w-4 h-4 text-indigo-500 border-zinc-200 focus:ring-indigo-500 rounded cursor-pointer"
                      />
                    </div>

                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-900 flex justify-end">
                      <Button type="submit" size="sm" className="gap-1.5 shadow-sm">
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Preferences</span>
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

        </div>
      </div>

    </div>
  );
};
