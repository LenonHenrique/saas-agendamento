import React from 'react';
import { TimeSlot } from '../types';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Button from './Button';

interface TimeSlotPickerProps {
  timeSlots: TimeSlot[];
  selectedTimeSlotId: string | null;
  onSelectTimeSlot: (timeSlotId: string) => void;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  timeSlots,
  selectedTimeSlotId,
  onSelectTimeSlot,
}) => {
  // Group time slots by date
  const timeSlotsByDate = timeSlots.reduce<Record<string, TimeSlot[]>>((acc, timeSlot) => {
    const date = timeSlot.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(timeSlot);
    return acc;
  }, {});

  // Sort dates
  const sortedDates = Object.keys(timeSlotsByDate).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });

  if (timeSlots.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Não há horários disponíveis no momento.</p>
      </div>
    );
  }

  const formatDateHeader = (dateStr: string) => {
    const date = parseISO(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.getTime() === today.getTime()) {
      return "Hoje, " + format(date, "dd 'de' MMMM", { locale: ptBR });
    } else if (date.getTime() === tomorrow.getTime()) {
      return "Amanhã, " + format(date, "dd 'de' MMMM", { locale: ptBR });
    } else {
      return format(date, "EEEE, dd 'de' MMMM", { locale: ptBR });
    }
  };

  return (
    <div className="space-y-6">
      {sortedDates.map((date) => (
        <div key={date} className="space-y-2">
          <h3 className="font-medium text-gray-900">
            {formatDateHeader(date)}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {timeSlotsByDate[date]
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map((timeSlot) => (
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
      ))}
    </div>
  );
};

export default TimeSlotPicker;