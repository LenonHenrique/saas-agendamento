import React from 'react';
import { Appointment, Client, TimeSlot } from '../types';
import { formatDatePtBR } from '../store';
import { Calendar, Clock, User, Phone, Scissors } from 'lucide-react';
import Button from './Button';

interface AppointmentCardProps {
  appointment: Appointment;
  client: Client;
  timeSlot: TimeSlot;
  onCancel?: () => void;
  onComplete?: () => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  client,
  timeSlot,
  onCancel,
  onComplete,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-pink-500">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
        <h3 className="font-medium text-lg">{client.name}</h3>
        <div className="px-2 py-1 rounded text-xs font-medium uppercase">
          {appointment.status === 'scheduled' && (
            <span className="text-green-700 bg-green-100 px-2 py-1 rounded">Agendado</span>
          )}
          {appointment.status === 'completed' && (
            <span className="text-blue-700 bg-blue-100 px-2 py-1 rounded">Concluído</span>
          )}
          {appointment.status === 'cancelled' && (
            <span className="text-red-700 bg-red-100 px-2 py-1 rounded">Cancelado</span>
          )}
        </div>
      </div>
      
      <div className="mt-3 space-y-2">
        <div className="flex items-center text-gray-600">
          <Calendar size={16} className="mr-2 flex-shrink-0" />
          <span className="break-words">{formatDatePtBR(timeSlot.date)}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <Clock size={16} className="mr-2 flex-shrink-0" />
          <span className="break-words">{timeSlot.startTime} - {timeSlot.endTime}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <Scissors size={16} className="mr-2 flex-shrink-0" />
          <span className="break-words">{appointment.service}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <User size={16} className="mr-2 flex-shrink-0" />
          <span className="break-words">{client.name}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <Phone size={16} className="mr-2 flex-shrink-0" />
          <span className="break-words">{client.phone}</span>
        </div>
      </div>
      
      {appointment.status === 'scheduled' && (
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          {onComplete && (
            <Button variant="primary" size="sm" onClick={onComplete} fullWidth>
              Concluir
            </Button>
          )}
          {onCancel && (
            <Button variant="outline" size="sm" onClick={onCancel} fullWidth>
              Cancelar
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;