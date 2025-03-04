import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import CalendarPicker from '../../components/CalendarPicker';
import TimeSlotList from '../../components/TimeSlotList';
import { formatDatePtBR } from '../../store';
import { Calendar, Clock, Check, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, parseISO, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const BookingPage: React.FC = () => {
  const [step, setStep] = useState<'select-time' | 'client-info' | 'confirmation'>('select-time');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState('Design normal');
  const [clientInfo, setClientInfo] = useState({
    name: '',
    phone: '',
    observations: '',
    email: '',
  });
  const [bookingComplete, setBookingComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    timeSlots, 
    getAvailableTimeSlots, 
    addClient, 
    createAppointment,
    addTimeSlot
  } = useAppStore();
  
  // Add some demo time slots if none exist
  useEffect(() => {
    const availableSlots = getAvailableTimeSlots();
    if (availableSlots.length === 0) {
      // Add some demo time slots for the next 7 days
      const today = new Date();
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Add morning slots
        addTimeSlot({
          date: dateStr,
          startTime: '09:00',
          endTime: '10:00',
          isAvailable: true,
        });
        
        addTimeSlot({
          date: dateStr,
          startTime: '10:30',
          endTime: '11:30',
          isAvailable: true,
        });
        
        // Add afternoon slots
        addTimeSlot({
          date: dateStr,
          startTime: '14:00',
          endTime: '15:00',
          isAvailable: true,
        });
        
        addTimeSlot({
          date: dateStr,
          startTime: '15:30',
          endTime: '16:30',
          isAvailable: true,
        });
      }
    }
  }, [addTimeSlot, getAvailableTimeSlots]);
  
  const availableTimeSlots = getAvailableTimeSlots();
  
  // Filter time slots for the selected date
  const timeSlotsForSelectedDate = availableTimeSlots.filter(slot => 
    isSameDay(parseISO(slot.date), selectedDate)
  );
  
  const selectedTimeSlot = timeSlots.find(slot => slot.id === selectedTimeSlotId);
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTimeSlotId(null);
    setError(null);
  };
  
  const handleTimeSlotSelect = (timeSlotId: string) => {
    setSelectedTimeSlotId(timeSlotId);
    setError(null);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClientInfo(prev => ({ ...prev, [name]: value }));
    setError(null);
  };
  
  const handleContinue = () => {
    if (step === 'select-time') {
      if (!selectedTimeSlotId) {
        setError('Por favor, selecione um horário disponível.');
        return;
      }
      setStep('client-info');
    } else if (step === 'client-info') {
      if (!clientInfo.name) {
        setError('Por favor, informe seu nome.');
        return;
      }
      if (!clientInfo.phone) {
        setError('Por favor, informe seu telefone.');
        return;
      }
      setStep('confirmation');
    }
  };
  
  const handleBack = () => {
    if (step === 'client-info') {
      setStep('select-time');
    } else if (step === 'confirmation') {
      setStep('client-info');
    }
    setError(null);
  };
  
  const handleConfirmBooking = () => {
    if (!selectedTimeSlotId) {
      setError('Ocorreu um erro. Por favor, tente novamente.');
      return;
    }
    
    try {
      // Add client
      const client = addClient({
        name: clientInfo.name,
        phone: clientInfo.phone,
        email: clientInfo.email,
      });
      
      // Create appointment
      createAppointment({
        clientId: client.id,
        timeSlotId: selectedTimeSlotId,
        status: 'scheduled',
        service: selectedService,
      });
      
      setBookingComplete(true);
      setError(null);
    } catch (err) {
      setError('Ocorreu um erro ao confirmar seu agendamento. Por favor, tente novamente.');
      console.error('Booking error:', err);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-pink-600">Giovanna Beauty</h1>
          <p className="text-gray-600 mt-2">{selectedService}</p>
        </div>
        
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
            <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}
        
        {!bookingComplete ? (
          <Card>
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-2">
                <div className={`flex items-center ${step === 'select-time' ? 'text-pink-600 font-medium' : 'text-gray-500'}`}>
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center">
                    <span className="text-sm">1</span>
                  </div>
                  <span className="ml-2 text-sm">Horário</span>
                </div>
                <div className="hidden sm:block flex-grow border-t border-gray-300"></div>
                <div className={`flex items-center ${step === 'client-info' ? 'text-pink-600 font-medium' : 'text-gray-500'}`}>
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center">
                    <span className="text-sm">2</span>
                  </div>
                  <span className="ml-2 text-sm">Dados</span>
                </div>
                <div className="hidden sm:block flex-grow border-t border-gray-300"></div>
                <div className={`flex items-center ${step === 'confirmation' ? 'text-pink-600 font-medium' : 'text-gray-500'}`}>
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center">
                    <span className="text-sm">3</span>
                  </div>
                  <span className="ml-2 text-sm">Confirmar</span>
                </div>
              </div>
            </div>
            
            {step === 'select-time' && (
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-4">Escolha um horário</h2>
                
                {availableTimeSlots.length > 0 ? (
                  <div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <CalendarPicker 
                        timeSlots={availableTimeSlots}
                        selectedDate={selectedDate}
                        onSelectDate={handleDateSelect}
                      />
                      
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center mb-3">
                          <Calendar size={18} className="text-pink-500 mr-2" />
                          <h3 className="font-medium text-gray-900">
                            {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                          </h3>
                        </div>
                        
                        <TimeSlotList
                          timeSlots={timeSlotsForSelectedDate}
                          selectedTimeSlotId={selectedTimeSlotId}
                          onSelectTimeSlot={handleTimeSlotSelect}
                          selectedService={selectedService}
                          onSelectService={setSelectedService}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button
                        variant="primary"
                        fullWidth
                        onClick={handleContinue}
                        disabled={!selectedTimeSlotId}
                      >
                        Continuar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Calendar size={32} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Não há horários disponíveis no momento.</p>
                    <p className="text-gray-500 text-sm mt-1">Por favor, entre em contato conosco para mais informações.</p>
                  </div>
                )}
              </div>
            )}
            
            {step === 'client-info' && (
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-4">Seus dados</h2>
                <div className="space-y-4">
                  <Input
                    label="Nome completo"
                    name="name"
                    value={clientInfo.name}
                    onChange={handleInputChange}
                    fullWidth
                    required
                  />
                  
                  <Input
                    label="Telefone"
                    name="phone"
                    value={clientInfo.phone}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    placeholder="(00) 00000-0000"
                  />
                  
                  <Input
                    label="Observações (opcional)"
                    name="observations"
                    value={clientInfo.observations}
                    onChange={handleInputChange}
                    fullWidth
                    placeholder="Ex: Alguma observação ou pedido especial"
                  />
                </div>
                <div className="mt-6 flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                  >
                    Voltar
                  </Button>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={handleContinue}
                    disabled={!clientInfo.name || !clientInfo.phone}
                  >
                    Continuar
                  </Button>
                </div>
              </div>
            )}
            
            {step === 'confirmation' && selectedTimeSlot && (
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-4">Confirmar agendamento</h2>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Calendar size={18} className="text-pink-500 mr-2" />
                      <span className="text-gray-700">{formatDatePtBR(selectedTimeSlot.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={18} className="text-pink-500 mr-2" />
                      <span className="text-gray-700">{selectedTimeSlot.startTime} - {selectedTimeSlot.endTime}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <p className="font-medium">{selectedService}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-gray-700"><strong>Nome:</strong> {clientInfo.name}</p>
                  <p className="text-gray-700"><strong>Telefone:</strong> {clientInfo.phone}</p>
                  {clientInfo.observations && (
                    <p className="text-gray-700"><strong>Observações:</strong> {clientInfo.observations}</p>
                  )}
                </div>
                
                <div className="mt-6 flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                  >
                    Voltar
                  </Button>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={handleConfirmBooking}
                  >
                    Confirmar Agendamento
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ) : (
          <Card>
            <div className="text-center py-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <Check size={24} className="text-green-600" />
              </div>
              <h2 className="text-xl font-medium text-gray-900 mb-2">Agendamento Confirmado!</h2>
              <p className="text-gray-600 mb-6">
                Seu horário foi agendado com sucesso. Em breve você receberá uma confirmação do seu agendamento.
              </p>
              
              {selectedTimeSlot && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4 text-left">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Calendar size={18} className="text-pink-500 mr-2" />
                      <span className="text-gray-700">{formatDatePtBR(selectedTimeSlot.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={18} className="text-pink-500 mr-2" />
                      <span className="text-gray-700">{selectedTimeSlot.startTime} - {selectedTimeSlot.endTime}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <p className="font-medium">{selectedService}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <Button
                variant="primary"
                onClick={() => window.location.href = '/agendar'}
              >
                Fazer Novo Agendamento
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BookingPage;