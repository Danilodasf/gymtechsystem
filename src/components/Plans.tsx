
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Plus, Edit, Trash2, CreditCard } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const Plans: React.FC = () => {
  const { plans, deletePlan, students } = useData();

  const handleDelete = (id: string, name: string) => {
    // Check if plan is being used by any student
    const studentsUsingPlan = students.filter(student => student.planId === id);
    
    if (studentsUsingPlan.length > 0) {
      toast({
        title: "Não é possível excluir",
        description: `Este plano está sendo usado por ${studentsUsingPlan.length} aluno(s)`,
        variant: "destructive",
      });
      return;
    }

    if (window.confirm(`Tem certeza que deseja excluir o plano ${name}?`)) {
      deletePlan(id);
      toast({
        title: "Plano excluído",
        description: `${name} foi removido do sistema`,
      });
    }
  };

  const getStudentsCount = (planId: string) => {
    return students.filter(student => student.planId === planId).length;
  };

  return (
    <div className="space-y-3 md:space-y-6">
      <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 xs:gap-0">
        <div>
          <h1 className="text-lg md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Planos
          </h1>
          <p className="text-xs md:text-base text-gray-600 mt-1 md:mt-2">Gerencie os planos da academia</p>
        </div>
        <Link to="/plans/new">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xs md:text-sm h-8 md:h-10 px-3 md:px-4">
            <Plus size={14} className="mr-1 md:mr-2" />
            Novo Plano
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {plans.map((plan) => {
          const studentsCount = getStudentsCount(plan.id);
          return (
            <Card key={plan.id} className="hover:shadow-lg transition-shadow p-2 md:p-4">
              <CardHeader className="pb-2 md:pb-4 p-2 md:p-6">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-sm md:text-xl font-bold text-gray-900 truncate mr-2">{plan.name}</span>
                  <div className="flex space-x-1 md:space-x-2 flex-shrink-0">
                    <Link to={`/plans/edit/${plan.id}`}>
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 h-6 w-6 md:h-8 md:w-8 p-0">
                        <Edit size={12} className="md:hidden" />
                        <Edit size={16} className="hidden md:block" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 h-6 w-6 md:h-8 md:w-8 p-0"
                      onClick={() => handleDelete(plan.id, plan.name)}
                    >
                      <Trash2 size={12} className="md:hidden" />
                      <Trash2 size={16} className="hidden md:block" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 md:space-y-4 p-2 md:p-6 pt-0">
                <div className="space-y-1 md:space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs md:text-sm text-gray-600">Duração:</span>
                    <span className="font-semibold text-xs md:text-sm">
                      {plan.duration} {plan.duration === 1 ? 'mês' : 'meses'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs md:text-sm text-gray-600">Valor:</span>
                    <span className="font-bold text-green-600 text-sm md:text-lg">
                      R$ {plan.price.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs md:text-sm text-gray-600">Alunos:</span>
                    <span className="font-semibold text-blue-600 text-xs md:text-sm">
                      {studentsCount}
                    </span>
                  </div>
                </div>

                {plan.description && (
                  <div className="pt-1 md:pt-2 border-t">
                    <p className="text-xs md:text-sm text-gray-600 line-clamp-2">{plan.description}</p>
                  </div>
                )}

                <div className="pt-1 md:pt-2 border-t">
                  <div className="text-xs md:text-sm text-gray-500">
                    Por mês: R$ {(plan.price / plan.duration).toFixed(2)}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {plans.length === 0 && (
        <Card className="p-3 md:p-6">
          <CardContent className="text-center py-6 md:py-12 p-0">
            <div className="text-gray-500">
              <CreditCard className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-2 md:mb-4 text-gray-300" />
              <h3 className="text-sm md:text-lg font-semibold mb-1 md:mb-2">Nenhum plano cadastrado</h3>
              <p className="text-xs md:text-sm">Comece criando seu primeiro plano para a academia.</p>
              <Link to="/plans/new" className="inline-block mt-2 md:mt-4">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xs md:text-sm h-8 md:h-10 px-3 md:px-4">
                  <Plus size={14} className="mr-1 md:mr-2" />
                  Criar Primeiro Plano
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Plans;
