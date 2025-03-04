import { kv } from '@vercel/kv';
import { Client, TimeSlot, Appointment, BusinessInfo } from '../types';

export class Storage {
  private static readonly CLIENTS_KEY = 'clients';
  private static readonly TIME_SLOTS_KEY = 'time_slots';
  private static readonly APPOINTMENTS_KEY = 'appointments';
  private static readonly BUSINESS_INFO_KEY = 'business_info';

  // Client operations
  static async getClients(): Promise<Client[]> {
    const clients = await kv.get<Client[]>(this.CLIENTS_KEY);
    return clients || [];
  }

  static async addClient(client: Client): Promise<void> {
    const clients = await this.getClients();
    clients.push(client);
    await kv.set(this.CLIENTS_KEY, clients);
  }

  static async updateClient(id: string, updatedClient: Partial<Client>): Promise<void> {
    const clients = await this.getClients();
    const index = clients.findIndex(client => client.id === id);
    if (index !== -1) {
      clients[index] = { ...clients[index], ...updatedClient };
      await kv.set(this.CLIENTS_KEY, clients);
    }
  }

  static async deleteClient(id: string): Promise<void> {
    const clients = await this.getClients();
    const filteredClients = clients.filter(client => client.id !== id);
    await kv.set(this.CLIENTS_KEY, filteredClients);
  }

  // TimeSlot operations
  static async getTimeSlots(): Promise<TimeSlot[]> {
    const timeSlots = await kv.get<TimeSlot[]>(this.TIME_SLOTS_KEY);
    return timeSlots || [];
  }

  static async addTimeSlot(timeSlot: TimeSlot): Promise<void> {
    const timeSlots = await this.getTimeSlots();
    timeSlots.push(timeSlot);
    await kv.set(this.TIME_SLOTS_KEY, timeSlots);
  }

  static async updateTimeSlot(id: string, updatedTimeSlot: Partial<TimeSlot>): Promise<void> {
    const timeSlots = await this.getTimeSlots();
    const index = timeSlots.findIndex(slot => slot.id === id);
    if (index !== -1) {
      timeSlots[index] = { ...timeSlots[index], ...updatedTimeSlot };
      await kv.set(this.TIME_SLOTS_KEY, timeSlots);
    }
  }

  static async deleteTimeSlot(id: string): Promise<void> {
    const timeSlots = await this.getTimeSlots();
    const filteredTimeSlots = timeSlots.filter(slot => slot.id !== id);
    await kv.set(this.TIME_SLOTS_KEY, filteredTimeSlots);
  }

  // Appointment operations
  static async getAppointments(): Promise<Appointment[]> {
    const appointments = await kv.get<Appointment[]>(this.APPOINTMENTS_KEY);
    return appointments || [];
  }

  static async addAppointment(appointment: Appointment): Promise<void> {
    const appointments = await this.getAppointments();
    appointments.push(appointment);
    await kv.set(this.APPOINTMENTS_KEY, appointments);
  }

  static async updateAppointment(id: string, updatedAppointment: Partial<Appointment>): Promise<void> {
    const appointments = await this.getAppointments();
    const index = appointments.findIndex(apt => apt.id === id);
    if (index !== -1) {
      appointments[index] = { ...appointments[index], ...updatedAppointment };
      await kv.set(this.APPOINTMENTS_KEY, appointments);
    }
  }

  static async deleteAppointment(id: string): Promise<void> {
    const appointments = await this.getAppointments();
    const filteredAppointments = appointments.filter(apt => apt.id !== id);
    await kv.set(this.APPOINTMENTS_KEY, filteredAppointments);
  }

  // Business Info operations
  static async getBusinessInfo(): Promise<BusinessInfo | null> {
    return await kv.get<BusinessInfo>(this.BUSINESS_INFO_KEY);
  }

  static async updateBusinessInfo(info: BusinessInfo): Promise<void> {
    await kv.set(this.BUSINESS_INFO_KEY, info);
  }

  // Utility functions
  static async resetStore(): Promise<void> {
    await Promise.all([
      kv.del(this.CLIENTS_KEY),
      kv.del(this.TIME_SLOTS_KEY),
      kv.del(this.APPOINTMENTS_KEY)
    ]);
  }
}