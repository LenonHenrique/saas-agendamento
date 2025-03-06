import { Client, TimeSlot, Appointment, BusinessInfo } from '../types';

// Helper function to handle storage operations
const handleStorage = {
  get: (key: string) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error getting data for key ${key}:`, error);
      return null;
    }
  },
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting data for key ${key}:`, error);
    }
  },
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing data for key ${key}:`, error);
    }
  }
};

export class Storage {
  private static readonly CLIENTS_KEY = 'clients';
  private static readonly TIME_SLOTS_KEY = 'time_slots';
  private static readonly APPOINTMENTS_KEY = 'appointments';
  private static readonly BUSINESS_INFO_KEY = 'business_info';

  static async getTimeSlots(): Promise<TimeSlot[]> {
    return handleStorage.get(this.TIME_SLOTS_KEY) || [];
  }

  static async saveTimeSlots(timeSlots: TimeSlot[]): Promise<void> {
    try {
      handleStorage.set(this.TIME_SLOTS_KEY, timeSlots);
    } catch (error) {
      console.error('Error saving time slots:', error);
      throw error;
    }
  }

  static async addTimeSlot(timeSlot: TimeSlot): Promise<void> {
    const timeSlots = await this.getTimeSlots();
    timeSlots.push(timeSlot);
    await this.saveTimeSlots(timeSlots);
  }

  static async updateTimeSlot(id: string, timeSlotData: Partial<TimeSlot>): Promise<void> {
    const timeSlots = await this.getTimeSlots();
    const index = timeSlots.findIndex(slot => slot.id === id);
    if (index !== -1) {
      timeSlots[index] = { ...timeSlots[index], ...timeSlotData };
      await this.saveTimeSlots(timeSlots);
    }
  }

  static async deleteTimeSlot(id: string): Promise<void> {
    const timeSlots = await this.getTimeSlots();
    const filteredSlots = timeSlots.filter(slot => slot.id !== id);
    await this.saveTimeSlots(filteredSlots);
  }
  // Utility functions
  static async resetStore(): Promise<void> {
    handleStorage.remove(this.CLIENTS_KEY);
    handleStorage.remove(this.TIME_SLOTS_KEY);
    handleStorage.remove(this.APPOINTMENTS_KEY);
    handleStorage.remove(this.BUSINESS_INFO_KEY);
  }
  static async getClients(): Promise<Client[]> {
    return handleStorage.get(this.CLIENTS_KEY) || [];
  }
  static async addClient(client: Client): Promise<void> {
    const clients = await this.getClients();
    clients.push(client);
    handleStorage.set(this.CLIENTS_KEY, clients);
  }
  static async updateClient(id: string, clientData: Partial<Client>): Promise<void> {
    const clients = await this.getClients();
    const index = clients.findIndex(client => client.id === id);
    if (index !== -1) {
      clients[index] = { ...clients[index], ...clientData };
      handleStorage.set(this.CLIENTS_KEY, clients);
    }
  }
  static async deleteClient(id: string): Promise<void> {
    const clients = await this.getClients();
    const filteredClients = clients.filter(client => client.id !== id);
    handleStorage.set(this.CLIENTS_KEY, filteredClients);
  }
  static async getAppointments(): Promise<Appointment[]> {
    return handleStorage.get(this.APPOINTMENTS_KEY) || [];
  }
  static async addAppointment(appointment: Appointment): Promise<void> {
    const appointments = await this.getAppointments();
    appointments.push(appointment);
    handleStorage.set(this.APPOINTMENTS_KEY, appointments);
  }
  static async updateAppointment(id: string, appointmentData: Partial<Appointment>): Promise<void> {
    const appointments = await this.getAppointments();
    const index = appointments.findIndex(appointment => appointment.id === id);
    if (index !== -1) {
      appointments[index] = { ...appointments[index], ...appointmentData };
      handleStorage.set(this.APPOINTMENTS_KEY, appointments);
    }
  }
  static async deleteAppointment(id: string): Promise<void> {
    const appointments = await this.getAppointments();
    const filteredAppointments = appointments.filter(appointment => appointment.id !== id);
    handleStorage.set(this.APPOINTMENTS_KEY, filteredAppointments);
  }
}