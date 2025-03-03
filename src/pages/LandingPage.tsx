import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold text-pink-600 mb-8">Giovanna Beauty</h1>
        
        <div className="space-y-4">
          <Button
            variant="primary"
            fullWidth
            onClick={() => navigate('/agendar')}
          >
            Fazer Agendamento
          </Button>
          
          <Button
            variant="outline"
            fullWidth
            onClick={() => navigate('/admin')}
          >
            Área Administrativa
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;