import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Badge } from './ui/badge';
import { Plus, Edit, Trash2, DollarSign, Calendar } from 'lucide-react';
import { usePlans, useDeletePlan } from '../hooks/usePlans';
import PlanForm from './PlanForm';
import { Plan } from '../types';
import { toast } from '../hooks/use-toast';

const Plans: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const { data: plans = [], isLoading } = usePlans();
  const deletePlanMutation = useDeletePlan();

  const handleEdit = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePlanMutation.mutateAsync(id);
      toast({
        title: "Plano excluído",
        description: "O plano foi excluído com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao deletar plano:', error);
      
      // Verificar se é o erro específico de alunos associados
      const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro ao excluir o plano.";
      const isStudentsError = errorMessage.includes("aluno(s) associado(s)");
      
      toast({
        title: isStudentsError ? "Não é possível excluir" : "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedPlan(undefined);
  };

  const handleNewPlan = () => {
    setSelectedPlan(undefined);
    setIsFormOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 md:space-y-8">
        <div className="flex flex-col gap-2 md:gap-0 md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-lg md:text-3xl font-bold">Planos</h1>
            <p className="text-xs md:text-base text-gray-600 mt-1">Carregando planos...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-8">
      <div className="flex flex-col gap-2 md:gap-0 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-lg md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Planos
          </h1>
          <p className="text-xs md:text-base text-gray-600 mt-1">
            {plans.length} {plans.length === 1 ? 'plano cadastrado' : 'planos cadastrados'}
          </p>
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewPlan} className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
              <Plus size={16} className="mr-2" />
              Novo Plano
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <PlanForm plan={selectedPlan} onClose={handleCloseForm} />
          </DialogContent>
        </Dialog>
      </div>

      {plans.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-gray-500 mb-4">
              <Calendar size={64} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Nenhum plano cadastrado</p>
              <p className="text-sm">Comece criando seu primeiro plano</p>
            </div>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleNewPlan}>
                  <Plus size={16} className="mr-2" />
                  Criar Primeiro Plano
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <PlanForm plan={selectedPlan} onClose={handleCloseForm} />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg text-gray-900">{plan.name}</CardTitle>
                    <CardDescription className="text-sm text-gray-600 mt-1">
                      {plan.description || 'Sem descrição'}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {plan.duration} {plan.duration === 1 ? 'mês' : 'meses'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-green-600">
                    <DollarSign size={18} className="mr-1" />
                    <span className="text-xl font-bold">R$ {plan.price.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleEdit(plan)}
                      >
                        <Edit size={14} className="mr-1" />
                        Editar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <PlanForm plan={selectedPlan} onClose={handleCloseForm} />
                    </DialogContent>
                  </Dialog>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        <Trash2 size={14} className="mr-1" />
                        Excluir
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir o plano "{plan.name}"? 
                          Esta ação não pode ser desfeita.
                          <br /><br />
                          <strong>Nota:</strong> Não é possível excluir planos que possuem alunos associados.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(plan.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Plans;
