import * as React from 'react';
const { useEffect, useState } = React;
import {
  listProperties, createProperty, updateProperty, deleteProperty,
  listJobOptions, createJobOption, updateJobOption, deleteJobOption,
  listChildcareOptions, createChildcareOption, updateChildcareOption, deleteChildcareOption
} from '../api/comparison';
import { Property, JobOption, ChildcareOption } from '../types/api';

const ComparisonDashboard: React.FC = () => {
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
  // Properties
  const [properties, setProperties] = useState<Property[] | undefined>(undefined);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [propertyForm, setPropertyForm] = useState<Partial<Property>>({});

  // Job Options
  const [jobOptions, setJobOptions] = useState<JobOption[] | undefined>(undefined);
  const [editingJob, setEditingJob] = useState<JobOption | null>(null);
  const [jobForm, setJobForm] = useState<Partial<JobOption>>({});

  // Childcare Options
  const [childcareOptions, setChildcareOptions] = useState<ChildcareOption[] | undefined>(undefined);
  const [editingChildcare, setEditingChildcare] = useState<ChildcareOption | null>(null);
  const [childcareForm, setChildcareForm] = useState<Partial<ChildcareOption>>({});

  // Fetch data
  useEffect(() => {
    listProperties().then(setProperties);
    listJobOptions().then(setJobOptions);
    listChildcareOptions().then(setChildcareOptions);
  }, []);

  // --- Property Handlers ---
  const handlePropertySave = async () => {
    // Basic validation
    if (!propertyForm.address || propertyForm.address.trim() === '') {
      setErrorMsg('Address is required');
      return;
    }
    if (!propertyForm.type || propertyForm.type.trim() === '') {
      setErrorMsg('Type is required');
      return;
    }
    setErrorMsg(null);
    const payload = { ...propertyForm, user_id: 1 };
    try {
      if (editingProperty) {
        const updated = await updateProperty(editingProperty.id, payload);
        setProperties(props => (props ?? []).map(p => p && p.id === updated.id ? updated : p));
        setEditingProperty(null);
        setPropertyForm({});
      } else {
        const created = await createProperty(payload);
        setProperties(props => {
          const updated = [created, ...(props ?? [])];
          console.log('Property added:', created, 'All properties:', updated);
          return updated;
        });
        setPropertyForm({});
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to add property');
    }
  };
  const handlePropertyEdit = (p: Property) => {
    setEditingProperty(p);
    setPropertyForm(p);
  };
  const handlePropertyDelete = async (id: number) => {
    await deleteProperty(id);
    setProperties(props => (props ?? []).filter(p => p.id !== id));
  };

  // --- Job Option Handlers ---
  const handleJobSave = async () => {
    // Basic validation
    if (!jobForm.employer || jobForm.employer.trim() === '') {
      setErrorMsg('Employer is required');
      return;
    }
    setErrorMsg(null);
    const payload = { ...jobForm, user_id: 1 };
    try {
      if (editingJob) {
        const updated = await updateJobOption(editingJob.id, payload);
        setJobOptions(jobs => (jobs ?? []).map(j => j && j.id === updated.id ? updated : j));
        setEditingJob(null);
        setJobForm({});
      } else {
        const created = await createJobOption(payload);
        setJobOptions(jobs => {
          const updated = [created, ...(jobs ?? [])];
          console.log('Job option added:', created, 'All job options:', updated);
          return updated;
        });
        setJobForm({});
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to add job option');
    }
  };
  const handleJobEdit = (j: JobOption) => {
    setEditingJob(j);
    setJobForm(j);
  };
  const handleJobDelete = async (id: number) => {
    await deleteJobOption(id);
    setJobOptions(jobs => (jobs ?? []).filter(j => j.id !== id));
  };

  // --- Childcare Option Handlers ---
  const handleChildcareSave = async () => {
    // Basic validation
    if (!childcareForm.name || childcareForm.name.trim() === '') {
      setErrorMsg('Name is required');
      return;
    }
    setErrorMsg(null);
    const payload = { ...childcareForm, user_id: 1 };
    try {
      if (editingChildcare) {
        const updated = await updateChildcareOption(editingChildcare.id, payload);
        setChildcareOptions(opts => (opts ?? []).map(o => o && o.id === updated.id ? updated : o));
        setEditingChildcare(null);
        setChildcareForm({});
      } else {
        const created = await createChildcareOption(payload);
        setChildcareOptions(opts => {
          const updated = [created, ...(opts ?? [])];
          console.log('Childcare option added:', created, 'All childcare options:', updated);
          return updated;
        });
        setChildcareForm({});
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to add childcare option');
    }
  };
  const handleChildcareEdit = (o: ChildcareOption) => {
    setEditingChildcare(o);
    setChildcareForm(o);
  };
  const handleChildcareDelete = async (id: number) => {
    await deleteChildcareOption(id);
    setChildcareOptions(opts => (opts ?? []).filter(o => o.id !== id));
  };

  // --- Render ---
  return (
    <div className="comparison-dashboard">
      {errorMsg && <div style={{ color: 'red', marginBottom: 12 }}>{errorMsg}</div>}
      <h2>Properties</h2>
      <form onSubmit={e => { e.preventDefault(); handlePropertySave(); }}>
        <input placeholder="Address" value={propertyForm.address ?? ''} onChange={e => setPropertyForm(f => ({ ...f, address: e.target.value }))} required />
        <input placeholder="Type" value={propertyForm.type ?? ''} onChange={e => setPropertyForm(f => ({ ...f, type: e.target.value }))} />
        <input placeholder="Rent Weekly" type="number" value={propertyForm.rent_weekly ?? ''} onChange={e => setPropertyForm(f => ({ ...f, rent_weekly: Number(e.target.value) }))} />
        <input placeholder="Status" value={propertyForm.status ?? ''} onChange={e => setPropertyForm(f => ({ ...f, status: e.target.value }))} />
        <input placeholder="Notes" value={propertyForm.notes ?? ''} onChange={e => setPropertyForm(f => ({ ...f, notes: e.target.value }))} />
        <button type="submit">{editingProperty ? 'Update' : 'Add'} Property</button>
        {editingProperty && <button type="button" onClick={() => { setEditingProperty(null); setPropertyForm({}); }}>Cancel</button>}
      </form>
      <ul>
        {(properties ?? []).filter(p => !!p && p.address).map(p => (
          <li key={p.id}>
            {p.address} ({p.type}) - ${p.rent_weekly} {p.status}
            <button onClick={() => handlePropertyEdit(p)}>Edit</button>
            <button onClick={() => handlePropertyDelete(p.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h2>Job Options</h2>
      <form onSubmit={e => { e.preventDefault(); handleJobSave(); }}>
        <input placeholder="Employer" value={jobForm.employer ?? ''} onChange={e => setJobForm(f => ({ ...f, employer: e.target.value }))} required />
        <input placeholder="Role" value={jobForm.role ?? ''} onChange={e => setJobForm(f => ({ ...f, role: e.target.value }))} />
        <input placeholder="Hours/Week" type="number" value={jobForm.hours_per_week ?? ''} onChange={e => setJobForm(f => ({ ...f, hours_per_week: Number(e.target.value) }))} />
        <input placeholder="Pay Rate" type="number" value={jobForm.pay_rate_hourly ?? ''} onChange={e => setJobForm(f => ({ ...f, pay_rate_hourly: Number(e.target.value) }))} />
        <input placeholder="Status" value={jobForm.status ?? ''} onChange={e => setJobForm(f => ({ ...f, status: e.target.value }))} />
        <input placeholder="Pros" value={jobForm.pros ?? ''} onChange={e => setJobForm(f => ({ ...f, pros: e.target.value }))} />
        <input placeholder="Cons" value={jobForm.cons ?? ''} onChange={e => setJobForm(f => ({ ...f, cons: e.target.value }))} />
        <input placeholder="Notes" value={jobForm.notes ?? ''} onChange={e => setJobForm(f => ({ ...f, notes: e.target.value }))} />
        <button type="submit">{editingJob ? 'Update' : 'Add'} Job Option</button>
        {editingJob && <button type="button" onClick={() => { setEditingJob(null); setJobForm({}); }}>Cancel</button>}
      </form>
      <ul>
        {(jobOptions ?? []).filter(j => !!j && j.employer).map(j => (
          <li key={j.id}>
            {j.employer} ({j.role}) - {j.hours_per_week}h @ ${j.pay_rate_hourly} {j.status}
            <button onClick={() => handleJobEdit(j)}>Edit</button>
            <button onClick={() => handleJobDelete(j.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h2>Childcare Options</h2>
      <form onSubmit={e => { e.preventDefault(); handleChildcareSave(); }}>
        <input placeholder="Name" value={childcareForm.name ?? ''} onChange={e => setChildcareForm(f => ({ ...f, name: e.target.value }))} required />
        <input placeholder="Type" value={childcareForm.type ?? ''} onChange={e => setChildcareForm(f => ({ ...f, type: e.target.value }))} />
        <input placeholder="Location" value={childcareForm.location ?? ''} onChange={e => setChildcareForm(f => ({ ...f, location: e.target.value }))} />
        <input placeholder="Min Age (months)" type="number" value={childcareForm.min_age_months ?? ''} onChange={e => setChildcareForm(f => ({ ...f, min_age_months: Number(e.target.value) }))} />
        <input placeholder="Max Age (months)" type="number" value={childcareForm.max_age_months ?? ''} onChange={e => setChildcareForm(f => ({ ...f, max_age_months: Number(e.target.value) }))} />
        <input placeholder="Daily Fee" type="number" value={childcareForm.daily_fee ?? ''} onChange={e => setChildcareForm(f => ({ ...f, daily_fee: Number(e.target.value) }))} />
        <input placeholder="Status" value={childcareForm.status ?? ''} onChange={e => setChildcareForm(f => ({ ...f, status: e.target.value }))} />
        <input placeholder="Notes" value={childcareForm.notes ?? ''} onChange={e => setChildcareForm(f => ({ ...f, notes: e.target.value }))} />
        <button type="submit">{editingChildcare ? 'Update' : 'Add'} Childcare Option</button>
        {editingChildcare && <button type="button" onClick={() => { setEditingChildcare(null); setChildcareForm({}); }}>Cancel</button>}
      </form>
      <ul>
        {(childcareOptions ?? []).filter(o => !!o && o.name).map(o => (
          <li key={o.id}>
            {o.name} ({o.type}) - {o.location} {o.min_age_months}-{o.max_age_months}m @ ${o.daily_fee} {o.status}
            <button onClick={() => handleChildcareEdit(o)}>Edit</button>
            <button onClick={() => handleChildcareDelete(o.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ComparisonDashboard;
