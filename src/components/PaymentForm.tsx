import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useCreatePayment, useUpdatePayment, usePayment } from '../hooks/usePayments';
import { useSupabaseData } from '../contexts/SupabaseDataProvider';
import { Payment } from '../types';
import { toast } from '../hooks/use-toast';
import { useNavigate, useParams } from 'react-router-dom';

interface PaymentFormProps {
  payment?: Payment;
  onClose?: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ payment, onClose }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    planId: '',
    amount: 0,
    dueDate: '',
    paymentDate: '',
    status: 'pending' as 'pending' | 'paid' | 'overdue',
    method: '' as 'cash' | 'card' | 'pix' | 'transfer' | ''
  });

  const { students, plans } = useSupabaseData();
  const createPaymentMutation = useCreatePayment();
  const updatePaymentMutation = useUpdatePayment();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: paymentData, isLoading } = usePayment(id || '');

  useEffect(() => {
    // Se o componente for carregado diretamente via rota, usar o paymentData do hook
    if (id && paymentData && !payment) {
      setFormData({
        studentId: paymentData.studentId,
        planId: paymentData.planId,
        amount: paymentData.amount,
        dueDate: paymentData.dueDate,
        paymentDate: paymentData.paymentDate || '',
        status: paymentData.status,
        method: paymentData.method || ''
      });
    }
  }, [id, paymentData, payment]);

  useEffect(() => {
    if (payment) {
      setFormData({
        studentId: payment.studentId,
        planId: payment.planId,
        amount: payment.amount,
        dueDate: payment.dueDate,
        paymentDate: payment.paymentDate || '',
        status: payment.status,
        method: payment.method || ''
      });
    }
  }, [payment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const paymentData = {
      ...formData,
      paymentDate: formData.paymentDate || undefined,
      method: formData.method || undefined
    };

    try {
      if (payment || id) {
        await updatePaymentMutation.mutateAsync({
          id: payment?.id || id || '',
          payment: paymentData
        });
        toast({
          title: "Pagamento atualizado",
          description: "O pagamento foi atualizado com sucesso.",
        });
      } else {
        await createPaymentMutation.mutateAsync(paymentData);
        toast({
          title: "Pagamento criado",
          description: "O pagamento foi criado com sucesso.",
        });
      }
      
      if (onClose) {
        onClose();
      } else {
        // Se não houver função onClose, navegar de volta para a lista de pagamentos
        navigate('/payments');
      }
    } catch (error) {
      console.error('Erro ao salvar pagamento:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o pagamento.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value
    }));
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    } else {
      // Se não houver função onClose, navegar de volta para a lista de pagamentos
      navigate('/payments');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>{payment || id ? 'Editar Pagamento' : 'Novo Pagamento'}</CardTitle>
        <CardDescription>
          {payment || id ? 'Atualize as informações do pagamento' : 'Preencha os dados do novo pagamento'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && id ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="studentId">Aluno</Label>
              <Select value={formData.studentId} onValueChange={(value) => setFormData(prev => ({ ...prev, studentId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um aluno" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="planId">Plano</Label>
              <Select value={formData.planId} onValueChange={(value) => setFormData(prev => ({ ...prev, planId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um plano" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name} - R$ {plan.price.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Data de Vencimento</Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentDate">Data de Pagamento</Label>
              <Input
                id="paymentDate"
                name="paymentDate"
                type="date"
                value={formData.paymentDate}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: 'pending' | 'paid' | 'overdue') => setFormData(prev => ({ ...prev, status: value }))}>
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

            <div className="space-y-2">
              <Label htmlFor="method">Método de Pagamento</Label>
              <Select value={formData.method} onValueChange={(value: 'cash' | 'card' | 'pix' | 'transfer') => setFormData(prev => ({ ...prev, method: value }))}>
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

            <div className="flex space-x-2">
              <Button
                type="submit"
                disabled={createPaymentMutation.isPending || updatePaymentMutation.isPending}
              >
                {createPaymentMutation.isPending || updatePaymentMutation.isPending ? 'Salvando...' : payment || id ? 'Atualizar' : 'Criar'}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
