import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
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
import PackingPage from './pages/PackingPage';
import CommunityPage from './pages/CommunityPage';
import Sidebar from './components/Sidebar';

export default function App() {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-inner">
          <button className="sidebar-toggle" onClick={() => setCollapsed(s => !s)} aria-label="Toggle navigation">
            ☰
          </button>
          <h1 className="app-title">ParrisDubboMover</h1>
        </div>
      </header>

      <div className="app-body">
        <Sidebar collapsed={collapsed} />
        <main className="app-main">
          <div className="app-main-inner">
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
              <Route path="/packing" element={<PackingPage />} />
              <Route path="/community" element={<CommunityPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
