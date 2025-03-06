import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { useAppStore } from '../../store';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { format, addDays, parseISO, isSunday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus, Calendar, Clock, Trash, Save } from 'lucide-react';
import { Storage } from '../../lib/storage';

const TimeSlots: React.FC = () => {
  const { timeSlots, addTimeSlot, deleteTimeSlot } = useAppStore();
  const [isAddingTimeSlot, setIsAddingTimeSlot] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    startTime: '08:00',
    endTime: '08:30',
  });

  // Function to generate time slots for a day
  const generateDayTimeSlots = (date: string) => {
    const slots = [];
    const startHour = 8;
    const endHour = 20;

    for (let hour = startHour; hour < endHour; hour++) {
      // First 30-minute slot
      slots.push({
        date,
        startTime: `${hour.toString().padStart(2, '0')}:00`,
        endTime: `${hour.toString().padStart(2, '0')}:30`,
        isAvailable: true,
      });

      // Second 30-minute slot
      slots.push({
        date,
        startTime: `${hour.toString().padStart(2, '0')}:30`,
        endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
        isAvailable: true,
      });
    }

    return slots;
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddTimeSlot = async () => {
    const startDate = parseISO(formData.startDate);
    const endDate = parseISO(formData.endDate);
    let currentDate = startDate;
  
    while (currentDate <= endDate) {
      // Skip Sundays
      if (!isSunday(currentDate)) {
        const slots = generateDayTimeSlots(format(currentDate, 'yyyy-MM-dd'));
        for (const slot of slots) {
          await addTimeSlot(slot);
        }
      }
      currentDate = addDays(currentDate, 1);
    }
    
    setIsAddingTimeSlot(false);
  };
  
  // Group time slots by date
  const timeSlotsByDate = timeSlots.reduce<Record<string, typeof timeSlots>>((acc, timeSlot) => {
    if (!acc[timeSlot.date]) {
      acc[timeSlot.date] = [];
    }
    acc[timeSlot.date].push(timeSlot);
    return acc;
  }, {});
  
  // Sort dates
  const sortedDates = Object.keys(timeSlotsByDate).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Horários Disponíveis</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={async () => {
                setIsSaving(true);
                try {
                  await Storage.saveTimeSlots(timeSlots);
                  alert('Horários salvos com sucesso!');
                } catch (error) {
                  console.error('Error saving time slots:', error);
                  alert('Erro ao salvar horários. Tente novamente.');
                } finally {
                  setIsSaving(false);
                }
              }}
              disabled={isSaving}
            >
              <Save size={16} className="mr-2" />
              {isSaving ? 'Salvando...' : 'Salvar Horários'}
            </Button>
            <Button
              variant="primary"
              onClick={() => setIsAddingTimeSlot(true)}
            >
              <Plus size={16} className="mr-2" />
              Novo Horário
            </Button>
          </div>
        </div>
        
        {isAddingTimeSlot && (
          <Card
            title="Adicionar Horário"
            footer={
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddingTimeSlot(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" onClick={handleAddTimeSlot}>
                  Adicionar
                </Button>
              </div>
            }
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Data Inicial
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Data Final
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Horário de Início
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Horário de Término
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Nota: Os horários serão criados para todos os dias no intervalo selecionado, exceto domingos.
              </p>
            </div>
          </Card>
        )}
        
        <div className="space-y-6">
          {sortedDates.length > 0 ? (
            sortedDates.map(date => {
              const slots = timeSlotsByDate[date];
              const dateObj = parseISO(date);
              const isToday = format(new Date(), 'yyyy-MM-dd') === date;
              const isPast = dateObj < new Date() && !isToday;
              
              return (
                <Card
                  key={date}
                  title={
                    <div className="flex items-center">
                      <Calendar size={18} className="text-pink-500 mr-2" />
                      <span>
                        {format(dateObj, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                        {isToday && <span className="ml-2 text-sm text-green-500">(Hoje)</span>}
                        {isPast && <span className="ml-2 text-sm text-red-500">(Passado)</span>}
                      </span>
                    </div>
                  }
                >
                  <ul className="divide-y divide-gray-200">
                    {slots
                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                      .map(slot => (
                        <li key={slot.id} className="py-3 flex justify-between items-center">
                          <div className="flex items-center">
                            <Clock size={18} className="text-gray-400 mr-2" />
                            <span>
                              {slot.startTime} - {slot.endTime}
                            </span>
                            {!slot.isAvailable && (
                              <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                                Reservado
                              </span>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteTimeSlot(slot.id)}
                          >
                            <Trash size={16} />
                          </Button>
                        </li>
                      ))}
                  </ul>
                </Card>
              );
            })
          ) : (
            <div className="text-center py-8 bg-white rounded-lg shadow-md">
              <p className="text-gray-500">Nenhum horário disponível. Adicione novos horários.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TimeSlots;