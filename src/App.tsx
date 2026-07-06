import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FlowDeskProvider } from './context/FlowDeskContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Clients } from './pages/Clients';
import { ClientDetails } from './pages/ClientDetails';
import { Tasks } from './pages/Tasks';
import { Invoices } from './pages/Invoices';
import { Settings } from './pages/Settings';
import { ToastContainer } from './components/UIComponents';

export default function App() {
  return (
    <FlowDeskProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:id" element={<ClientDetails />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/settings" element={<Settings />} />
            {/* Fallback navigation to Dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
        
        {/* Global Toast notifications layer */}
        <ToastContainer />
      </HashRouter>
    </FlowDeskProvider>
  );
}
