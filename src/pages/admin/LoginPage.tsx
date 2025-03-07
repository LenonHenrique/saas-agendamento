import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { Lock } from 'lucide-react';

const ADMIN_PASSWORD = 'giobeauty';

const LoginPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      // Store authentication state
      localStorage.setItem('isAuthenticated', 'true');
      // Redirect to admin dashboard
      window.location.href = '/admin/dashboard';
    } else {
      setError('Senha incorreta. Por favor, tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-pink-600">Giovanna Beauty</h1>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Área Administrativa</h2>
        </div>

        <Card>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex items-center justify-center">
              <div className="p-3 rounded-full bg-pink-100">
                <Lock size={24} className="text-pink-600" />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <Input
              type="password"
              label="Senha"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              placeholder="Digite a senha"
              required
              fullWidth
            />

            <Button type="submit" variant="primary" fullWidth>
              Entrar
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;