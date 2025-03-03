import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, isAfter, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TimeSlot } from '../types';
import 'react-day-picker/dist/style.css';

interface CalendarPickerProps {
  timeSlots: TimeSlot[];
  selectedDate: Date | undefined;
  onSelectDate: (date: Date) => void;
}

const CalendarPicker: React.FC<CalendarPickerProps> = ({
  timeSlots,
  selectedDate,
  onSelectDate,
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get all dates that have available time slots
  const availableDates = timeSlots.map(slot => parseISO(slot.date));
  
  // Group time slots by date for badge display
  const timeSlotsByDate = timeSlots.reduce<Record<string, TimeSlot[]>>((acc, slot) => {
    const dateStr = slot.date;
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(slot);
    return acc;
  }, {});

  // Custom day content to show available slots count
  const renderDayContent = (day: Date) => {
    return (
      <div className="relative">
        <div>{format(day, 'd')}</div>
      </div>
    );
  };

  // Only allow selecting dates with available time slots
  const isDayDisabled = (day: Date) => {
    const currentMonth = new Date().getMonth();
    const dayMonth = day.getMonth();
    
    return (
      (isAfter(today, day) && !isSameDay(today, day)) || // Past days
      dayMonth !== currentMonth || // Not in current month
      !availableDates.some(date => isSameDay(date, day)) // Days without slots
    );
  };

  return (
    <div className="calendar-container">
      <style jsx>{`
        .rdp {
          --rdp-cell-size: 40px;
          --rdp-accent-color: #ec4899;
          --rdp-background-color: rgba(236, 72, 153, 0.1);
          margin: 0;
        }
        .rdp-day_selected:not(.rdp-day_disabled) {
          font-weight: bold;
          border: 2px solid var(--rdp-accent-color);
        }
        .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
          background-color: rgba(236, 72, 153, 0.1);
        }
        .calendar-container .rdp-months {
          justify-content: center;
        }
      `}</style>
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onSelectDate(date)}
        locale={ptBR}
        weekStartsOn={0}
        fromMonth={today}
        toMonth={new Date(today.getFullYear(), today.getMonth() + 1)} // Only show current month
        components={{
          DayContent: ({ date }) => renderDayContent(date),
        }}
        modifiers={{
          disabled: (date) => isDayDisabled(date),
        }}
        modifiersClassNames={{
          selected: 'bg-pink-100 text-pink-800 font-medium',
          today: 'rdp-day_today font-bold border-pink-300 border',
        }}
        className="mx-auto"
      />
    </div>
  );

};

export default CalendarPicker;