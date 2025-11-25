export interface Trip {
  id: number;
  user_id: number;
  date: string;
  origin: string;
  destination: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TripAssignment {
  id: number;
  trip_id: number;
  vehicle: string;
  driver_name: string;
  passengers: string | null;
  cargo_notes: string | null;
  misc_notes: string | null;
  created_at: string;
  updated_at: string;
}
