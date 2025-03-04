import { create } from 'zustand';
import { Client, TimeSlot, Appointment } from '../types';
import { addDays, format, parseISO, isAfter, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Storage } from '../lib/storage';

interface BusinessInfo {
  name: string;
  address: string;
  phone: string;
  workingHours: string;
}

interface AppState {
  clients: Client[];
  timeSlots: TimeSlot[];
  appointments: Appointment[];
  businessInfo: BusinessInfo;
  
  // Reset action
  resetStore: () => void;
  
  // Client actions
  addClient: (client: Omit<Client, 'id'>) => Client;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClient: (id: string) => Client | undefined;
  
  // TimeSlot actions
  addTimeSlot: (timeSlot: Omit<TimeSlot, 'id'>) => TimeSlot;
  updateTimeSlot: (id: string, timeSlot: Partial<TimeSlot>) => void;
  deleteTimeSlot: (id: string) => void;
  getAvailableTimeSlots: () => TimeSlot[];
  
  // Appointment actions
  createAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => Appointment;
  getNextTimeSlot: (timeSlotId: string) => TimeSlot | undefined;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  cancelAppointment: (id: string) => void;
  getAppointmentsByClient: (clientId: string) => Appointment[];
  getAppointmentsByDate: (date: string) => Appointment[];
  getUpcomingAppointments: () => Appointment[];
  
  // Data initialization
  initializeData: () => Promise<void>;
}

export const formatDatePtBR = (date: string) => {
  return format(parseISO(date), 'dd/MM/yyyy', { locale: ptBR });
};

