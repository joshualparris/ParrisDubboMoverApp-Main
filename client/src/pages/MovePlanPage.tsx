import * as React from 'react';
const { useEffect, useState } = React;
import { listTrips, createTrip, deleteTrip, listTripAssignments, createTripAssignment, deleteTripAssignment, updateTrip, updateTripAssignment } from '../api/trips';
import type { Trip, TripAssignment } from '../types/trips';

function MovePlanPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [editTripForm, setEditTripForm] = useState({ date: '', origin: '', destination: '', notes: '' });
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tripForm, setTripForm] = useState({ date: '', origin: '', destination: '', notes: '' });
  const [assignmentForm, setAssignmentForm] = useState({ vehicle: '', driver_name: '', passengers: '', cargo_notes: '', misc_notes: '' });
  const [assignments, setAssignments] = useState<TripAssignment[]>([]);
  const [editingAssignment, setEditingAssignment] = useState<TripAssignment | null>(null);
  const [editAssignmentForm, setEditAssignmentForm] = useState({ vehicle: '', driver_name: '', passengers: '', cargo_notes: '', misc_notes: '' });
  const [loadingAssignments, setLoadingAssignments] = useState(false);

  function refreshTrips() {
    setLoadingTrips(true);
    listTrips()
      .then(setTrips)
      .catch(() => setError('Failed to load trips'))
      .finally(() => setLoadingTrips(false));
  }

  function refreshAssignments(tripId: number) {
    setLoadingAssignments(true);
    listTripAssignments(tripId)
      .then(setAssignments)
      .catch(() => setError('Failed to load assignments'))
      .finally(() => setLoadingAssignments(false));
  }

  useEffect(() => {
    refreshTrips();
  }, []);

  useEffect(() => {
    if (selectedTripId) refreshAssignments(selectedTripId);
    else setAssignments([]);
  }, [selectedTripId]);

  function handleTripFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setTripForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleAssignmentFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setAssignmentForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleCreateTrip(e: React.FormEvent) {
    e.preventDefault();
    setLoadingTrips(true);
    createTrip({ ...tripForm, user_id: 1 })
      .then(() => { setTripForm({ date: '', origin: '', destination: '', notes: '' }); refreshTrips(); })
      .catch(() => setError('Failed to create trip'))
      .finally(() => setLoadingTrips(false));
  }

  function handleDeleteTrip(id: number) {
    setLoadingTrips(true);
    deleteTrip(id)
      .then(() => { refreshTrips(); setSelectedTripId(null); })
      .catch(() => setError('Failed to delete trip'))
      .finally(() => setLoadingTrips(false));
  }

   function handleEditTrip(trip: Trip) {
     setEditingTrip(trip);
     setEditTripForm({ date: trip.date, origin: trip.origin, destination: trip.destination, notes: trip.notes ?? '' });
   }

   function handleEditTripFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
     setEditTripForm(f => ({ ...f, [e.target.name]: e.target.value }));
   }

   function handleSaveTrip(e: React.FormEvent) {
     e.preventDefault();
     if (!editingTrip) return;
     setLoadingTrips(true);
     updateTrip(editingTrip.id, editTripForm)
       .then(updated => {
         setTrips(trips => trips.map(t => t.id === updated.id ? updated : t));
         setEditingTrip(null);
       })
       .catch(() => setError('Failed to update trip'))
       .finally(() => setLoadingTrips(false));
   }

   function handleCancelEditTrip() {
     setEditingTrip(null);
   }

  function handleCreateAssignment(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTripId) return;
    setLoadingAssignments(true);
    createTripAssignment(selectedTripId, assignmentForm)
      .then(() => { setAssignmentForm({ vehicle: '', driver_name: '', passengers: '', cargo_notes: '', misc_notes: '' }); refreshAssignments(selectedTripId); })
      .catch(() => setError('Failed to create assignment'))
      .finally(() => setLoadingAssignments(false));
  }

  function handleDeleteAssignment(id: number) {
    setLoadingAssignments(true);
    deleteTripAssignment(id)
      .then(() => selectedTripId && refreshAssignments(selectedTripId))
      .catch(() => setError('Failed to delete assignment'))
      .finally(() => setLoadingAssignments(false));
  }

   function handleEditAssignment(a: TripAssignment) {
     setEditingAssignment(a);
     setEditAssignmentForm({
       vehicle: a.vehicle,
       driver_name: a.driver_name,
       passengers: a.passengers ?? '',
       cargo_notes: a.cargo_notes ?? '',
       misc_notes: a.misc_notes ?? ''
     });
   }

   function handleEditAssignmentFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
     setEditAssignmentForm(f => ({ ...f, [e.target.name]: e.target.value }));
   }

   function handleSaveAssignment(e: React.FormEvent) {
     e.preventDefault();
     if (!editingAssignment) return;
     setLoadingAssignments(true);
    // Convert empty strings to null for nullable fields
    const payload = {
      ...editAssignmentForm,
      passengers: editAssignmentForm.passengers === '' ? null : editAssignmentForm.passengers,
      cargo_notes: editAssignmentForm.cargo_notes === '' ? null : editAssignmentForm.cargo_notes,
      misc_notes: editAssignmentForm.misc_notes === '' ? null : editAssignmentForm.misc_notes,
    };
    updateTripAssignment(editingAssignment.id, payload)
       .then(updated => {
         setAssignments(assignments => assignments.map(a => a.id === updated.id ? updated : a));
         setEditingAssignment(null);
       })
       .catch(() => setError('Failed to update assignment'))
       .finally(() => setLoadingAssignments(false));
   }

   function handleCancelEditAssignment() {
     setEditingAssignment(null);
   }

  return (
    <div className="move-plan-page">
      <h2>Move Logistics</h2>
      <div className="move-plan-layout">
        <div className="move-plan-left">
          <h3>Trips</h3>
          <form onSubmit={handleCreateTrip} className="trip-form">
            <input name="date" type="date" value={tripForm.date} onChange={handleTripFormChange} required />
            <input name="origin" placeholder="Origin" value={tripForm.origin} onChange={handleTripFormChange} required />
            <input name="destination" placeholder="Destination" value={tripForm.destination} onChange={handleTripFormChange} required />
            <textarea name="notes" placeholder="Notes" value={tripForm.notes} onChange={handleTripFormChange} />
            <button type="submit">Add Trip</button>
          </form>
          {loadingTrips ? <div>Loading...</div> : (
            <ul className="trip-list">
              {trips.map(trip => (
                <li key={trip.id}>
                  {editingTrip?.id === trip.id ? (
                    <form onSubmit={handleSaveTrip} className="trip-edit-form">
                      <input name="date" type="date" value={editTripForm.date} onChange={handleEditTripFormChange} required />
                      <input name="origin" placeholder="Origin" value={editTripForm.origin} onChange={handleEditTripFormChange} required />
                      <input name="destination" placeholder="Destination" value={editTripForm.destination} onChange={handleEditTripFormChange} required />
                      <textarea name="notes" placeholder="Notes" value={editTripForm.notes} onChange={handleEditTripFormChange} />
                      <button type="submit">Save</button>
                      <button type="button" onClick={handleCancelEditTrip}>Cancel</button>
                    </form>
                  ) : (
                    <>
                      <button onClick={() => setSelectedTripId(trip.id)} style={{ fontWeight: selectedTripId === trip.id ? 'bold' : undefined }}>
                        {trip.date}: {trip.origin} → {trip.destination}
                      </button>
                      <button onClick={() => handleEditTrip(trip)}>Edit</button>
                      <button onClick={() => handleDeleteTrip(trip.id)}>Delete</button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="move-plan-right">
          {selectedTripId && (
            <>
              <h3>People/Vehicle Matrix for Trip</h3>
              <form onSubmit={handleCreateAssignment} className="matrix-form">
                <input name="vehicle" placeholder="Vehicle" value={assignmentForm.vehicle} onChange={handleAssignmentFormChange} required />
                <input name="driver_name" placeholder="Driver" value={assignmentForm.driver_name} onChange={handleAssignmentFormChange} required />
                <input name="passengers" placeholder="Passengers" value={assignmentForm.passengers} onChange={handleAssignmentFormChange} />
                <input name="cargo_notes" placeholder="Cargo Notes" value={assignmentForm.cargo_notes} onChange={handleAssignmentFormChange} />
                <input name="misc_notes" placeholder="Misc Notes" value={assignmentForm.misc_notes} onChange={handleAssignmentFormChange} />
                <button type="submit">Add Assignment</button>
              </form>
              {loadingAssignments ? <div>Loading...</div> : (
                <ul className="assignment-list">
                  {assignments.map(a => (
                    <li key={a.id}>
                      {editingAssignment?.id === a.id ? (
                        <form onSubmit={handleSaveAssignment} className="assignment-edit-form">
                          <input name="vehicle" placeholder="Vehicle" value={editAssignmentForm.vehicle} onChange={handleEditAssignmentFormChange} required />
                          <input name="driver_name" placeholder="Driver" value={editAssignmentForm.driver_name} onChange={handleEditAssignmentFormChange} required />
                          <input name="passengers" placeholder="Passengers" value={editAssignmentForm.passengers} onChange={handleEditAssignmentFormChange} />
                          <input name="cargo_notes" placeholder="Cargo Notes" value={editAssignmentForm.cargo_notes} onChange={handleEditAssignmentFormChange} />
                          <input name="misc_notes" placeholder="Misc Notes" value={editAssignmentForm.misc_notes} onChange={handleEditAssignmentFormChange} />
                          <button type="submit">Save</button>
                          <button type="button" onClick={handleCancelEditAssignment}>Cancel</button>
                        </form>
                      ) : (
                        <>
                          <strong>{a.vehicle}</strong> - {a.driver_name}
                          {a.passengers && <span> | Passengers: {a.passengers}</span>}
                          {a.cargo_notes && <span> | Cargo: {a.cargo_notes}</span>}
                          {a.misc_notes && <span> | Notes: {a.misc_notes}</span>}
                          <button onClick={() => handleEditAssignment(a)}>Edit</button>
                          <button onClick={() => handleDeleteAssignment(a.id)}>Delete</button>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default MovePlanPage;
