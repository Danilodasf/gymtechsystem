import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  Calendar, 
  GraduationCap, 
  Package, 
  DollarSign, 
  BarChart3,
  LogOut,
  Zap,
  Settings
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  // Get username from user metadata or fallback to email
  const getUserDisplayName = () => {
    if (user?.user_metadata?.username) {
      return user.user_metadata.username;
    }
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    return user?.email?.split('@')[0] || 'Usuário';
  };

  const getInitials = () => {
    const displayName = getUserDisplayName();
    return displayName.charAt(0).toUpperCase();
  };

  // Mapear rotas para títulos das páginas
  const getPageTitle = (pathname: string) => {
    const routes: { [key: string]: string } = {
      '/dashboard': 'Dashboard',
      '/students': 'Alunos',
      '/students/new': 'Novo Aluno',
      '/students/edit': 'Editar Aluno',
      '/classes': 'Aulas',
      '/classes/new': 'Nova Aula',
      '/classes/edit': 'Editar Aula',
      '/teachers': 'Professores',
      '/teachers/new': 'Novo Professor',
      '/teachers/edit': 'Editar Professor',
      '/plans': 'Planos',
      '/plans/new': 'Novo Plano',
      '/plans/edit': 'Editar Plano',
      '/payments': 'Pagamentos',
      '/payments/new': 'Novo Pagamento',
      '/reports': 'Relatórios',
      '/profile': 'Perfil'
    };

    // Verificar se é uma rota de edição com ID
    if (pathname.includes('/edit/')) {
      if (pathname.includes('/students/edit/')) return 'Editar Aluno';
      if (pathname.includes('/classes/edit/')) return 'Editar Aula';
      if (pathname.includes('/teachers/edit/')) return 'Editar Professor';
      if (pathname.includes('/plans/edit/')) return 'Editar Plano';
    }

    return routes[pathname] || 'GymTech';
  };

  const currentPageTitle = getPageTitle(location.pathname);

  const menuItems = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Alunos", url: "/students", icon: Users },
    { title: "Aulas", url: "/classes", icon: Calendar },
    { title: "Professores", url: "/teachers", icon: GraduationCap },
    { title: "Planos", url: "/plans", icon: Package },
    { title: "Pagamentos", url: "/payments", icon: DollarSign },
    { title: "Relatórios", url: "/reports", icon: BarChart3 },
  ];

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const handleMenuClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/50 px-3 py-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Link to="/dashboard" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-7 h-7 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                GymTech
              </span>
            </Link>
            
            {/* Divisor e título da página */}
            <div className="h-5 w-px bg-slate-300 flex-shrink-0"></div>
            <span className="text-sm font-medium text-slate-700 truncate">
              {currentPageTitle}
            </span>
          </div>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="md:hidden fixed top-14 left-0 right-0 bottom-0 z-50 bg-white overflow-y-auto">
            <div className="p-3 space-y-1">
              {/* User Info */}
              <div className="p-3 mb-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {getInitials()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 text-sm truncate">{getUserDisplayName()}</p>
                    <p className="text-xs text-slate-500">Administrador</p>
                  </div>
                </div>
              </div>

              {/* Navigation Items */}
              {menuItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  onClick={handleMenuClick}
                  className={`
                    flex items-center gap-3 p-3 rounded-xl transition-all duration-200
                    ${isActive(item.url)
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                      : 'text-slate-700 hover:bg-slate-100'
                    }
                  `}
                >
                  <item.icon size={18} />
                  <span className="font-medium text-sm">{item.title}</span>
                </Link>
              ))}

              {/* Profile Link */}
              <Link
                to="/profile"
                onClick={handleMenuClick}
                className="flex items-center gap-3 p-3 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <Settings size={18} />
                <span className="font-medium text-sm">Perfil</span>
              </Link>

              {/* Logout Button */}
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start p-3 h-auto text-red-600 hover:text-red-700 hover:bg-red-50 text-sm"
              >
                <LogOut size={18} className="mr-3" />
                <span className="font-medium">Sair</span>
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Spacer for fixed header */}
      <div className="md:hidden h-14" />
    </>
  );
};

export default MobileNavigation;
