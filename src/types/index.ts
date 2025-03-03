export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
}

export interface TimeSlot {
  id: string;
  date: string; // ISO string
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isAvailable: boolean;
}

export interface Appointment {
  id: string;
  clientId: string;
  timeSlotId: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  service: string;
  createdAt: string; // ISO string
}