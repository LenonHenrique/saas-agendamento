import React from 'react';
import { TimeSlot } from '../types';
import Button from './Button';
import { Clock } from 'lucide-react';

interface TimeSlotListProps {
  timeSlots: TimeSlot[];
  selectedTimeSlotId: string | null;
  onSelectTimeSlot: (timeSlotId: string) => void;
  selectedService?: string;
  onSelectService?: (service: string) => void;
}

const TimeSlotList: React.FC<TimeSlotListProps> = ({
  timeSlots,
  selectedTimeSlotId,
  onSelectTimeSlot,
  selectedService = 'Design normal',
  onSelectService = () => {},
}) => {
  // Sort time slots by start time
  const sortedTimeSlots = [...timeSlots].sort((a, b) => 
    a.startTime.localeCompare(b.startTime)
  );

  if (timeSlots.length === 0) {
    return (
      <div className="text-center py-6 bg-gray-50 rounded-lg">
        <Clock size={24} className="text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">Não há horários disponíveis nesta data.</p>
        <p className="text-gray-500 text-sm mt-1">Por favor, selecione outra data no calendário.</p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Horários disponíveis:</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {sortedTimeSlots.map((timeSlot) => (
            <Button
              key={timeSlot.id}
              variant={selectedTimeSlotId === timeSlot.id ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onSelectTimeSlot(timeSlot.id)}
              className="justify-center"
            >
              {timeSlot.startTime}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Tipo de serviço:</h3>
        <select
          value={selectedService}
          onChange={(e) => onSelectService(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
        >
          <option value="Design normal">Design normal</option>
          <option value="Design com henna">Design com henna</option>
        </select>
      </div>
    </div>
  );
};

export default TimeSlotList;