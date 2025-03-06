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
}