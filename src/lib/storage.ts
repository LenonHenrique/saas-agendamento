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

  // Client operations
  static async getClients(): Promise<Client[]> {
    return handleStorage.get(this.CLIENTS_KEY) || [];
  }

  static async addClient(client: Client): Promise<void> {
    const clients = await this.getClients();
    clients.push(client);
    handleStorage.set(this.CLIENTS_KEY, clients);
  }

  static async updateClient(id: string, updatedClient: Partial<Client>): Promise<void> {
    const clients = await this.getClients();
    const index = clients.findIndex(client => client.id === id);
    if (index !== -1) {
      clients[index] = { ...clients[index], ...updatedClient };
      handleStorage.set(this.CLIENTS_KEY, clients);
    }
  }

  static async deleteClient(id: string): Promise<void> {
    const clients = await this.getClients();
    const filteredClients = clients.filter(client => client.id !== id);
    handleStorage.set(this.CLIENTS_KEY, filteredClients);
  }

  // TimeSlot operations
  static async getTimeSlots(): Promise<TimeSlot[]> {
    return handleStorage.get(this.TIME_SLOTS_KEY) || [];
  }

  static async addTimeSlot(timeSlot: TimeSlot): Promise<void> {
    const timeSlots = await this.getTimeSlots();
    timeSlots.push(timeSlot);
    handleStorage.set(this.TIME_SLOTS_KEY, timeSlots);
  }

  static async updateTimeSlot(id: string, updatedTimeSlot: Partial<TimeSlot>): Promise<void> {
    const timeSlots = await this.getTimeSlots();
    const index = timeSlots.findIndex(slot => slot.id === id);
    if (index !== -1) {
      timeSlots[index] = { ...timeSlots[index], ...updatedTimeSlot };
      handleStorage.set(this.TIME_SLOTS_KEY, timeSlots);
    }
  }

  static async deleteTimeSlot(id: string): Promise<void> {
    const timeSlots = await this.getTimeSlots();
    const filteredTimeSlots = timeSlots.filter(slot => slot.id !== id);
    handleStorage.set(this.TIME_SLOTS_KEY, filteredTimeSlots);
  }

  // Appointment operations
  static async getAppointments(): Promise<Appointment[]> {
    return handleStorage.get(this.APPOINTMENTS_KEY) || [];
  }

  static async addAppointment(appointment: Appointment): Promise<void> {
    const appointments = await this.getAppointments();
    appointments.push(appointment);
    handleStorage.set(this.APPOINTMENTS_KEY, appointments);
  }

  static async updateAppointment(id: string, updatedAppointment: Partial<Appointment>): Promise<void> {
    const appointments = await this.getAppointments();
    const index = appointments.findIndex(apt => apt.id === id);
    if (index !== -1) {
      appointments[index] = { ...appointments[index], ...updatedAppointment };
      handleStorage.set(this.APPOINTMENTS_KEY, appointments);
    }
  }

  static async deleteAppointment(id: string): Promise<void> {
    const appointments = await this.getAppointments();
    const filteredAppointments = appointments.filter(apt => apt.id !== id);
    handleStorage.set(this.APPOINTMENTS_KEY, filteredAppointments);
  }

  // Business Info operations
  static async getBusinessInfo(): Promise<BusinessInfo | null> {
    return handleStorage.get(this.BUSINESS_INFO_KEY);
  }

  static async updateBusinessInfo(info: BusinessInfo): Promise<void> {
    handleStorage.set(this.BUSINESS_INFO_KEY, info);
  }

  // Utility functions
  static async resetStore(): Promise<void> {
    handleStorage.remove(this.CLIENTS_KEY);
    handleStorage.remove(this.TIME_SLOTS_KEY);
    handleStorage.remove(this.APPOINTMENTS_KEY);
    handleStorage.remove(this.BUSINESS_INFO_KEY);
  }
}