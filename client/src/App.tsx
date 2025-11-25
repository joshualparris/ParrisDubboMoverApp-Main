import * as React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import MovePlanPage from './pages/MovePlanPage';
import { DashboardPage } from './pages/DashboardPage';
import { TasksPage } from './pages/TasksPage';
import { DocumentsPage } from './pages/DocumentsPage';
import ComparisonDashboard from './pages/ComparisonDashboard';
import HealthNdisPage from './pages/HealthNdisPage';
import NextActionsPage from './pages/NextActionsPage';
import { DcsWorkPage } from './pages/DcsWorkPage';
import { CompliancePage } from './pages/CompliancePage';
import JobOptionsPage from './pages/JobOptionsPage';
import ChildcareOptionsPage from './pages/ChildcareOptionsPage';
import PropertiesPage from './pages/PropertiesPage';

export default function App() {
  return (
    <div>
      <header style={{ padding: 16, borderBottom: '1px solid #eee' }}>
        <h1>ParrisDubboMover App</h1>
        <nav style={{ display: 'flex', gap: 16 }}>
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/next-actions">What Next?</Link>
          <Link to="/properties">Properties</Link>
          <Link to="/job-options">Job Options</Link>
          <Link to="/childcare-options">Childcare</Link>
          <Link to="/dcs">DCS Work Hub</Link>
          <Link to="/tasks">Tasks</Link>
          <Link to="/documents">Documents</Link>
          <Link to="/move-plan">Move Plan</Link>
          <Link to="/comparison">Comparison Dashboard</Link>
          <Link to="/health-ndis">Health & NDIS</Link>
        </nav>
      </header>
      <main style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/next-actions" element={<NextActionsPage />} />
          <Route path="/job-options" element={<JobOptionsPage />} />
          <Route path="/childcare-options" element={<ChildcareOptionsPage />} />
          <Route path="/dcs" element={<DcsWorkPage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/compliance" element={<CompliancePage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/move-plan" element={<MovePlanPage />} />
          <Route path="/comparison" element={<ComparisonDashboard />} />
          <Route path="/health-ndis" element={<HealthNdisPage />} />
        </Routes>
      </main>
    </div>
  );
}