export const useAppStore = create<AppState>()((set, get) => ({
  // Reset store function
  resetStore: async () => {
    await Storage.resetStore();
    set({
      appointments: [],
      timeSlots: [],
      clients: []
    });
  },
  
  clients: [],
  timeSlots: [],
  appointments: [],
  businessInfo: {
    name: 'Giovanna Beauty Design de Sobrancelhas',
    address: 'Rua Exemplo, 123 - Bairro - Cidade/UF',
    phone: '5534991122682',
    workingHours: 'Segunda a Sexta, 9h às 18h'
  },
  
  // Initialize data from storage
  initializeData: async () => {
    const [clients, timeSlots, appointments] = await Promise.all([
      Storage.getClients(),
      Storage.getTimeSlots(),
      Storage.getAppointments()
    ]);
    
    set({
      clients,
      timeSlots,
      appointments
    });
  },
  
  // Client actions
  addClient: async (clientData) => {
    const client = { ...clientData, id: crypto.randomUUID() };
    await Storage.addClient(client);
    set((state) => ({
      clients: [...state.clients, client]
    }));
    return client;
  },
  
  updateClient: async (id, clientData) => {
    await Storage.updateClient(id, clientData);
    set((state) => ({
      clients: state.clients.map((client) => 
        client.id === id ? { ...client, ...clientData } : client
      )
    }));
  },
  
  deleteClient: async (id) => {
    await Storage.deleteClient(id);
    set((state) => ({
      clients: state.clients.filter((client) => client.id !== id)
    }));
  },
  
  getClient: (id) => {
    return get().clients.find((client) => client.id === id);
  },
  
  // TimeSlot actions
  addTimeSlot: async (timeSlotData) => {
    const timeSlot = { ...timeSlotData, id: crypto.randomUUID() };
    await Storage.addTimeSlot(timeSlot);
    set((state) => ({
      timeSlots: [...state.timeSlots, timeSlot]
    }));
    return timeSlot;
  },
  
  updateTimeSlot: async (id, timeSlotData) => {
    await Storage.updateTimeSlot(id, timeSlotData);
    set((state) => ({
      timeSlots: state.timeSlots.map((timeSlot) => 
        timeSlot.id === id ? { ...timeSlot, ...timeSlotData } : timeSlot
      )
    }));
  },
  
  deleteTimeSlot: async (id) => {
    await Storage.deleteTimeSlot(id);
    set((state) => ({
      timeSlots: state.timeSlots.filter((timeSlot) => timeSlot.id !== id)
    }));
  },
  
  getAvailableTimeSlots: () => {
    const now = new Date();
    return get().timeSlots.filter((timeSlot) => {
      // Parse the date
      const timeSlotDate = parseISO(timeSlot.date);
      
      // Check if the date is today or in the future
      const isDateValid = isAfter(timeSlotDate, startOfDay(now)) || 
                         timeSlotDate.toDateString() === now.toDateString();
      
      // If it's today, check if the time has already passed
      if (timeSlotDate.toDateString() === now.toDateString()) {
        const [hours, minutes] = timeSlot.startTime.split(':').map(Number);
        const timeSlotTime = new Date(timeSlotDate);
        timeSlotTime.setHours(hours, minutes, 0, 0);
        
        return timeSlot.isAvailable && isAfter(timeSlotTime, now);
      }
      
      return timeSlot.isAvailable && isDateValid;
    });
  },
  
  // Appointment actions
  createAppointment: async (appointmentData) => {
    const appointment = {
      ...appointmentData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    await Storage.addAppointment(appointment);

    set((state) => {
      // Mark the selected time slot as unavailable
      const updatedTimeSlots = state.timeSlots.map((slot) =>
        slot.id === appointmentData.timeSlotId
          ? { ...slot, isAvailable: false }
          : slot
      );

      // Find and mark the next 30-minute slot as unavailable
      const selectedSlot = state.timeSlots.find(
        (slot) => slot.id === appointmentData.timeSlotId
      );
      if (selectedSlot) {
        const nextSlot = state.timeSlots.find(
          (slot) =>
            slot.date === selectedSlot.date &&
            slot.startTime === selectedSlot.endTime
        );
        if (nextSlot) {
          updatedTimeSlots.forEach((slot) => {
            if (slot.id === nextSlot.id) {
              slot.isAvailable = false;
            }
          });
        }
      }

      return {
        appointments: [...state.appointments, appointment],
        timeSlots: updatedTimeSlots,
      };
    });

    return appointment;
  },

  getNextTimeSlot: (timeSlotId) => {
    const state = get();
    const currentSlot = state.timeSlots.find((slot) => slot.id === timeSlotId);
    if (!currentSlot) return undefined;

    return state.timeSlots.find(
      (slot) =>
        slot.date === currentSlot.date &&
        slot.startTime === currentSlot.endTime
    );
  },
  
  updateAppointment: async (id, appointmentData) => {
    await Storage.updateAppointment(id, appointmentData);
    set((state) => ({
      appointments: state.appointments.map((appointment) =>
        appointment.id === id ? { ...appointment, ...appointmentData } : appointment
      )
    }));
  },
  
  cancelAppointment: async (id) => {
    await Storage.deleteAppointment(id);
    set((state) => ({
      appointments: state.appointments.filter((appointment) => appointment.id !== id)
    }));
  },
  
  getAppointmentsByClient: (clientId) => {
    return get().appointments.filter((appointment) => appointment.clientId === clientId);
  },
  
  getAppointmentsByDate: (date) => {
    return get().appointments.filter((appointment) => {
      const timeSlot = get().timeSlots.find((slot) => slot.id === appointment.timeSlotId);
      return timeSlot?.date === date;
    });
  },
  
  getUpcomingAppointments: () => {
    const now = new Date();
    return get().appointments.filter((appointment) => {
      const timeSlot = get().timeSlots.find((slot) => slot.id === appointment.timeSlotId);
      if (!timeSlot) return false;
      
      const appointmentDate = parseISO(timeSlot.date);
      const [hours, minutes] = timeSlot.startTime.split(':').map(Number);
      appointmentDate.setHours(hours, minutes, 0, 0);
      
      return isAfter(appointmentDate, now);
    });
  }
}));