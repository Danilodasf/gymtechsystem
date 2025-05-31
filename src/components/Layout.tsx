
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SidebarProvider, SidebarInset, SidebarTrigger } from './ui/sidebar';
import { AppSidebar } from './AppSidebar';

const Layout: React.FC = () => {
  const location = useLocation();

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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="sticky top-0 z-50 flex h-12 md:h-14 shrink-0 items-center gap-2 px-2 md:px-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm">
            <SidebarTrigger className="-ml-1 h-6 w-6 md:h-7 md:w-7 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300" />
            
            {/* Título da página atual */}
            <div className="flex items-center gap-2 ml-1">
              <div className="h-4 md:h-5 w-px bg-slate-300 dark:bg-slate-600"></div>
              <h1 className="text-sm md:text-base font-semibold text-slate-800 dark:text-slate-200 truncate">
                {currentPageTitle}
              </h1>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                Online
              </div>
            </div>
          </header>
          <main className="flex-1 p-2 md:p-4 lg:p-6 max-w-7xl mx-auto w-full">
            <div className="animate-fade-in">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
