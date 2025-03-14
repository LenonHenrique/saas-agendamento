import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import Card from './Card';
import { useAppStore } from '../store';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { initializeData, set } = useAppStore();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async () => {
    if (password === 'giobeauty') {
      try {
        setIsLoading(true);
        setError('');
        
        // Initialize data and ensure it's loaded before redirecting
        await initializeData();
        
        // Close the modal first to prevent state updates after navigation
        onClose();
        
        // Navigate to admin dashboard
        navigate('/admin');
      } catch (error) {
        console.error('Error initializing data:', error);
        setError('Erro ao carregar dados. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    } else {
      setError('Senha incorreta. Tente novamente.');
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card
        title="Login Administrativo"
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              onClick={handleLogin} 
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !isLoading) {
                  handleLogin();
                }
              }}
              disabled={isLoading}
            />
          </div>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          {isLoading && (
            <p className="text-sm text-gray-600">Carregando dados, por favor aguarde...</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default LoginModal;