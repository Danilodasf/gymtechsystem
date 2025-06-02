
import React from 'react';
import { useSupabaseData } from '../contexts/SupabaseDataProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Users, CreditCard, AlertTriangle, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { students, plans, studentsLoading, plansLoading } = useSupabaseData();

  console.log('Dashboard - students:', students.length, 'plans:', plans.length);

  if (studentsLoading || plansLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const activeStudents = students.filter(student => student.status === 'active').length;
  const expiredStudents = students.filter(student => student.status === 'expired').length;
  const totalStudents = students.length;

  // Students expiring in the next 30 days
  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  const expiringStudents = students.filter(student => {
    const expirationDate = new Date(student.expirationDate);
    return expirationDate >= today && expirationDate <= thirtyDaysFromNow && student.status === 'active';
  }).length;

  const planStats = plans.map(plan => ({
    ...plan,
    studentsCount: students.filter(student => student.planId === plan.id).length
  }));

  return (
    <div className="space-y-4 md:space-y-8">
      <div>
        <h1 className="text-lg md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-xs md:text-base text-gray-600 mt-1 md:mt-2">Visão geral do sistema</p>
      </div>

      {/* Stats Cards - Mobile optimized grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-2 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium">Total Alunos</CardTitle>
            <Users className="h-3 w-3 md:h-4 md:w-4" />
          </CardHeader>
          <CardContent className="p-2 md:p-6 pt-0">
            <div className="text-lg md:text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-blue-100 hidden xs:block">
              {activeStudents} ativos
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-2 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium">Ativos</CardTitle>
            <TrendingUp className="h-3 w-3 md:h-4 md:w-4" />
          </CardHeader>
          <CardContent className="p-2 md:p-6 pt-0">
            <div className="text-lg md:text-2xl font-bold">{activeStudents}</div>
            <p className="text-xs text-green-100 hidden xs:block">
              {totalStudents > 0 ? ((activeStudents / totalStudents) * 100).toFixed(0) : 0}%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-2 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium">Vencendo</CardTitle>
            <AlertTriangle className="h-3 w-3 md:h-4 md:w-4" />
          </CardHeader>
          <CardContent className="p-2 md:p-6 pt-0">
            <div className="text-lg md:text-2xl font-bold">{expiringStudents}</div>
            <p className="text-xs text-orange-100 hidden xs:block">
              30 dias
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-2 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium">Planos</CardTitle>
            <CreditCard className="h-3 w-3 md:h-4 md:w-4" />
          </CardHeader>
          <CardContent className="p-2 md:p-6 pt-0">
            <div className="text-lg md:text-2xl font-bold">{plans.length}</div>
            <p className="text-xs text-purple-100 hidden xs:block">
              disponíveis
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Plans Statistics - Mobile optimized */}
      <Card className="p-2 md:p-6">
        <CardHeader className="p-2 md:p-6">
          <CardTitle className="text-sm md:text-lg">Distribuição por Planos</CardTitle>
          <CardDescription className="text-xs md:text-sm">Alunos por tipo de plano</CardDescription>
        </CardHeader>
        <CardContent className="p-2 md:p-6 pt-0">
          <div className="space-y-2 md:space-y-4">
            {planStats.length > 0 ? planStats.map(plan => (
              <div key={plan.id} className="flex items-center justify-between p-2 md:p-4 bg-gray-50 rounded-lg">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 text-xs md:text-sm truncate">{plan.name}</h3>
                  <p className="text-xs text-gray-600">
                    {plan.duration} {plan.duration === 1 ? 'mês' : 'meses'} - R$ {plan.price.toFixed(2)}
                  </p>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <div className="text-lg md:text-2xl font-bold text-blue-600">{plan.studentsCount}</div>
                  <p className="text-xs text-gray-500">alunos</p>
                </div>
              </div>
            )) : (
              <p className="text-center text-gray-500 py-4">Nenhum plano cadastrado</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions - Mobile optimized */}
      <Card className="p-2 md:p-6">
        <CardHeader className="p-2 md:p-6">
          <CardTitle className="text-sm md:text-lg">Ações Rápidas</CardTitle>
          <CardDescription className="text-xs md:text-sm">Acesso às funcionalidades principais</CardDescription>
        </CardHeader>
        <CardContent className="p-2 md:p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
            <a
              href="/students/new"
              className="p-3 md:p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200 group"
            >
              <Users className="h-6 w-6 md:h-8 md:w-8 text-blue-600 mb-1 md:mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-blue-900 text-xs md:text-sm">Novo Aluno</h3>
              <p className="text-xs text-blue-700">Cadastrar aluno</p>
            </a>

            <a
              href="/plans/new"
              className="p-3 md:p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200 group"
            >
              <CreditCard className="h-6 w-6 md:h-8 md:w-8 text-purple-600 mb-1 md:mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-purple-900 text-xs md:text-sm">Novo Plano</h3>
              <p className="text-xs text-purple-700">Criar plano</p>
            </a>

            <a
              href="/reports"
              className="p-3 md:p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200 group"
            >
              <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-green-600 mb-1 md:mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-green-900 text-xs md:text-sm">Relatórios</h3>
              <p className="text-xs text-green-700">Ver relatórios</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
