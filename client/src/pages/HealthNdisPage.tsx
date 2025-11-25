import * as React from 'react';
const { useEffect, useState, useMemo } = React;
import { listProviders, createProvider, updateProvider, deleteProvider } from '../api/providers';
import { listAppointments, createAppointment, updateAppointment, deleteAppointment } from '../api/appointments';
import { fetchDomains } from '../api/domains';
import { fetchTasks } from '../api/tasks';
import ProviderList from '../components/ProviderList';
import ProviderFormModal from '../components/ProviderFormModal';
import AppointmentList from '../components/AppointmentList';
import AppointmentFormModal from '../components/AppointmentFormModal';
import type { Provider, Appointment, Domain, Task } from '../types/api';

export function HealthNdisPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [healthTasks, setHealthTasks] = useState<Task[]>([]);
  const [ndisTasks, setNdisTasks] = useState<Task[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // modals
  const [providerFormOpen, setProviderFormOpen] = useState(false);
  const [providerMode, setProviderMode] = useState<'create'|'edit'>('create');
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);

  const [apptFormOpen, setApptFormOpen] = useState(false);
  const [apptMode, setApptMode] = useState<'create'|'edit'>('create');
  const [editingAppt, setEditingAppt] = useState<Appointment | null>(null);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [prov, appts, doms] = await Promise.all([listProviders(), listAppointments(), fetchDomains()]);
      setProviders(prov);
      setAppointments(appts);
      setDomains(doms);

      const healthDomain = doms.find(d => d.slug === 'health_ms');
      const ndisDomain = doms.find(d => d.slug === 'ndis_therapies');
      if (healthDomain) {
        const hTasks = await fetchTasks({ domainId: healthDomain.id });
        setHealthTasks(hTasks);
      }
      if (ndisDomain) {
        const nTasks = await fetchTasks({ domainId: ndisDomain.id });
        setNdisTasks(nTasks);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  const providersById = useMemo(() => Object.fromEntries(providers.map(p => [p.id, p])), [providers]);

  // Provider handlers
  const handleAddProvider = async (data: Partial<Provider>) => {
    const created = await createProvider({ ...(data as Provider), user_id: 1 });
    setProviders(ps => [created, ...ps]);
    setProviderFormOpen(false);
  };
  const handleUpdateProvider = async (id: number, data: Partial<Provider>) => {
    const updated = await updateProvider(id, data);
    setProviders(ps => ps.map(p => p.id === updated.id ? updated : p));
    setEditingProvider(null);
    setProviderFormOpen(false);
  };
  const handleDeleteProvider = async (id: number) => {
    await deleteProvider(id);
    setProviders(ps => ps.filter(p => p.id !== id));
  };

  // Appointment handlers
  const handleAddAppointment = async (data: Partial<Appointment>) => {
    const created = await createAppointment({ ...(data as Appointment), user_id: 1 });
    setAppointments(a => [created, ...a]);
    setApptFormOpen(false);
  };
  const handleUpdateAppointment = async (id: number, data: Partial<Appointment>) => {
    const updated = await updateAppointment(id, data);
    setAppointments(a => a.map(x => x.id === updated.id ? updated : x));
    setEditingAppt(null);
    setApptFormOpen(false);
  };
  const handleDeleteAppointment = async (id: number) => {
    await deleteAppointment(id);
    setAppointments(a => a.filter(x => x.id !== id));
  };

  // Add handlers for quick task creation
  async function handleAddHealthTask() {
    const title = prompt('Enter new Health task title:');
    if (title && domains.length) {
      const healthDomain = domains.find(d => d.slug === 'health_ms');
      if (!healthDomain) return alert('Health domain not found');
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 1,
          domain_id: healthDomain.id,
          title,
          status: 'pending',
          priority: 2
        })
      });
      if (res.ok) {
        const newTask = await res.json();
        setHealthTasks(ts => [...ts, newTask]);
      }
    }
  }

  async function handleAddNdisTask() {
    const title = prompt('Enter new NDIS task title:');
    if (title && domains.length) {
      const ndisDomain = domains.find(d => d.slug === 'ndis_therapies');
      if (!ndisDomain) return alert('NDIS domain not found');
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 1,
          domain_id: ndisDomain.id,
          title,
          status: 'pending',
          priority: 2
        })
      });
      if (res.ok) {
        const newTask = await res.json();
        setNdisTasks(ts => [...ts, newTask]);
      }
    }
  }

  return (
    <div className="health-ndis-page">
      <h2>Health & NDIS</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ width: 380 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Providers</h3>
            <div>
              <button onClick={() => { setProviderMode('create'); setEditingProvider(null); setProviderFormOpen(true); }}>Add</button>
            </div>
          </div>
          <ProviderList providers={providers} onEdit={(p) => { setEditingProvider(p); setProviderMode('edit'); setProviderFormOpen(true); }} onDelete={handleDeleteProvider} />

          <div style={{ display: 'flex', alignItems: 'center', marginTop: 18 }}>
            <h4 style={{ margin: 0 }}>Health tasks</h4>
            <button style={{ marginLeft: 8 }} onClick={handleAddHealthTask}>Add</button>
          </div>
          <ul>{healthTasks.map(t => <li key={t.id}>{t.title}</li>)}</ul>

          <div style={{ display: 'flex', alignItems: 'center', marginTop: 18 }}>
            <h4 style={{ margin: 0 }}>NDIS tasks</h4>
            <button style={{ marginLeft: 8 }} onClick={handleAddNdisTask}>Add</button>
          </div>
          <ul>{ndisTasks.map(t => <li key={t.id}>{t.title}</li>)}</ul>

        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Appointments</h3>
            <div>
              <button onClick={() => { setApptMode('create'); setEditingAppt(null); setApptFormOpen(true); }}>Add</button>
            </div>
          </div>
          <AppointmentList appointments={appointments} onEdit={(a) => { setEditingAppt(a); setApptMode('edit'); setApptFormOpen(true); }} onDelete={handleDeleteAppointment} />
        </div>
      </div>

      <ProviderFormModal open={providerFormOpen} mode={providerMode} initial={editingProvider ?? undefined} onCancel={() => setProviderFormOpen(false)} onSubmit={(data) => {
        if (providerMode === 'create') handleAddProvider(data);
        else if (editingProvider) handleUpdateProvider(editingProvider.id, data);
      }} />

      <AppointmentFormModal open={apptFormOpen} mode={apptMode} initial={editingAppt ?? undefined} onCancel={() => setApptFormOpen(false)} onSubmit={(data) => {
        if (apptMode === 'create') handleAddAppointment(data);
        else if (editingAppt) handleUpdateAppointment(editingAppt.id, data);
      }} />

    </div>
  );
}

export default HealthNdisPage;
