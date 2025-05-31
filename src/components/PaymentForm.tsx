
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from '../hooks/use-toast';
import { Payment } from '../types';
import { formatCurrency } from '../utils/validators';

const PaymentForm: React.FC = () => {
  const navigate = useNavigate();
  const { students, plans, addPayment } = useData();

  const [formData, setFormData] = useState({
    studentId: '',
    planId: '',
    amount: '',
    dueDate: '',
    paymentDate: '',
    method: '',
    status: 'pending' as 'pending' | 'paid' | 'overdue'
  });

  const [errors, setErrors] = useState({
    studentId: '',
    amount: '',
    dueDate: ''
  });

  const validateForm = () => {
    const newErrors = {
      studentId: '',
      amount: '',
      dueDate: ''
    };
    let isValid = true;

    if (!formData.studentId) {
      newErrors.studentId = 'Selecione um aluno';
      isValid = false;
    }

    if (!formData.amount || parseFloat(formData.amount.replace(/\D/g, '')) <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero';
      isValid = false;
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Data de vencimento é obrigatória';
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

    const selectedStudent = students.find(s => s.id === formData.studentId);
    const selectedPlan = plans.find(p => p.id === formData.planId);

    if (!selectedStudent) {
      toast({
        title: "Erro",
        description: "Selecione um aluno válido",
        variant: "destructive",
      });
      return;
    }

    // Converter valor formatado para número
    const numericAmount = parseFloat(formData.amount.replace(/\D/g, '')) / 100;

    addPayment({
      studentId: formData.studentId,
      planId: formData.planId,
      amount: numericAmount,
      dueDate: formData.dueDate,
      paymentDate: formData.paymentDate || undefined,
      status: formData.status,
      method: formData.method as 'cash' | 'card' | 'pix' | 'transfer'
    } as Omit<Payment, 'id'>);

    toast({
      title: "Pagamento cadastrado",
      description: "Novo pagamento foi adicionado ao sistema",
    });

    navigate('/payments');
  };

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;

    if (field === 'amount') {
      formattedValue = formatCurrency(value);
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }));

    // Auto-fill plan and amount when student is selected
    if (field === 'studentId') {
      const student = students.find(s => s.id === value);
      if (student) {
        const plan = plans.find(p => p.id === student.planId);
        if (plan) {
          setFormData(prev => ({
            ...prev,
            planId: plan.id,
            amount: formatCurrency((plan.price * 100).toString())
          }));
        }
      }
    }

    // Limpar erro do campo ao digitar
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Cadastrar Pagamento
        </h1>
        <p className="text-gray-600 mt-2">Registre um novo pagamento de mensalidade</p>
      </div>

      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="text-white">Dados do Pagamento</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="studentId">Aluno *</Label>
                <Select value={formData.studentId} onValueChange={(value) => handleInputChange('studentId', value)}>
                  <SelectTrigger className={errors.studentId ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecione um aluno" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} - {student.cpf}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.studentId && (
                  <p className="text-sm text-red-500">{errors.studentId}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="planId">Plano</Label>
                <Select value={formData.planId} onValueChange={(value) => handleInputChange('planId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um plano" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map(plan => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name} - R$ {plan.price.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Valor (R$) *</Label>
                <Input
                  id="amount"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  placeholder="0,00"
                  required
                  className={errors.amount ? 'border-red-500' : ''}
                />
                {errors.amount && (
                  <p className="text-sm text-red-500">{errors.amount}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Data de Vencimento *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  required
                  className={errors.dueDate ? 'border-red-500' : ''}
                />
                {errors.dueDate && (
                  <p className="text-sm text-red-500">{errors.dueDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentDate">Data de Pagamento</Label>
                <Input
                  id="paymentDate"
                  type="date"
                  value={formData.paymentDate}
                  onChange={(e) => handleInputChange('paymentDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="method">Método de Pagamento</Label>
                <Select value={formData.method} onValueChange={(value) => handleInputChange('method', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Dinheiro</SelectItem>
                    <SelectItem value="card">Cartão</SelectItem>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="transfer">Transferência</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="paid">Pago</SelectItem>
                    <SelectItem value="overdue">Vencido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex space-x-4 pt-6">
              <Button 
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Cadastrar
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/payments')}
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

export default PaymentForm;
