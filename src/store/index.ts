import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Client, TimeSlot, Appointment } from '../types';
import { addDays, format, parseISO, isAfter, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Reset store function
      resetStore: () => {
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
      
      // Client actions
      addClient: (clientData) => {
        const client = { ...clientData, id: crypto.randomUUID() };
        set((state) => ({
          clients: [...state.clients, client]
        }));
        return client;
      },
      
      updateClient: (id, clientData) => {
        set((state) => ({
          clients: state.clients.map((client) => 
            client.id === id ? { ...client, ...clientData } : client
          )
        }));
      },
      
      deleteClient: (id) => {
        set((state) => ({
          clients: state.clients.filter((client) => client.id !== id)
        }));
      },
      
      getClient: (id) => {
        return get().clients.find((client) => client.id === id);
      },
      
      // TimeSlot actions
      addTimeSlot: (timeSlotData) => {
        const timeSlot = { ...timeSlotData, id: crypto.randomUUID() };
        set((state) => ({
          timeSlots: [...state.timeSlots, timeSlot]
        }));
        return timeSlot;
      },
      
      updateTimeSlot: (id, timeSlotData) => {
        set((state) => ({
          timeSlots: state.timeSlots.map((timeSlot) => 
            timeSlot.id === id ? { ...timeSlot, ...timeSlotData } : timeSlot
          )
        }));
      },
      
      deleteTimeSlot: (id) => {
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
      createAppointment: (appointmentData) => {
        const appointment = {
          ...appointmentData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };

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
      
      updateAppointment: (id, appointmentData) => {
        set((state) => ({
          appointments: state.appointments.map((appointment) => 
            appointment.id === id ? { ...appointment, ...appointmentData } : appointment
          )
        }));
      },
      
      cancelAppointment: (id) => {
        const appointment = get().appointments.find(a => a.id === id);
        if (appointment) {
          // Make the time slot available again
          get().updateTimeSlot(appointment.timeSlotId, { isAvailable: true });
          
          set((state) => ({
            appointments: state.appointments.map((a) => 
              a.id === id ? { ...a, status: 'cancelled' } : a
            )
          }));
        }
      },
      
      getAppointmentsByClient: (clientId) => {
        return get().appointments.filter((appointment) => appointment.clientId === clientId);
      },
      
      getAppointmentsByDate: (date) => {
        const timeSlots = get().timeSlots.filter(slot => slot.date === date);
        const timeSlotIds = timeSlots.map(slot => slot.id);
        
        return get().appointments.filter(
          appointment => timeSlotIds.includes(appointment.timeSlotId)
        );
      },
      
      // Business Info actions
      updateBusinessInfo: (info: BusinessInfo) => {
        set({ businessInfo: info });
      },

      getBusinessInfo: () => {
        return get().businessInfo;
      },

      getUpcomingAppointments: () => {
        const today = new Date();
        const timeSlots = get().timeSlots;
        
        return get().appointments.filter(appointment => {
          const timeSlot = timeSlots.find(slot => slot.id === appointment.timeSlotId);
          if (!timeSlot) return false;
          
          const appointmentDate = parseISO(timeSlot.date);
          return appointment.status === 'scheduled' && isAfter(appointmentDate, today);
        });
      }
    }),
    {
      name: 'eyebrow-design-scheduling-storage'
    }
  )
);

// Helper function to format dates in Portuguese
export const formatDatePtBR = (date: string | Date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
};

// Helper function to format time
export const formatTime = (time: string) => {
  return time;
};

const checkAndSendReminders = () => {
  const now = new Date();
  const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);

  appointments.forEach(appointment => {
    const timeSlot = timeSlots.find(ts => ts.id === appointment.timeSlotId);
    const client = clients.find(c => c.id === appointment.clientId);

    if (!timeSlot || !client || appointment.status !== 'scheduled') return;

    const appointmentDateTime = new Date(`${timeSlot.date}T${timeSlot.startTime}`);
    const timeDiff = appointmentDateTime.getTime() - now.getTime();
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));

    // Check if appointment is approximately 30 minutes away (with 1-minute tolerance)
    if (minutesDiff >= 29 && minutesDiff <= 31 && !appointment.reminderSent) {
      // Send WhatsApp reminder
      const message = `Olá ${client.name}! Lembrete: Você tem um horário marcado para design de sobrancelhas hoje às ${timeSlot.startTime}. Aguardamos você!`;
      const whatsappLink = `https://wa.me/5534991122682?text=${encodeURIComponent(message)}`;
      window.open(whatsappLink, '_blank');

      // Mark reminder as sent
      updateAppointment(appointment.id, { ...appointment, reminderSent: true });
    }
  });
};

// Start checking for reminders every minute
setInterval(checkAndSendReminders, 60 * 1000);