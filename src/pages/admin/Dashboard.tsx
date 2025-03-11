import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store';
import Layout from '../../components/Layout';
import AppointmentCard from '../../components/AppointmentCard';
import { format, parseISO, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../components/Button';
import { Storage } from '../../lib/storage';
import { Appointment, Client, TimeSlot } from '../../types';

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
      setIsLoading(true);
      setError(null);
      try {
        await initializeData();
        const [storedAppointments, storedClients, storedTimeSlots] = await Promise.all([
          Storage.getAppointments(),
          Storage.getClients(),
          Storage.getTimeSlots()
        ]);
        
        // Initialize with empty arrays if data is not available
        set({ 
          appointments: storedAppointments || [],
          clients: storedClients || [],
          timeSlots: storedTimeSlots || []
        });
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Erro ao carregar dados. Por favor, recarregue a página.');
        // Initialize with empty arrays on error
        set({
          appointments: [],
          clients: [],
          timeSlots: []
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [initializeData, set]);

  const formattedDate = format(selectedDate, "yyyy-MM-dd");
  const displayDate = format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR });
  
  // Safely filter appointments with proper null checks
  const todayAppointments = Array.isArray(appointments) ? appointments.filter(appointment => {
    // Add a null check for appointment and appointment.timeSlotId
    if (!appointment || !appointment.timeSlotId) return false;
    
    const timeSlot = Array.isArray(timeSlots) ? 
      timeSlots.find(ts => ts && ts.id === appointment.timeSlotId) : 
      undefined;
      
    return timeSlot && 
           timeSlot.date === formattedDate && 
           (appointment.status === 'scheduled' || appointment.status === 'completed');
  }) : [];
  
  const handlePreviousDay = () => {
    setSelectedDate(prev => addDays(prev, -1));
  };
  
  const handleNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1));
  };
  
  const handleCompleteAppointment = async (appointmentId: string) => {
    try {
      await updateAppointment(appointmentId, { status: 'completed' });
      await Storage.saveAppointments(appointments);
      alert('Agendamento concluído com sucesso!');
    } catch (error) {
      console.error('Error completing appointment:', error);
      alert('Erro ao concluir agendamento. Tente novamente.');
    }
  };
  
  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      if (window.confirm('Tem certeza que deseja cancelar este agendamento?')) {
        await cancelAppointment(appointmentId);
        await Storage.saveAppointments(appointments);
        alert('Agendamento cancelado com sucesso!');
      }
    } catch (error) {
      console.error('Error canceling appointment:', error);
      alert('Erro ao cancelar agendamento. Tente novamente.');
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-500">Carregando dados...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="text-red-500 mb-4">{error}</p>
          <Button 
            variant="primary" 
            onClick={() => window.location.reload()}
          >
            Tentar Novamente
          </Button>
        </div>
      </Layout>
    );
  }
  
  // Prepare appointments data with validation
  const validAppointments = todayAppointments
    .filter(appointment => {
      if (!appointment) return false;
      
      const timeSlot = timeSlots.find(ts => ts && ts.id === appointment.timeSlotId);
      const client = clients.find(c => c && c.id === appointment.clientId);
      
      if (!timeSlot) {
        console.error(`TimeSlot not found for appointment ${appointment.id}`);
        return false;
      }
      
      if (!client) {
        console.error(`Client not found for appointment ${appointment.id}`);
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      const timeSlotA = timeSlots.find(ts => ts.id === a.timeSlotId);
      const timeSlotB = timeSlots.find(ts => ts.id === b.timeSlotId);
      if (!timeSlotA || !timeSlotB) return 0;
      return timeSlotA.startTime.localeCompare(timeSlotB.startTime);
    });
  
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
            {validAppointments.length > 0 ? (
              validAppointments.map(appointment => {
                const timeSlot = timeSlots.find(ts => ts.id === appointment.timeSlotId)!;
                const client = clients.find(c => c.id === appointment.clientId)!;
                
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