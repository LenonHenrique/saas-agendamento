import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { useAppStore } from '../../store';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';
import { Plus, Edit, Trash, Search, User, Phone } from 'lucide-react';

const Clients: React.FC = () => {
  const { clients, addClient, updateClient, deleteClient } = useAppStore();
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
  });
  
  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      notes: '',
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddClient = () => {
    addClient(formData);
    resetForm();
    setIsAddingClient(false);
  };
  
  const handleUpdateClient = () => {
    if (editingClientId) {
      updateClient(editingClientId, formData);
      resetForm();
      setEditingClientId(null);
    }
  };
  
  const handleEditClient = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setFormData({
        name: client.name,
        phone: client.phone,
        email: client.email || '',
        notes: client.notes || '',
      });
      setEditingClientId(clientId);
    }
  };
  
  const handleCancelEdit = () => {
    resetForm();
    setEditingClientId(null);
    setIsAddingClient(false);
  };
  
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          {!isAddingClient && !editingClientId && (
            <Button
              variant="primary"
              onClick={() => setIsAddingClient(true)}
            >
              <Plus size={16} className="mr-2" />
              Novo Cliente
            </Button>
          )}
        </div>
        
        {(isAddingClient || editingClientId) && (
          <Card
            title={editingClientId ? "Editar Cliente" : "Novo Cliente"}
            footer={
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleCancelEdit}>
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={editingClientId ? handleUpdateClient : handleAddClient}
                  disabled={!formData.name || !formData.phone}
                >
                  {editingClientId ? "Atualizar" : "Adicionar"}
                </Button>
              </div>
            }
          >
            <div className="space-y-4">
              <Input
                label="Nome"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                required
              />
              
              <Input
                label="Telefone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                fullWidth
                required
                placeholder="(00) 00000-0000"
              />
              
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
              />
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Observações
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                />
              </div>
            </div>
          </Card>
        )}
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            fullWidth
          />
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredClients.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredClients.map(client => (
                <li key={client.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <User size={16} className="text-gray-400 mr-2" />
                        <h3 className="text-lg font-medium text-gray-900">{client.name}</h3>
                      </div>
                      <div className="mt-1 flex items-center">
                        <Phone size={16} className="text-gray-400 mr-2" />
                        <p className="text-sm text-gray-500">{client.phone}</p>
                      </div>
                      {client.email && (
                        <p className="mt-1 text-sm text-gray-500">{client.email}</p>
                      )}
                      {client.notes && (
                        <p className="mt-2 text-sm text-gray-500">{client.notes}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClient(client.id)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => deleteClient(client.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center">
              <p className="text-gray-500">Nenhum cliente encontrado.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Clients;