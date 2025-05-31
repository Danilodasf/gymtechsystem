
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Label } from './ui/label';
import { Search, Plus, Edit, Trash2, CreditCard, DollarSign, Calendar as CalendarIcon, CheckCircle } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import { Student, Payment } from '../types';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

const Students: React.FC = () => {
  const { students, deleteStudent, getPlanById, payments, updatePayment, addPayment, plans } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.cpf.includes(searchTerm) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o aluno ${name}?`)) {
      deleteStudent(id);
      toast({
        title: "Aluno excluído",
        description: `${name} foi removido do sistema`,
      });
    }
  };

  const handlePaymentClick = (student: Student) => {
    setSelectedStudent(student);
    setIsPaymentDialogOpen(true);
  };

  const handleMarkAsPaid = (paymentId: string) => {
    updatePayment(paymentId, {
      status: 'paid',
      paymentDate: selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    });
    toast({
      title: "Pagamento confirmado",
      description: "O pagamento foi marcado como pago",
    });
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
      paymentDate: selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      status: 'paid',
      method: 'cash'
    });

    toast({
      title: "Pagamento registrado",
      description: `Pagamento de ${student.name} foi registrado com sucesso`,
    });
  };

  const getStudentPayments = (studentId: string) => {
    return payments.filter(payment => payment.studentId === studentId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">Ativo</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expirado</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inativo</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle size={12} className="mr-1" />Pago</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Vencido</Badge>;
      default:
        return <Badge variant="secondary"><DollarSign size={12} className="mr-1" />Pendente</Badge>;
    }
  };

  return (
    <div className="space-y-3 md:space-y-6">
      <div className="flex flex-col gap-2 md:gap-0 md:flex-row md:justify-between md:items-center">
        <div className="mb-2 md:mb-0">
          <h1 className="text-lg md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Gerenciamento de Alunos
          </h1>
          <p className="text-xs md:text-base text-gray-600 mt-1">Visualize e gerencie todos os alunos cadastrados</p>
        </div>
        <Link to="/students/new">
          <Button className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xs md:text-sm h-8 md:h-10">
            <Plus size={14} className="mr-1 md:mr-2" />
            Novo Aluno
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="flex flex-col gap-3 md:gap-0 md:flex-row md:items-center md:justify-between">
            <span className="text-sm md:text-xl">Lista de Alunos</span>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Buscar por nome, CPF ou e-mail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-xs md:text-sm h-8 md:h-10"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 md:py-3 px-2 md:px-4 font-semibold text-xs md:text-sm">Nome</th>
                  <th className="text-left py-2 md:py-3 px-2 md:px-4 font-semibold text-xs md:text-sm">CPF</th>
                  <th className="text-left py-2 md:py-3 px-2 md:px-4 font-semibold text-xs md:text-sm">Plano</th>
                  <th className="text-left py-2 md:py-3 px-2 md:px-4 font-semibold text-xs md:text-sm">Status</th>
                  <th className="text-left py-2 md:py-3 px-2 md:px-4 font-semibold text-xs md:text-sm">Vencimento</th>
                  <th className="text-center py-2 md:py-3 px-2 md:px-4 font-semibold text-xs md:text-sm">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => {
                  const plan = getPlanById(student.planId);
                  return (
                    <tr key={student.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-2 md:py-3 px-2 md:px-4">
                        <div>
                          <div className="font-medium text-xs md:text-sm">{student.name}</div>
                          <div className="text-xs text-gray-500">{student.email}</div>
                        </div>
                      </td>
                      <td className="py-2 md:py-3 px-2 md:px-4 text-gray-600 text-xs md:text-sm">{student.cpf}</td>
                      <td className="py-2 md:py-3 px-2 md:px-4">
                        <span className="text-blue-600 font-medium text-xs md:text-sm">
                          {plan?.name || 'Plano não encontrado'}
                        </span>
                      </td>
                      <td className="py-2 md:py-3 px-2 md:px-4">{getStatusBadge(student.status)}</td>
                      <td className="py-2 md:py-3 px-2 md:px-4 text-gray-600 text-xs md:text-sm">
                        {new Date(student.expirationDate).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-2 md:py-3 px-2 md:px-4">
                        <div className="flex justify-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600 hover:bg-green-50 h-6 w-6 md:h-8 md:w-8 p-0"
                            onClick={() => handlePaymentClick(student)}
                          >
                            <CreditCard size={12} className="md:hidden" />
                            <CreditCard size={16} className="hidden md:block" />
                          </Button>
                          <Link to={`/students/edit/${student.id}`}>
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 h-6 w-6 md:h-8 md:w-8 p-0">
                              <Edit size={12} className="md:hidden" />
                              <Edit size={16} className="hidden md:block" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50 h-6 w-6 md:h-8 md:w-8 p-0"
                            onClick={() => handleDelete(student.id, student.name)}
                          >
                            <Trash2 size={12} className="md:hidden" />
                            <Trash2 size={16} className="hidden md:block" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredStudents.length === 0 && (
              <div className="text-center py-8 md:py-12 text-gray-500">
                <div className="text-xs md:text-base">
                  {searchTerm ? 'Nenhum aluno encontrado com os critérios de busca.' : 'Nenhum aluno cadastrado ainda.'}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Pagamentos - {selectedStudent?.name}</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedStudent && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Aluno</p>
                    <p className="font-medium">{selectedStudent.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Plano</p>
                    <p className="font-medium">{getPlanById(selectedStudent.planId)?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    {getStatusBadge(selectedStudent.status)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Vencimento do Plano</p>
                    <p className="font-medium">{new Date(selectedStudent.expirationDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              </div>

              {/* Calendar for selecting payment date */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Selecionar Data do Pagamento</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "dd/MM/yyyy") : <span>Selecionar data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                
                <Button
                  onClick={() => handleQuickPayment(selectedStudent.id)}
                  className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle size={16} className="mr-2" />
                  Registrar Pagamento para {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "hoje"}
                </Button>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Histórico de Pagamentos</h3>
                <div className="space-y-3">
                  {getStudentPayments(selectedStudent.id).map((payment) => {
                    const plan = getPlanById(payment.planId);
                    return (
                      <div key={payment.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="font-medium">{plan?.name}</span>
                              {getPaymentStatusBadge(payment.status)}
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Valor: </span>
                                <span className="font-semibold text-green-600">R$ {payment.amount.toFixed(2)}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Vencimento: </span>
                                <span className={new Date(payment.dueDate) < new Date() && payment.status !== 'paid' ? 'text-red-600 font-medium' : ''}>
                                  {new Date(payment.dueDate).toLocaleDateString('pt-BR')}
                                </span>
                              </div>
                              {payment.paymentDate && (
                                <div className="col-span-2">
                                  <span className="text-gray-600">Data do Pagamento: </span>
                                  <span className="text-green-600">{new Date(payment.paymentDate).toLocaleDateString('pt-BR')}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {payment.status !== 'paid' && (
                            <Button
                              size="sm"
                              onClick={() => handleMarkAsPaid(payment.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle size={16} className="mr-1" />
                              Marcar como Pago
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  
                  {getStudentPayments(selectedStudent.id).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <DollarSign className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>Nenhum pagamento encontrado para este aluno.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;
