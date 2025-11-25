import React from 'react';
import { NavLink } from 'react-router-dom';

const linkStyle: React.CSSProperties = {
  display: 'block',
  padding: '8px 12px',
  color: 'inherit',
  textDecoration: 'none',
  borderRadius: 6,
};

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="nav-group">
      <div className="nav-group-title">{title}</div>
      <div className="nav-group-links">{children}</div>
    </div>
  );
}

export default function Sidebar({ collapsed }: { collapsed: boolean }) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-inner">
        <div className="sidebar-brand">PDM</div>

        <Group title="Dashboard">
          <NavLink to="/" style={({ isActive }) => ({ ...linkStyle, background: isActive ? '#eaf3ff' : undefined })} end>
            Home
          </NavLink>
          <NavLink to="/dashboard" style={({ isActive }) => ({ ...linkStyle, background: isActive ? '#eaf3ff' : undefined })}>
            Dashboard
          </NavLink>
          <NavLink to="/next-actions" style={({ isActive }) => ({ ...linkStyle, background: isActive ? '#eaf3ff' : undefined })}>
            What Next?
          </NavLink>
        </Group>

        <Group title="Logistics">
          <NavLink to="/properties" style={({ isActive }) => ({ ...linkStyle, background: isActive ? '#eaf3ff' : undefined })}>
            Properties
          </NavLink>
          <NavLink to="/move-plan" style={({ isActive }) => ({ ...linkStyle, background: isActive ? '#eaf3ff' : undefined })}>
            Move Plan
          </NavLink>
          <NavLink to="/packing" style={({ isActive }) => ({ ...linkStyle, background: isActive ? '#eaf3ff' : undefined })}>
            Packing
          </NavLink>
          <NavLink to="/trips" style={({ isActive }) => ({ ...linkStyle, background: isActive ? '#eaf3ff' : undefined })}>
            Vehicles
          </NavLink>
        </Group>

        <Group title="Family & Services">
          <NavLink to="/childcare-options" style={({ isActive }) => ({ ...linkStyle, background: isActive ? '#eaf3ff' : undefined })}>
            Childcare
          </NavLink>
          <NavLink to="/health-ndis" style={({ isActive }) => ({ ...linkStyle, background: isActive ? '#eaf3ff' : undefined })}>
            Health & NDIS
          </NavLink>
          <NavLink to="/community" style={({ isActive }) => ({ ...linkStyle, background: isActive ? '#eaf3ff' : undefined })}>
            Community
          </NavLink>
          <NavLink to="/dcs" style={({ isActive }) => ({ ...linkStyle, background: isActive ? '#eaf3ff' : undefined })}>
            DCS Work Hub
          </NavLink>
        </Group>

        <Group title="Productivity">
          <NavLink to="/tasks" style={({ isActive }) => ({ ...linkStyle, background: isActive ? '#eaf3ff' : undefined })}>
            Tasks
          </NavLink>
          <NavLink to="/documents" style={({ isActive }) => ({ ...linkStyle, background: isActive ? '#eaf3ff' : undefined })}>
            Documents
          </NavLink>
          <NavLink to="/job-options" style={({ isActive }) => ({ ...linkStyle, background: isActive ? '#eaf3ff' : undefined })}>
            Job Options
          </NavLink>
          <NavLink to="/comparison" style={({ isActive }) => ({ ...linkStyle, background: isActive ? '#eaf3ff' : undefined })}>
            Comparison
          </NavLink>
        </Group>
      </div>
    </aside>
  );
}
