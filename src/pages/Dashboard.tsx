import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Users, Briefcase, CheckSquare, DollarSign, ArrowUpRight, 
  Calendar, ChevronRight, Activity, Clock, ShieldCheck
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useFlowDesk } from '../context/FlowDeskContext';
import { Card, CardContent, Badge, Button } from '../components/UIComponents';

export const Dashboard: React.FC = () => {
  const { clients, tasks, invoices, activities, profile } = useFlowDesk();
  const navigate = useNavigate();

  // 1. Calculate dynamic statistics
  const totalClients = clients.length;
  const activeProjectsCount = clients.filter(c => c.status === 'Active').length;
  const pendingTasksCount = tasks.filter(t => t.status !== 'Done').length;
  
  // Calculate total earnings from all PAID invoices
  const totalPaidInvoicesSum = invoices
    .filter(i => i.status === 'Paid')
    .reduce((sum, current) => sum + current.amount, 0);

  // Formatting currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  // 2. Mock revenue chart data (Linear/Vercel styling)
  const revenueChartData = [
    { name: 'Jan', revenue: 4000, projects: 2 },
    { name: 'Feb', revenue: 7500, projects: 3 },
    { name: 'Mar', revenue: 12000, projects: 4 },
    { name: 'Apr', revenue: 11500, projects: 3 },
    { name: 'May', revenue: 18500, projects: 5 },
    { name: 'Jun', revenue: totalPaidInvoicesSum > 0 ? totalPaidInvoicesSum : 24250, projects: totalClients },
  ];

  // 3. Select 3 urgent upcoming deadlines
  const upcomingDeadlines = [...clients]
    .filter(c => c.status === 'Active' || c.status === 'Inquiry')
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 3);

  // Stagger animation setup
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Dynamic Greetings header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Welcome back, {profile.name.split(' ')[0]}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
            Here's a snapshot of your agency, {profile.company || 'Rivera Studio'}, for today.
          </p>
        </div>
        
        {/* Date Stamp */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-xs max-w-fit">
          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Summary KPI Cards Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI: Total Clients */}
        <Card className="hover:scale-[1.01] transition-transform">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Clients</span>
              <h3 className="text-2xl font-bold font-mono tracking-tight text-zinc-900 dark:text-zinc-50">{totalClients}</h3>
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                <span>+12% vs last month</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400">
              <Users className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* KPI: Active Projects */}
        <Card className="hover:scale-[1.01] transition-transform">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Active Projects</span>
              <h3 className="text-2xl font-bold font-mono tracking-tight text-zinc-900 dark:text-zinc-50">{activeProjectsCount}</h3>
              <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-medium">
                <span>4 milestones complete</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400">
              <Briefcase className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* KPI: Pending Tasks */}
        <Card className="hover:scale-[1.01] transition-transform">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Pending Tasks</span>
              <h3 className="text-2xl font-bold font-mono tracking-tight text-zinc-900 dark:text-zinc-50">{pendingTasksCount}</h3>
              <div className="flex items-center gap-1 text-[10px] text-indigo-500 font-medium">
                <span>2 high priority remaining</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400">
              <CheckSquare className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* KPI: Monthly Earnings */}
        <Card className="hover:scale-[1.01] transition-transform">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Paid Earnings</span>
              <h3 className="text-2xl font-bold font-mono tracking-tight text-zinc-900 dark:text-zinc-50">
                {formatCurrency(totalPaidInvoicesSum > 0 ? totalPaidInvoicesSum : 14250)}
              </h3>
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                <span>+8% MoM increase</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

      </motion.div>

      {/* Main Charts & Revenue Overview area */}
      <motion.div variants={itemVariants}>
        <Card>
          <div className="p-6 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Financial Overview</h3>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">Revenue track and active projects over the last 6 months.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                <span className="w-2.5 h-2.5 rounded-xs bg-indigo-500 block" />
                <span>Monthly Revenues ($)</span>
              </span>
            </div>
          </div>
          <div className="p-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  stroke="#a1a1aa" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  stroke="#a1a1aa" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(9, 9, 11, 0.95)', 
                    borderColor: 'rgba(39, 39, 42, 0.4)', 
                    borderRadius: '8px',
                    color: '#fafafa',
                    fontSize: '11px',
                    fontFamily: 'monospace'
                  }}
                  itemStyle={{ color: '#818cf8' }}
                  labelStyle={{ color: '#fafafa', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#6366f1" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* Secondary content blocks: Recent Activity & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Recent Activities */}
        <motion.div variants={itemVariants}>
          <Card className="h-full flex flex-col">
            <div className="p-5 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Recent Activity</h3>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono">Real-time Feed</span>
            </div>
            
            <div className="p-5 flex-1 overflow-y-auto space-y-4 max-h-[360px]">
              {activities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Clock className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mb-2" />
                  <p className="text-xs text-zinc-400">No activity logged yet.</p>
                </div>
              ) : (
                activities.slice(0, 5).map((act) => (
                  <div key={act.id} className="flex gap-4 items-start group">
                    <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 shrink-0 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800 transition-colors">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">{act.title}</p>
                        <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500 shrink-0">{act.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-normal">{act.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </motion.div>

        {/* Right: Upcoming Deadlines */}
        <motion.div variants={itemVariants}>
          <Card className="h-full flex flex-col">
            <div className="p-5 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Upcoming Project Deadlines</h3>
              </div>
              <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => navigate('/clients')}>
                <span className="text-[11px]">View All</span>
                <ChevronRight className="w-3 h-3" />
              </Button>
            </div>

            <div className="p-5 flex-1 space-y-4">
              {upcomingDeadlines.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <ShieldCheck className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mb-2" />
                  <p className="text-xs text-zinc-400">All current projects delivered!</p>
                </div>
              ) : (
                upcomingDeadlines.map((client) => {
                  const daysLeft = Math.ceil((new Date(client.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  const isOverdue = daysLeft < 0;
                  
                  return (
                    <div 
                      key={client.id}
                      onClick={() => navigate(`/clients/${client.id}`)}
                      className="p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-900 hover:border-zinc-200 dark:hover:border-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-all cursor-pointer flex items-center justify-between gap-4 group"
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate group-hover:text-accent-600 transition-colors">
                            {client.name}
                          </h4>
                          <Badge status={client.status} />
                        </div>
                        <p className="text-[11px] text-zinc-400 truncate">{client.project}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300">
                          {new Date(client.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                        <p className={`text-[9px] font-medium mt-0.5 ${
                          isOverdue ? 'text-rose-500' :
                          daysLeft <= 15 ? 'text-amber-500' : 'text-emerald-500'
                        }`}>
                          {isOverdue ? 'Overdue' : `${daysLeft} days remaining`}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </motion.div>

      </div>
    </motion.div>
  );
};
