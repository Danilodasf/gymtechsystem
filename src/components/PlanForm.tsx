
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useCreatePlan, useUpdatePlan } from '../hooks/usePlans';
import { Plan } from '../types';
import { toast } from '../hooks/use-toast';

interface PlanFormProps {
  plan?: Plan;
  onClose: () => void;
}

const PlanForm: React.FC<PlanFormProps> = ({ plan, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    duration: 1,
    price: 0,
    description: ''
  });

  const createPlanMutation = useCreatePlan();
  const updatePlanMutation = useUpdatePlan();

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name,
        duration: plan.duration,
        price: plan.price,
        description: plan.description || ''
      });
    }
  }, [plan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (plan) {
        await updatePlanMutation.mutateAsync({
          id: plan.id,
          plan: formData
        });
        toast({
          title: "Plano atualizado",
          description: "O plano foi atualizado com sucesso.",
        });
      } else {
        await createPlanMutation.mutateAsync(formData);
        toast({
          title: "Plano criado",
          description: "O plano foi criado com sucesso.",
        });
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar plano:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o plano.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' || name === 'price' ? Number(value) : value
    }));
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{plan ? 'Editar Plano' : 'Novo Plano'}</CardTitle>
        <CardDescription>
          {plan ? 'Atualize as informações do plano' : 'Preencha os dados do novo plano'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Plano</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duração (meses)</Label>
            <Input
              id="duration"
              name="duration"
              type="number"
              min="1"
              value={formData.duration}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Preço (R$)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="flex space-x-2">
            <Button
              type="submit"
              disabled={createPlanMutation.isPending || updatePlanMutation.isPending}
            >
              {createPlanMutation.isPending || updatePlanMutation.isPending ? 'Salvando...' : plan ? 'Atualizar' : 'Criar'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PlanForm;
