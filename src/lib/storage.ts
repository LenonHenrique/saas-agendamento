import { put, del, list, get } from '@vercel/blob';
import { Client, TimeSlot, Appointment, BusinessInfo } from '../types';

export class Storage {
  private static readonly CLIENTS_KEY = 'clients';
  private static readonly TIME_SLOTS_KEY = 'time_slots';
  private static readonly APPOINTMENTS_KEY = 'appointments';
  private static readonly BUSINESS_INFO_KEY = 'business_info';

  // Client operations
  static async getClients(): Promise<Client[]> {
    try {
      const { url } = await get(this.CLIENTS_KEY);
      const response = await fetch(url);
      const clients = await response.json();
      return clients || [];
    } catch (error) {
      return [];
    }
  }

  static async addClient(client: Client): Promise<void> {
    const clients = await this.getClients();
    clients.push(client);
    await put(this.CLIENTS_KEY, JSON.stringify(clients), { access: 'public' });
  }

  static async updateClient(id: string, updatedClient: Partial<Client>): Promise<void> {
    const clients = await this.getClients();
    const index = clients.findIndex(client => client.id === id);
    if (index !== -1) {
      clients[index] = { ...clients[index], ...updatedClient };
      await put(this.CLIENTS_KEY, JSON.stringify(clients), { access: 'public' });
    }
  }

  static async deleteClient(id: string): Promise<void> {
    const clients = await this.getClients();
    const filteredClients = clients.filter(client => client.id !== id);
    await put(this.CLIENTS_KEY, JSON.stringify(filteredClients), { access: 'public' });
  }

  // TimeSlot operations
  static async getTimeSlots(): Promise<TimeSlot[]> {
    try {
      const { url } = await get(this.TIME_SLOTS_KEY);
      const response = await fetch(url);
      const timeSlots = await response.json();
      return timeSlots || [];
    } catch (error) {
      return [];
    }
  }

  static async addTimeSlot(timeSlot: TimeSlot): Promise<void> {
    const timeSlots = await this.getTimeSlots();
    timeSlots.push(timeSlot);
    await put(this.TIME_SLOTS_KEY, JSON.stringify(timeSlots), { access: 'public' });
  }

  static async updateTimeSlot(id: string, updatedTimeSlot: Partial<TimeSlot>): Promise<void> {
    const timeSlots = await this.getTimeSlots();
    const index = timeSlots.findIndex(slot => slot.id === id);
    if (index !== -1) {
      timeSlots[index] = { ...timeSlots[index], ...updatedTimeSlot };
      await put(this.TIME_SLOTS_KEY, JSON.stringify(timeSlots), { access: 'public' });
    }
  }

  static async deleteTimeSlot(id: string): Promise<void> {
    const timeSlots = await this.getTimeSlots();
    const filteredTimeSlots = timeSlots.filter(slot => slot.id !== id);
    await put(this.TIME_SLOTS_KEY, JSON.stringify(filteredTimeSlots), { access: 'public' });
  }

  // Appointment operations
  static async getAppointments(): Promise<Appointment[]> {
    try {
      const { url } = await get(this.APPOINTMENTS_KEY);
      const response = await fetch(url);
      const appointments = await response.json();
      return appointments || [];
    } catch (error) {
      return [];
    }
  }

  static async addAppointment(appointment: Appointment): Promise<void> {
    const appointments = await this.getAppointments();
    appointments.push(appointment);
    await put(this.APPOINTMENTS_KEY, JSON.stringify(appointments), { access: 'public' });
  }

  static async updateAppointment(id: string, updatedAppointment: Partial<Appointment>): Promise<void> {
    const appointments = await this.getAppointments();
    const index = appointments.findIndex(apt => apt.id === id);
    if (index !== -1) {
      appointments[index] = { ...appointments[index], ...updatedAppointment };
      await put(this.APPOINTMENTS_KEY, JSON.stringify(appointments), { access: 'public' });
    }
  }

  static async deleteAppointment(id: string): Promise<void> {
    const appointments = await this.getAppointments();
    const filteredAppointments = appointments.filter(apt => apt.id !== id);
    await put(this.APPOINTMENTS_KEY, JSON.stringify(filteredAppointments), { access: 'public' });
  }

  // Business Info operations
  static async getBusinessInfo(): Promise<BusinessInfo | null> {
    try {
      const { url } = await get(this.BUSINESS_INFO_KEY);
      const response = await fetch(url);
      const info = await response.json();
      return info;
    } catch (error) {
      return null;
    }
  }

  static async updateBusinessInfo(info: BusinessInfo): Promise<void> {
    await put(this.BUSINESS_INFO_KEY, JSON.stringify(info), { access: 'public' });
  }

  // Utility functions
  static async resetStore(): Promise<void> {
    await Promise.all([
      del(this.CLIENTS_KEY),
      del(this.TIME_SLOTS_KEY),
      del(this.APPOINTMENTS_KEY)
    ]);
  }
}