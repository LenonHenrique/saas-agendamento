import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store';
import Layout from '../../components/Layout';
import AppointmentCard from '../../components/AppointmentCard';
import { format, parseISO, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../components/Button';
import { Storage } from '../../lib/storage';

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const { 
    appointments, 
    timeSlots, 
    clients, 
    updateAppointment, 
    cancelAppointment,
    getAppointmentsByDate,
    initializeData,
    set
  } = useAppStore();
  
  useEffect(() => {
    const loadData = async () => {
      await initializeData();
      const storedAppointments = await Storage.getAppointments();
      if (storedAppointments) {
        set({ appointments: storedAppointments });
      }
    };
    loadData();
  }, [initializeData, set]);

  const formattedDate = format(selectedDate, "yyyy-MM-dd");
  const displayDate = format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR });
  
  const todayAppointments = appointments.filter(appointment => {
    const timeSlot = timeSlots.find(ts => ts.id === appointment.timeSlotId);
    return timeSlot && timeSlot.date === formattedDate && appointment.status === 'scheduled';
  });
  
  const handlePreviousDay = () => {
    setSelectedDate(prev => addDays(prev, -1));
  };
  
  const handleNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1));
  };
  
  const handleCompleteAppointment = (appointmentId: string) => {
    updateAppointment(appointmentId, { status: 'completed' });
  };
  
  const handleCancelAppointment = (appointmentId: string) => {
    cancelAppointment(appointmentId);
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Agenda</h1>
          <Button
            variant="primary"
            onClick={() => {
              const bookingLink = `${window.location.origin}/agendar`;
              navigator.clipboard.writeText(bookingLink);
              alert('Link de agendamento copiado para a área de transferência!');
            }}
          >
            Copiar Link de Agendamento
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePreviousDay}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex items-center space-x-2">
              <Calendar size={20} className="text-pink-500" />
              <h2 className="text-lg font-medium">{displayDate}</h2>
            </div>
            
            <button
              onClick={handleNextDay}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          <div className="space-y-4">
            {todayAppointments.length > 0 ? (
              todayAppointments
                .sort((a, b) => {
                  const timeSlotA = timeSlots.find(ts => ts.id === a.timeSlotId);
                  const timeSlotB = timeSlots.find(ts => ts.id === b.timeSlotId);
                  if (!timeSlotA || !timeSlotB) return 0;
                  return timeSlotA.startTime.localeCompare(timeSlotB.startTime);
                })
                .map(appointment => {
                  const timeSlot = timeSlots.find(ts => ts.id === appointment.timeSlotId);
                  const client = clients.find(c => c.id === appointment.clientId);
                  
                  if (!timeSlot || !client) return null;
                  
                  return (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      timeSlot={timeSlot}
                      client={client}
                      onComplete={() => handleCompleteAppointment(appointment.id)}
                      onCancel={() => handleCancelAppointment(appointment.id)}
                    />
                  );
                })
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Não há agendamentos para este dia.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;