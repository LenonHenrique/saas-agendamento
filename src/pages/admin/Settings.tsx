import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Share2 } from 'lucide-react';
import { useAppStore } from '../../store';

const Settings: React.FC = () => {
  const [bookingLink, setBookingLink] = useState(`${window.location.origin}/agendar`);
  const [businessInfo, setBusinessInfo] = useState({
    name: 'BeautyBrow Design de Sobrancelhas',
    address: 'Rua Exemplo, 123 - Bairro - Cidade/UF',
    phone: '5534991122682',
    workingHours: 'Segunda a Sexta, 9h às 18h'
  });

  const { updateBusinessInfo, getBusinessInfo } = useAppStore();

  useEffect(() => {
    const savedInfo = getBusinessInfo();
    if (savedInfo) {
      setBusinessInfo(savedInfo);
    }
  }, [getBusinessInfo]);
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(bookingLink);
    alert('Link copiado para a área de transferência!');
  };
  
  const handleShareWhatsApp = () => {
    const message = `Olá! Agende seu horário para design de sobrancelhas aqui: ${bookingLink}`;
    const whatsappLink = `https://wa.me/5534991122682?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        
        <Card title="Link de Agendamento">
          <div className="space-y-4">
            <p className="text-gray-600">
              Compartilhe este link com seus clientes para que eles possam agendar horários.
            </p>
            
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={bookingLink}
                readOnly
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              />
              <Button variant="outline" onClick={handleCopyLink}>
                Copiar
              </Button>
            </div>
            
            <Button
              variant="primary"
              fullWidth
              onClick={handleShareWhatsApp}
              className="mt-4"
            >
              <Share2 size={16} className="mr-2" />
              Compartilhar via WhatsApp
            </Button>
          </div>
        </Card>
        
        <Card title="Informações do Negócio">
          <div className="space-y-4">
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Negócio
              </label>
              <input
                type="text"
                id="businessName"
                value={businessInfo.name}
                onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              />
            </div>
            
            <div>
              <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Endereço
              </label>
              <textarea
                id="businessAddress"
                rows={3}
                value={businessInfo.address}
                onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              />
            </div>

            <div>
              <label htmlFor="businessPhone" className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <input
                type="text"
                id="businessPhone"
                value={businessInfo.phone}
                onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              />
            </div>

            <div>
              <label htmlFor="workingHours" className="block text-sm font-medium text-gray-700 mb-1">
                Horário de Funcionamento
              </label>
              <input
                type="text"
                id="workingHours"
                value={businessInfo.workingHours}
                onChange={(e) => setBusinessInfo({ ...businessInfo, workingHours: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              />
            </div>
            
            <div className="flex justify-end">
              const handleSaveBusinessInfo = async () => {
                try {
                  await Storage.saveBusinessInfo(businessInfo);
                  updateBusinessInfo(businessInfo);
                  alert('Alterações salvas com sucesso!');
                } catch (error) {
                  console.error('Error saving business info:', error);
                  alert('Erro ao salvar as alterações. Por favor, tente novamente.');
                }
              };
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;