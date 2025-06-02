import React from 'react';
import { useSupabaseData } from '../contexts/SupabaseDataProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Users, AlertTriangle, TrendingUp, Calendar, FileDown } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import jsPDF from 'jspdf';

const Reports: React.FC = () => {
  const { students, plans, payments, studentsLoading, plansLoading, paymentsLoading } = useSupabaseData();

  if (studentsLoading || plansLoading || paymentsLoading) {
    return (
      <div className="space-y-4 md:space-y-8">
        <div className="flex flex-col gap-2 md:gap-0 md:flex-row md:justify-between md:items-center">
          <div className="mb-2 md:mb-0">
            <h1 className="text-lg md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Relatórios Simples
            </h1>
            <p className="text-xs md:text-base text-gray-600 mt-1">Carregando dados...</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="p-2 md:p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent className="p-2 md:p-6 pt-0">
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const activeStudents = students.filter(student => student.status === 'active');
  const expiredStudents = students.filter(student => student.status === 'expired');
  const inactiveStudents = students.filter(student => student.status === 'inactive');

  // Students expiring in the next 30 days
  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  const expiringStudents = students.filter(student => {
    const expirationDate = new Date(student.expirationDate);
    return expirationDate >= today && expirationDate <= thirtyDaysFromNow && student.status === 'active';
  });

  // Payment statistics
  const paidPayments = payments.filter(p => p.status === 'paid');
  const pendingPayments = payments.filter(p => p.status === 'pending');
  const overduePayments = payments.filter(p => p.status === 'overdue');
  const totalRevenue = paidPayments.reduce((sum, payment) => sum + payment.amount, 0);

  // Plan statistics
  const planStats = plans.map(plan => {
    const studentsWithPlan = students.filter(student => student.planId === plan.id);
    const activeStudentsWithPlan = studentsWithPlan.filter(student => student.status === 'active');
    
    return {
      ...plan,
      totalStudents: studentsWithPlan.length,
      activeStudents: activeStudentsWithPlan.length,
      revenue: activeStudentsWithPlan.length * plan.price
    };
  });

  // Payment by students statistics
  const paymentsByStudent = students.map(student => {
    const studentPayments = payments.filter(p => p.studentId === student.id);
    const paidAmount = studentPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = studentPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
    const overdueAmount = studentPayments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);
    
    return {
      student,
      totalPayments: studentPayments.length,
      paidAmount,
      pendingAmount,
      overdueAmount,
      totalAmount: paidAmount + pendingAmount + overdueAmount
    };
  }).filter(item => item.totalPayments > 0);

  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    let yPosition = 30;

    // Header with background
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('GymTech - Relatorio Gerencial Completo', margin, 25);
    
    // Reset text color and position
    doc.setTextColor(0, 0, 0);
    yPosition = 60;
    
    // Date and time
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const now = new Date();
    doc.text(`Gerado em: ${now.toLocaleDateString('pt-BR')} as ${now.toLocaleTimeString('pt-BR')}`, margin, yPosition);
    yPosition += 20;

    // Section: Overview
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(59, 130, 246);
    doc.text('RESUMO GERAL', margin, yPosition);
    yPosition += 15;

    // Overview data in a box
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 60, 'FD');
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    const overviewData = [
      `Total de Alunos: ${students.length}`,
      `Alunos Ativos: ${activeStudents.length}`,
      `Alunos Expirados: ${expiredStudents.length}`,
      `Alunos Inativos: ${inactiveStudents.length}`,
      `Receita Total: R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    ];

    overviewData.forEach((item, index) => {
      doc.text(`- ${item}`, margin + 10, yPosition + 10 + (index * 10));
    });
    
    yPosition += 80;

    // Section: Payments
    if (yPosition > pageHeight - 80) {
      doc.addPage();
      yPosition = 30;
    }

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(59, 130, 246);
    doc.text('SITUACAO FINANCEIRA', margin, yPosition);
    yPosition += 15;

    // Payment stats box
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 45, 'FD');
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    const paymentData = [
      `Pagamentos Pagos: ${paidPayments.length}`,
      `Pagamentos Pendentes: ${pendingPayments.length}`,
      `Pagamentos Vencidos: ${overduePayments.length}`
    ];

    paymentData.forEach((item, index) => {
      doc.text(`- ${item}`, margin + 10, yPosition + 10 + (index * 10));
    });
    
    yPosition += 65;

    // Section: Plans
    if (yPosition > pageHeight - 100) {
      doc.addPage();
      yPosition = 30;
    }

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(59, 130, 246);
    doc.text('PLANOS ATIVOS POR TIPO', margin, yPosition);
    yPosition += 15;

    if (planStats.length > 0) {
      const boxHeight = Math.max(60, planStats.length * 15 + 20);
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, boxHeight, 'FD');
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      
      planStats.forEach((plan, index) => {
        const planText = `- ${plan.name} (R$ ${plan.price.toFixed(2)}): ${plan.totalStudents} alunos (${plan.activeStudents} ativos) - Receita: R$ ${plan.revenue.toFixed(2)}`;
        doc.text(planText, margin + 10, yPosition + 10 + (index * 15));
      });
      
      yPosition += boxHeight + 20;
    } else {
      doc.setTextColor(128, 128, 128);
      doc.text('Nenhum plano cadastrado ainda', margin + 10, yPosition + 10);
      yPosition += 40;
    }

    // Section: Payments by Students
    if (yPosition > pageHeight - 120) {
      doc.addPage();
      yPosition = 30;
    }

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(59, 130, 246);
    doc.text('PAGAMENTOS POR ALUNO', margin, yPosition);
    yPosition += 15;

    if (paymentsByStudent.length > 0) {
      const maxItemsPerPage = Math.floor((pageHeight - yPosition - 40) / 20);
      
      paymentsByStudent.forEach((item, index) => {
        if (index > 0 && index % maxItemsPerPage === 0) {
          doc.addPage();
          yPosition = 30;
          doc.setFontSize(16);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(59, 130, 246);
          doc.text('PAGAMENTOS POR ALUNO (continuacao)', margin, yPosition);
          yPosition += 15;
        }

        doc.setFillColor(248, 250, 252);
        doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 18, 'FD');
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(`${item.student.name}`, margin + 5, yPosition + 5);
        
        doc.setFont('helvetica', 'normal');
        const paymentInfo = `Pagos: R$ ${item.paidAmount.toFixed(2)} | Pendentes: R$ ${item.pendingAmount.toFixed(2)} | Vencidos: R$ ${item.overdueAmount.toFixed(2)} | Total: R$ ${item.totalAmount.toFixed(2)}`;
        doc.text(paymentInfo, margin + 5, yPosition + 12);
        
        yPosition += 25;
      });
    } else {
      doc.setTextColor(128, 128, 128);
      doc.text('Nenhum pagamento registrado ainda', margin + 10, yPosition + 10);
      yPosition += 40;
    }

    // Section: Expiring Students Alert
    if (expiringStudents.length > 0) {
      if (yPosition > pageHeight - 120) {
        doc.addPage();
        yPosition = 30;
      }

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(239, 68, 68);
      doc.text('ALERTA: PLANOS VENCENDO (30 DIAS)', margin, yPosition);
      yPosition += 15;

      const alertBoxHeight = Math.max(60, expiringStudents.length * 15 + 20);
      doc.setFillColor(254, 242, 242);
      doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, alertBoxHeight, 'FD');
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      
      expiringStudents.forEach((student, index) => {
        const plan = plans.find(p => p.id === student.planId);
        const daysToExpire = Math.ceil(
          (new Date(student.expirationDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
        const studentText = `- ${student.name} - ${plan?.name} - Vence em ${daysToExpire} ${daysToExpire === 1 ? 'dia' : 'dias'} (${new Date(student.expirationDate).toLocaleDateString('pt-BR')})`;
        doc.text(studentText, margin + 10, yPosition + 10 + (index * 12));
      });
      
      yPosition += alertBoxHeight + 20;
    }

    // Footer
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      const footerY = pageHeight - 20;
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text('Este relatorio foi gerado automaticamente pelo sistema GymTech', margin, footerY);
      doc.text(`Pagina ${i} de ${totalPages}`, pageWidth - margin - 30, footerY);
    }
    
    // Save the PDF
    const fileName = `relatorio-gymtech-completo-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    toast({
      title: "PDF exportado com sucesso",
      description: `O relatorio completo foi salvo como ${fileName}`,
    });
  };

  return (
    <div className="space-y-4 md:space-y-8">
      <div className="flex flex-col gap-2 md:gap-0 md:flex-row md:justify-between md:items-center">
        <div className="mb-2 md:mb-0">
          <h1 className="text-lg md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Relatórios Simples
          </h1>
          <p className="text-xs md:text-base text-gray-600 mt-1">Visão geral rápida dos dados principais da academia</p>
        </div>
        <Button 
          onClick={exportToPDF}
          className="w-full md:w-auto bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg text-xs md:text-sm h-8 md:h-10"
        >
          <FileDown size={14} className="mr-1 md:mr-2" />
          Exportar PDF Completo
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-2 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium">Total de Alunos</CardTitle>
            <Users className="h-3 w-3 md:h-4 md:w-4" />
          </CardHeader>
          <CardContent className="p-2 md:p-6 pt-0">
            <div className="text-lg md:text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-blue-100">
              Cadastrados no sistema
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-2 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium">Alunos Ativos</CardTitle>
            <TrendingUp className="h-3 w-3 md:h-4 md:w-4" />
          </CardHeader>
          <CardContent className="p-2 md:p-6 pt-0">
            <div className="text-lg md:text-2xl font-bold">{activeStudents.length}</div>
            <p className="text-xs text-green-100">
              {students.length > 0 ? ((activeStudents.length / students.length) * 100).toFixed(1) : 0}% do total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-2 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium">Vencendo em 30 dias</CardTitle>
            <AlertTriangle className="h-3 w-3 md:h-4 md:w-4" />
          </CardHeader>
          <CardContent className="p-2 md:p-6 pt-0">
            <div className="text-lg md:text-2xl font-bold">{expiringStudents.length}</div>
            <p className="text-xs text-orange-100">
              Necessitam renovação
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-2 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium">Receita Total</CardTitle>
            <Calendar className="h-3 w-3 md:h-4 md:w-4" />
          </CardHeader>
          <CardContent className="p-2 md:p-6 pt-0">
            <div className="text-lg md:text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-purple-100">
              Pagamentos recebidos
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
        {/* Students by Status */}
        <Card>
          <CardHeader className="p-3 md:p-6">
            <CardTitle className="text-sm md:text-base">Distribuição por Status</CardTitle>
            <CardDescription className="text-xs md:text-sm">Situação atual dos alunos cadastrados</CardDescription>
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0">
            <div className="space-y-2 md:space-y-4">
              <div className="flex items-center justify-between p-2 md:p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-xs md:text-sm">Ativos</span>
                </div>
                <span className="font-bold text-green-600 text-xs md:text-sm">{activeStudents.length}</span>
              </div>
              
              <div className="flex items-center justify-between p-2 md:p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full"></div>
                  <span className="font-medium text-xs md:text-sm">Expirados</span>
                </div>
                <span className="font-bold text-red-600 text-xs md:text-sm">{expiredStudents.length}</span>
              </div>
              
              <div className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-gray-500 rounded-full"></div>
                  <span className="font-medium text-xs md:text-sm">Inativos</span>
                </div>
                <span className="font-bold text-gray-600 text-xs md:text-sm">{inactiveStudents.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Statistics */}
        <Card>
          <CardHeader className="p-3 md:p-6">
            <CardTitle className="text-sm md:text-base">Status dos Pagamentos</CardTitle>
            <CardDescription className="text-xs md:text-sm">Situação financeira dos pagamentos</CardDescription>
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0">
            <div className="space-y-2 md:space-y-4">
              <div className="flex items-center justify-between p-2 md:p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-xs md:text-sm">Pagos</span>
                </div>
                <span className="font-bold text-green-600 text-xs md:text-sm">{paidPayments.length}</span>
              </div>
              
              <div className="flex items-center justify-between p-2 md:p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-yellow-500 rounded-full"></div>
                  <span className="font-medium text-xs md:text-sm">Pendentes</span>
                </div>
                <span className="font-bold text-yellow-600 text-xs md:text-sm">{pendingPayments.length}</span>
              </div>
              
              <div className="flex items-center justify-between p-2 md:p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full"></div>
                  <span className="font-medium text-xs md:text-sm">Vencidos</span>
                </div>
                <span className="font-bold text-red-600 text-xs md:text-sm">{overduePayments.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students by Plan */}
      <Card>
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="text-sm md:text-base">Alunos por Plano</CardTitle>
          <CardDescription className="text-xs md:text-sm">Distribuição de alunos por tipo de plano</CardDescription>
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
            {planStats.map(plan => (
              <div key={plan.id} className="flex items-center justify-between p-2 md:p-3 bg-blue-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 text-xs md:text-sm">{plan.name}</div>
                  <div className="text-xs text-gray-600">
                    R$ {plan.price.toFixed(2)} • {plan.duration} {plan.duration === 1 ? 'mês' : 'meses'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-600 text-xs md:text-sm">{plan.totalStudents}</div>
                  <div className="text-xs text-gray-500">
                    {plan.activeStudents} ativos
                  </div>
                </div>
              </div>
            ))}
            
            {planStats.length === 0 && (
              <div className="col-span-2 text-center py-4 md:py-6 text-gray-500">
                <div className="text-xs md:text-sm">Nenhum plano cadastrado ainda</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* New Section: Payments by Student */}
      <Card>
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="text-sm md:text-base">Pagamentos por Aluno</CardTitle>
          <CardDescription className="text-xs md:text-sm">Resumo financeiro de cada aluno</CardDescription>
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-0">
          <div className="space-y-2 md:space-y-3">
            {paymentsByStudent.length > 0 ? (
              paymentsByStudent.map(item => (
                <div key={item.student.id} className="flex items-center justify-between p-2 md:p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 text-xs md:text-sm">{item.student.name}</div>
                    <div className="text-xs text-gray-600">
                      {item.totalPayments} {item.totalPayments === 1 ? 'pagamento' : 'pagamentos'}
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <div className="text-green-600 font-semibold">Pago: R$ {item.paidAmount.toFixed(2)}</div>
                    <div className="text-yellow-600">Pendente: R$ {item.pendingAmount.toFixed(2)}</div>
                    <div className="text-red-600">Vencido: R$ {item.overdueAmount.toFixed(2)}</div>
                    <div className="text-blue-600 font-bold">Total: R$ {item.totalAmount.toFixed(2)}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 md:py-6 text-gray-500">
                <div className="text-xs md:text-sm">Nenhum pagamento registrado ainda</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Expiring Students */}
      {expiringStudents.length > 0 && (
        <Card>
          <CardHeader className="p-3 md:p-6">
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-orange-500" />
              <span className="text-sm md:text-base">Alunos com Planos Vencendo (Próximos 30 dias)</span>
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Lista de alunos que necessitam renovação urgente
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0">
            <div className="space-y-2 md:space-y-3">
              {expiringStudents.map(student => {
                const plan = plans.find(p => p.id === student.planId);
                const daysToExpire = Math.ceil(
                  (new Date(student.expirationDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                );
                
                return (
                  <div key={student.id} className="flex items-center justify-between p-2 md:p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 text-xs md:text-sm">{student.name}</div>
                      <div className="text-xs text-gray-600">
                        {plan?.name} • {student.email}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-orange-600 text-xs md:text-sm">
                        {daysToExpire} {daysToExpire === 1 ? 'dia' : 'dias'}
                      </div>
                      <div className="text-xs text-gray-500">
                        Vence em {new Date(student.expirationDate).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Reports;
