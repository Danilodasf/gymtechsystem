
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from '../hooks/use-toast';
import { Plan } from '../types';
import { formatCurrency } from '../utils/validators';

const PlanForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { plans, addPlan, updatePlan } = useData();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    duration: 1,
    price: '',
    description: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    duration: '',
    price: ''
  });

  useEffect(() => {
    if (isEditing && id) {
      const plan = plans.find(p => p.id === id);
      if (plan) {
        setFormData({
          name: plan.name,
          duration: plan.duration,
          price: formatCurrency((plan.price * 100).toString()),
          description: plan.description || ''
        });
      }
    }
  }, [id, isEditing, plans]);

  const validateForm = () => {
    const newErrors = {
      name: '',
      duration: '',
      price: ''
    };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Nome do plano é obrigatório';
      isValid = false;
    }

    if (formData.duration < 1 || formData.duration > 24) {
      newErrors.duration = 'Duração deve ser entre 1 e 24 meses';
      isValid = false;
    }

    const numericPrice = parseFloat(formData.price.replace(/\D/g, '')) / 100;
    if (!formData.price || numericPrice <= 0) {
      newErrors.price = 'Valor deve ser maior que zero';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Converter valor formatado para número
    const numericPrice = parseFloat(formData.price.replace(/\D/g, '')) / 100;

    const planData = {
      name: formData.name,
      duration: formData.duration,
      price: numericPrice,
      description: formData.description
    };

    if (isEditing && id) {
      updatePlan(id, planData);
      toast({
        title: "Plano atualizado",
        description: "Os dados do plano foram atualizados com sucesso",
      });
    } else {
      addPlan(planData as Omit<Plan, 'id'>);
      toast({
        title: "Plano cadastrado",
        description: "Novo plano foi adicionado ao sistema",
      });
    }

    navigate('/plans');
  };

  const handleInputChange = (field: string, value: string | number) => {
    let formattedValue = value;

    if (field === 'price' && typeof value === 'string') {
      formattedValue = formatCurrency(value);
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    
    // Limpar erro do campo ao digitar
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const numericPrice = parseFloat(formData.price.replace(/\D/g, '')) / 100;

  return (
    <div className="max-w-2xl mx-auto space-y-3 md:space-y-6">
      <div>
        <h1 className="text-lg md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {isEditing ? 'Editar Plano' : 'Novo Plano'}
        </h1>
        <p className="text-xs md:text-base text-gray-600 mt-1 md:mt-2">
          {isEditing ? 'Atualize os dados do plano' : 'Preencha os dados para cadastrar um novo plano'}
        </p>
      </div>

      <Card className="p-2 md:p-6">
        <CardHeader className="p-2 md:p-6">
          <CardTitle className="text-sm md:text-lg">Dados do Plano</CardTitle>
        </CardHeader>
        <CardContent className="p-2 md:p-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-6">
            <div className="space-y-1 md:space-y-2">
              <Label htmlFor="name" className="text-xs md:text-sm">Nome do Plano *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ex: Plano Mensal, Plano Trimestral..."
                required
                className={`text-xs md:text-sm h-8 md:h-10 ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 md:gap-6">
              <div className="space-y-1 md:space-y-2">
                <Label htmlFor="duration" className="text-xs md:text-sm">Duração (meses) *</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  max="24"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 1)}
                  required
                  className={`text-xs md:text-sm h-8 md:h-10 ${errors.duration ? 'border-red-500' : ''}`}
                />
                {errors.duration && (
                  <p className="text-xs text-red-500">{errors.duration}</p>
                )}
              </div>

              <div className="space-y-1 md:space-y-2">
                <Label htmlFor="price" className="text-xs md:text-sm">Valor (R$) *</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0,00"
                  required
                  className={`text-xs md:text-sm h-8 md:h-10 ${errors.price ? 'border-red-500' : ''}`}
                />
                {errors.price && (
                  <p className="text-xs text-red-500">{errors.price}</p>
                )}
              </div>
            </div>

            <div className="space-y-1 md:space-y-2">
              <Label htmlFor="description" className="text-xs md:text-sm">Descrição (opcional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descreva os benefícios e características do plano..."
                rows={3}
                className="text-xs md:text-sm resize-none"
              />
            </div>

            {formData.duration > 0 && numericPrice > 0 && (
              <div className="p-2 md:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-1 md:mb-2 text-xs md:text-sm">Resumo do Plano</h3>
                <div className="space-y-1 text-xs text-blue-800">
                  <p>• Duração: {formData.duration} {formData.duration === 1 ? 'mês' : 'meses'}</p>
                  <p>• Valor total: R$ {numericPrice.toFixed(2)}</p>
                  <p>• Valor por mês: R$ {(numericPrice / formData.duration).toFixed(2)}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-2 md:space-x-4 pt-3 md:pt-6">
              <Button 
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xs md:text-sm h-8 md:h-10"
              >
                {isEditing ? 'Atualizar' : 'Cadastrar'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/plans')}
                className="text-xs md:text-sm h-8 md:h-10"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanForm;
