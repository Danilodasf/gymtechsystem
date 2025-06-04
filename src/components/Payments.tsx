import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseData } from '../contexts/SupabaseDataProvider';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Search, DollarSign, AlertTriangle, CheckCircle, Edit, Trash2 } from 'lucide-react';
import { toast } from '../hooks/use-toast';

// Função para corrigir o problema de fuso horário nas datas
const formatLocalDate = (dateString: string): string => {
  if (!dateString) return '';
  
  // Criar uma data com o fuso horário local
  const date = new Date(dateString);
  
  // Ajustar para o fuso horário local
  const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  
  // Formatar para o padrão brasileiro
  return localDate.toLocaleDateString('pt-BR');
};

const Payments: React.FC = () => {
  const { students, plans, payments, updatePayment, addPayment, deletePayment } = useSupabaseData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showQuickPayment, setShowQuickPayment] = useState<string | null>(null);
  const [paymentDate, setPaymentDate] = useState('');

  const handleMarkAsPaid = (paymentId: string, customDate?: string) => {
    updatePayment(paymentId, {
      status: 'paid',
      paymentDate: customDate || new Date().toISOString().split('T')[0]
    });
    toast({
      title: "Pagamento confirmado",
      description: "O pagamento foi marcado como pago",
    });
    setShowQuickPayment(null);
    setPaymentDate('');
  };

  const handleQuickPayment = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    const plan = plans.find(p => p.id === student?.planId);
    
    if (!student || !plan) return;

    addPayment({
      studentId: student.id,
      planId: plan.id,
      amount: plan.price,
      dueDate: new Date().toISOString().split('T')[0],
      paymentDate: paymentDate || new Date().toISOString().split('T')[0],
      status: 'paid',
      method: 'cash' // Valor interno 'cash', exibido como 'Dinheiro' na interface
    });

    toast({
      title: "Pagamento registrado",
      description: `Pagamento de ${student.name} foi registrado com sucesso`,
    });
    setShowQuickPayment(null);
    setPaymentDate('');
  };

  const handleDeletePayment = (paymentId: string, studentName: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o pagamento de ${studentName}?`)) {
      deletePayment(paymentId);
      toast({
        title: "Pagamento excluído",
        description: "O pagamento foi removido do sistema",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle size={12} className="mr-1" />Pago</Badge>;
      case 'overdue':
        return <Badge variant="destructive"><AlertTriangle size={12} className="mr-1" />Vencido</Badge>;
      default:
        return <Badge variant="secondary"><DollarSign size={12} className="mr-1" />Pendente</Badge>;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const student = students.find(s => s.id === payment.studentId);
    return student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           student?.cpf.includes(searchTerm);
  });

  const pendingPayments = payments.filter(p => p.status === 'pending').length;
  const overduePayments = payments.filter(p => p.status === 'overdue').length;
  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);

  // Filtrar estudantes que não têm pagamentos recentes ou apenas pagamentos pendentes/vencidos
  const studentsForQuickPayment = students.filter(student => {
    if (student.status !== 'active') return false;
    
    const studentPayments = payments.filter(p => p.studentId === student.id);
    const recentPaidPayment = studentPayments.find(p => 
      p.status === 'paid' && 
      new Date(p.paymentDate || p.dueDate) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );
    
    return !recentPaidPayment;
  });

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Gerenciamento de Pagamentos
          </h1>
          <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">Controle os pagamentos e mensalidades dos alunos</p>
        </div>
        <Link to="/payments/new">
          <Button className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm md:text-base h-9 md:h-10 px-3 md:px-4">
            <Plus size={16} className="mr-1 md:mr-2" />
            Novo Pagamento
          </Button>
        </Link>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-4">
            <CardTitle className="text-xs md:text-sm font-medium">Pagamentos Pendentes</CardTitle>
            <DollarSign className="h-3 w-3 md:h-4 md:w-4" />
          </CardHeader>
          <CardContent className="p-3 md:p-4 pt-0">
            <div className="text-lg md:text-2xl font-bold">{pendingPayments}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-4">
            <CardTitle className="text-xs md:text-sm font-medium">Pagamentos Vencidos</CardTitle>
            <AlertTriangle className="h-3 w-3 md:h-4 md:w-4" />
          </CardHeader>
          <CardContent className="p-3 md:p-4 pt-0">
            <div className="text-lg md:text-2xl font-bold">{overduePayments}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-4">
            <CardTitle className="text-xs md:text-sm font-medium">Receita Total</CardTitle>
            <CheckCircle className="h-3 w-3 md:h-4 md:w-4" />
          </CardHeader>
          <CardContent className="p-3 md:p-4 pt-0">
            <div className="text-lg md:text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="flex items-center space-x-2 text-base md:text-lg">
            <Search className="h-4 w-4 md:h-5 md:w-5" />
            <span>Buscar Pagamentos</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-0">
          <Input
            placeholder="Buscar por nome do aluno ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md text-sm md:text-base h-9 md:h-10"
          />
        </CardContent>
      </Card>

      {/* Quick Payment for Students without recent payments */}
      {studentsForQuickPayment.length > 0 && (
        <Card>
          <CardHeader className="p-3 md:p-6">
            <CardTitle className="text-base md:text-lg">Registro Rápido de Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {studentsForQuickPayment.map(student => {
                const plan = plans.find(p => p.id === student.planId);
                
                return (
                  <Card key={student.id} className="p-3 md:p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-sm md:text-base">{student.name}</h4>
                        <p className="text-xs md:text-sm text-gray-600">{plan?.name}</p>
                        <p className="text-xs md:text-sm font-semibold text-green-600">R$ {plan?.price.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    {showQuickPayment === student.id ? (
                      <div className="space-y-2 md:space-y-3">
                        <div>
                          <Label htmlFor={`date-${student.id}`} className="text-xs md:text-sm">Data do Pagamento</Label>
                          <Input
                            id={`date-${student.id}`}
                            type="date"
                            value={paymentDate}
                            onChange={(e) => setPaymentDate(e.target.value)}
                            className="mt-1 text-xs md:text-sm h-8 md:h-9"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm"
                            onClick={() => handleQuickPayment(student.id)}
                            className="bg-green-600 hover:bg-green-700 text-xs md:text-sm h-7 md:h-8 px-2 md:px-3"
                          >
                            Confirmar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setShowQuickPayment(null);
                              setPaymentDate('');
                            }}
                            className="text-xs md:text-sm h-7 md:h-8 px-2 md:px-3"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={() => {
                          setShowQuickPayment(student.id);
                          setPaymentDate(new Date().toISOString().split('T')[0]);
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-xs md:text-sm h-7 md:h-8"
                      >
                        Registrar Pagamento
                      </Button>
                    )}
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payments Table */}
      <Card>
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="text-base md:text-lg">Lista de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs md:text-sm">Aluno</TableHead>
                  <TableHead className="text-xs md:text-sm">Plano</TableHead>
                  <TableHead className="text-xs md:text-sm">Valor</TableHead>
                  <TableHead className="text-xs md:text-sm">Vencimento</TableHead>
                  <TableHead className="text-xs md:text-sm">Status</TableHead>
                  <TableHead className="text-xs md:text-sm">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => {
                  const student = students.find(s => s.id === payment.studentId);
                  const plan = plans.find(p => p.id === payment.planId);
                  
                  return (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-xs md:text-sm">{student?.name}</div>
                          <div className="text-xs text-gray-500">{student?.cpf}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs md:text-sm">{plan?.name}</TableCell>
                      <TableCell className="font-semibold text-xs md:text-sm">R$ {payment.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-xs md:text-sm">
                        {formatLocalDate(payment.dueDate)}
                      </TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1 md:space-x-2">
                          {payment.status !== 'paid' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkAsPaid(payment.id)}
                              className="text-green-600 hover:bg-green-50 text-xs h-6 md:h-8 px-1 md:px-2"
                            >
                              Marcar como Pago
                            </Button>
                          )}
                          
                          <Link to={`/payments/edit/${payment.id}`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-blue-600 hover:bg-blue-50 text-xs h-6 md:h-8 px-1 md:px-2"
                            >
                              <Edit size={12} />
                            </Button>
                          </Link>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeletePayment(payment.id, student?.name || '')}
                            className="text-red-600 hover:bg-red-50 text-xs h-6 md:h-8 px-1 md:px-2"
                          >
                            <Trash2 size={12} />
                          </Button>
                        </div>
                        
                        {payment.status === 'paid' && payment.paymentDate && (
                          <div className="text-xs text-gray-500 mt-1">
                            Pago em {formatLocalDate(payment.paymentDate)}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {filteredPayments.length === 0 && (
              <div className="text-center py-6 md:py-8 text-gray-500">
                <DollarSign className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 text-gray-300" />
                <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">Nenhum pagamento encontrado</h3>
                <p className="text-xs md:text-sm">Não há pagamentos cadastrados ou que correspondam à sua busca.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;
