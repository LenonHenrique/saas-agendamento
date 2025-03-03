import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Users, Clock, Settings, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  const navigation = [
    { name: 'Agenda', href: '/admin', icon: Calendar },
    { name: 'Clientes', href: '/admin/clientes', icon: Users },
    { name: 'Horários', href: '/admin/horarios', icon: Clock },
    { name: 'Configurações', href: '/admin/configuracoes', icon: Settings },
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu */}
      <div className="lg:hidden">
        <div className="fixed inset-0 flex z-40">
          {/* Overlay */}
          {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
          
          {/* Mobile menu sidebar */}
          <div 
            className={`
              fixed inset-y-0 left-0 flex flex-col w-64 max-w-xs bg-white transform transition-transform ease-in-out duration-300
              ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
          >
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
              <h1 className="text-xl font-bold text-pink-600">Giovanna Beauty</h1>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center px-2 py-2 text-base font-medium rounded-md
                    ${isActive(item.href)
                      ? 'bg-pink-100 text-pink-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-6 w-6 ${
                      isActive(item.href) ? 'text-pink-500' : 'text-gray-400'
                    }`}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-pink-600">Giovanna Beauty</h1>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md
                  ${isActive(item.href)
                    ? 'bg-pink-100 text-pink-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                <item.icon
                  className={`mr-3 flex-shrink-0 h-6 w-6 ${
                    isActive(item.href) ? 'text-pink-500' : 'text-gray-400'
                  }`}
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 lg:hidden">
          <button
            type="button"
            className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500 lg:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <span className="sr-only">Abrir menu</span>
            <Menu size={24} />
          </button>
          <div className="flex-1 flex justify-center px-4">
            <h1 className="text-xl font-bold text-pink-600">Giovanna Beauty</h1>
          </div>
        </div>
        
        <main className="flex-1 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;