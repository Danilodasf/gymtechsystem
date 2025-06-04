import React from 'react';
import { useSupabaseData } from '../contexts/SupabaseDataProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Users, AlertTriangle, TrendingUp, Calendar, FileDown } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import jsPDF from 'jspdf';

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
    const margin = 15;
    let yPosition = 20;

    // Função para criar cabeçalho de seção com ícone
    const createSectionHeader = (title, iconType, color: [number, number, number], yPos) => {
      // Desenhar círculo para o ícone
      doc.setFillColor(color[0], color[1], color[2]);
      doc.circle(margin + 5, yPos + 5, 5, 'F');
      
      // Desenhar linha horizontal decorativa
      doc.setDrawColor(color[0], color[1], color[2]);
      doc.setLineWidth(0.5);
      doc.line(margin + 12, yPos + 5, pageWidth - margin, yPos + 5);
      
      // Título da seção
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(color[0], color[1], color[2]);
      doc.text(title, margin + 15, yPos + 9);
      
      return yPos + 20; // Retorna a nova posição Y
    };

    // Função para criar uma tabela estilizada
    const createTable = (headers, data, startY, options = {}) => {
      const defaults = {
        headerBgColor: [220, 230, 242] as [number, number, number], // Azul claro
        headerTextColor: [0, 51, 102] as [number, number, number], // Azul escuro
        rowHeight: 10,
        fontSize: 10,
        alternateRowColor: false,
        cellPadding: 2,
        colWidths: []
      };
      
      const settings = { ...defaults, ...options };
      const { headerBgColor, headerTextColor, rowHeight, fontSize, alternateRowColor, cellPadding, colWidths } = settings;
      
      let y = startY;
      const tableWidth = pageWidth - 2 * margin;
      
      // Calcular larguras das colunas se não fornecidas
      const calculatedColWidths = colWidths.length > 0 ? colWidths : 
        headers.map(() => tableWidth / headers.length);
      
      // Desenhar cabeçalho
      doc.setFillColor(headerBgColor[0], headerBgColor[1], headerBgColor[2]);
      doc.rect(margin, y, tableWidth, rowHeight + cellPadding * 2, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(fontSize);
      doc.setTextColor(headerTextColor[0], headerTextColor[1], headerTextColor[2]);
      
      let xPos = margin + cellPadding;
      headers.forEach((header, i) => {
        doc.text(header, xPos, y + rowHeight);
        xPos += calculatedColWidths[i];
      });
      
      y += rowHeight + cellPadding * 2;
      
      // Desenhar linhas de dados
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      
      data.forEach((row, rowIndex) => {
        // Alternar cores de fundo para as linhas se habilitado
        if (alternateRowColor && rowIndex % 2 === 1) {
          doc.setFillColor(245, 245, 245);
          doc.rect(margin, y, tableWidth, rowHeight + cellPadding * 2, 'F');
        }
        
        xPos = margin + cellPadding;
        row.forEach((cell, i) => {
          doc.text(String(cell), xPos, y + rowHeight);
          xPos += calculatedColWidths[i];
        });
        
        y += rowHeight + cellPadding * 2;
      });
      
      return y + 5; // Retorna a nova posição Y após a tabela
    };

    // Função para criar gráfico de barras
    const createBarChart = (data, labels, title, startY, options = {}) => {
      const defaults = {
        barColors: [[59, 130, 246], [99, 102, 241], [139, 92, 246]] as [number, number, number][], // Tons de azul e roxo
        maxBarHeight: 60,
        barWidth: 20,
        barSpacing: 10,
        showValues: true,
        valuePrefix: '',
        valueSuffix: ''
      };
      
      const settings = { ...defaults, ...options };
      const { barColors, maxBarHeight, barWidth, barSpacing, showValues, valuePrefix, valueSuffix } = settings;
      
      let y = startY;
      
      // Título do gráfico
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60);
      doc.text(title, margin, y);
      y += 10;
      
      // Encontrar o valor máximo para escala
      const maxValue = Math.max(...data);
      
      // Desenhar barras
      const startX = margin + 20;
      const baselineY = y + maxBarHeight + 10;
      
      // Desenhar linha de base
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(startX - 5, baselineY, startX + (barWidth + barSpacing) * data.length + 5, baselineY);
      
      // Desenhar barras e labels
      data.forEach((value, i) => {
        const barHeight = (value / maxValue) * maxBarHeight;
        const x = startX + i * (barWidth + barSpacing);
        
        // Desenhar a barra
        const barColor = barColors[i % barColors.length];
        doc.setFillColor(barColor[0], barColor[1], barColor[2]);
        doc.rect(x, baselineY - barHeight, barWidth, barHeight, 'F');
        
        // Adicionar valor no topo da barra
        if (showValues) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.setTextColor(60, 60, 60);
          doc.text(`${valuePrefix}${value}${valueSuffix}`, x + barWidth / 2, baselineY - barHeight - 2, { align: 'center' });
        }
        
        // Adicionar label abaixo da barra
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text(labels[i], x + barWidth / 2, baselineY + 5, { align: 'center' });
      });
      
      return baselineY + 15; // Retorna a nova posição Y após o gráfico
    };

    // Função para criar um gráfico de pizza simplificado
    const createPieChart = (data, labels, title, startY, options = {}) => {
      const defaults = {
        colors: [[59, 130, 246], [99, 102, 241], [139, 92, 246], [236, 72, 153], [248, 113, 113]] as [number, number, number][], // Cores variadas
        radius: 30,
        showLegend: true,
        showPercentages: true
      };
      
      const settings = { ...defaults, ...options };
      const { colors, radius, showLegend, showPercentages } = settings;
      
      let y = startY;
      
      // Título do gráfico
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60);
      doc.text(title, margin, y);
      y += 15;
      
      // Calcular total para percentuais
      const total = data.reduce((sum, value) => sum + value, 0);
      
      // Posição central do gráfico
      const centerX = margin + radius + 10;
      const centerY = y + radius;
      
      // Desenhar segmentos da pizza (versão simplificada com retângulos coloridos)
      if (total > 0) {
        // Desenhar um círculo simples para representar o gráfico
        doc.setFillColor(240, 240, 240);
        doc.circle(centerX, centerY, radius, 'F');
        
        // Desenhar legenda com cores representativas
        if (showLegend) {
          const legendX = centerX + radius + 20;
          let legendY = centerY - radius;
          
          data.forEach((value, i) => {
            // Quadrado colorido
            const color = colors[i % colors.length];
            doc.setFillColor(color[0], color[1], color[2]);
            doc.rect(legendX, legendY - 3, 5, 5, 'F');
            
            // Texto da legenda
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(0, 0, 0);
            
            let legendText = labels[i];
            if (showPercentages) {
              const percentage = ((value / total) * 100).toFixed(1);
              legendText += ` (${percentage}%)`;
            }
            
            doc.text(legendText, legendX + 8, legendY);
            legendY += 10;
          });
          
          // Adicionar valores dentro do círculo
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(60, 60, 60);
          doc.text(`Total: ${total}`, centerX, centerY, { align: 'center' });
        }
      }
      
      return centerY + radius + 10; // Retorna a nova posição Y após o gráfico
    };

    // Função para adicionar cartões de estatísticas
    const createStatCards = (stats, startY, options = {}) => {
      const defaults = {
        columns: 2,
        cardHeight: 25,
        cardSpacing: 5,
        bgColors: [[240, 249, 255], [240, 253, 244], [254, 249, 195], [255, 241, 242]] as [number, number, number][],
        textColors: [[7, 89, 133], [21, 128, 61], [146, 64, 14], [159, 18, 57]] as [number, number, number][]
      };
      
      const settings = { ...defaults, ...options };
      const { columns, cardHeight, cardSpacing, bgColors, textColors } = settings;
      
      let y = startY;
      const cardWidth = (pageWidth - 2 * margin - ((columns - 1) * cardSpacing)) / columns;
      
      // Organizar estatísticas em linhas
      for (let i = 0; i < stats.length; i += columns) {
        const rowStats = stats.slice(i, i + columns);
        
        rowStats.forEach((stat, j) => {
          const x = margin + j * (cardWidth + cardSpacing);
          
          // Fundo do cartão
          const bgColor = bgColors[i % bgColors.length];
          doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
          doc.roundedRect(x, y, cardWidth, cardHeight, 3, 3, 'F');
          
          // Título da estatística
          const textColor = textColors[i % textColors.length];
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(textColor[0], textColor[1], textColor[2]);
          doc.text(stat.title, x + 5, y + 8);
          
          // Valor da estatística
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(14);
          doc.text(stat.value, x + 5, y + 20);
        });
        
        y += cardHeight + cardSpacing;
      }
      
      return y + 5; // Retorna a nova posição Y após os cartões
    };

    // Criar capa do relatório com design moderno
    doc.setFillColor(41, 65, 171); // Azul escuro
    doc.rect(0, 0, pageWidth, 70, 'F');
    
    // Adicionar efeito de gradiente (simulado com retângulos)
    for (let i = 0; i < 10; i++) {
      const alpha = 0.05 * (10 - i);
      doc.setFillColor(255, 255, 255, alpha);
      doc.rect(0, 70 - i * 2, pageWidth, 2, 'F');
    }
    
    // Logo/Título
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('GymTech', margin, 35);
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'normal');
    doc.text('Relatório Gerencial Completo', margin, 45);
    
    // Data e hora
    const now = new Date();
    doc.setFontSize(10);
    doc.text(`Gerado em ${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR')}`, margin, 55);
    
    // Adicionar decoração na parte inferior da capa
    doc.setFillColor(99, 102, 241); // Indigo
    doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
    
    // Adicionar informações da academia
    yPosition = 90;
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Resumo executivo do desempenho e métricas da academia', margin, yPosition);
    
    yPosition += 20;
    
    // Cartões de estatísticas principais
    const mainStats = [
      { title: 'Total de Alunos', value: students.length.toString() },
      { title: 'Alunos Ativos', value: activeStudents.length.toString() },
      { title: 'Receita Total', value: `R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` },
      { title: 'Planos Prestes a Vencer', value: expiringStudents.length.toString() }
    ];
    
    yPosition = createStatCards(mainStats, yPosition, { columns: 2, cardHeight: 35 });
    
    yPosition += 20;
    
    // Seção: Visão Geral dos Alunos
    yPosition = createSectionHeader('VISÃO GERAL DOS ALUNOS', 'users', [41, 65, 171], yPosition);
    
    // Gráfico de barras para status dos alunos
    const studentStatusData = [activeStudents.length, expiredStudents.length, inactiveStudents.length];
    const studentStatusLabels = ['Ativos', 'Expirados', 'Inativos'];
    
    yPosition = createBarChart(
      studentStatusData, 
      studentStatusLabels, 
      'Distribuição de Alunos por Status', 
      yPosition, 
      { barColors: [[46, 204, 113], [231, 76, 60], [189, 195, 199]] as [number, number, number][] }
    );
    
    yPosition += 15;
    
    // Verificar se precisa de nova página
    if (yPosition > pageHeight - 100) {
      doc.addPage();
      yPosition = 30;
    }
    
    // Seção: Situação Financeira
    yPosition = createSectionHeader('SITUAÇÃO FINANCEIRA', 'money', [46, 204, 113], yPosition);
    
    // Gráfico de pizza para pagamentos
    const paymentStatusData = [paidPayments.length, pendingPayments.length, overduePayments.length];
    const paymentStatusLabels = ['Pagos', 'Pendentes', 'Vencidos'];
    
    if (paymentStatusData.some(value => value > 0)) {
      yPosition = createPieChart(
        paymentStatusData, 
        paymentStatusLabels, 
        'Distribuição de Pagamentos', 
        yPosition, 
        { colors: [[46, 204, 113], [241, 196, 15], [231, 76, 60]] as [number, number, number][] }
      );
    } else {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text('Não há dados de pagamentos para exibir.', margin, yPosition);
      yPosition += 20;
    }
    
    yPosition += 15;
    
    // Verificar se precisa de nova página
    if (yPosition > pageHeight - 150) {
      doc.addPage();
      yPosition = 30;
    }
    
    // Seção: Planos
    yPosition = createSectionHeader('PLANOS E RECEITA', 'chart', [52, 152, 219], yPosition);
    
    // Tabela de planos
    if (planStats.length > 0) {
      const planHeaders = ['Nome do Plano', 'Preço', 'Alunos Ativos', 'Receita Mensal'];
      const planData = planStats.map(plan => [
        plan.name,
        `R$ ${plan.price.toFixed(2)}`,
        plan.activeStudents,
        `R$ ${plan.revenue.toFixed(2)}`
      ]);
      
      yPosition = createTable(planHeaders, planData, yPosition, {
        headerBgColor: [52, 152, 219],
        headerTextColor: [255, 255, 255],
        alternateRowColor: true,
        colWidths: [80, 40, 40, 50]
      });
    } else {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text('Não há planos cadastrados ainda.', margin, yPosition);
      yPosition += 20;
    }
    
    yPosition += 15;
    
    // Verificar se precisa de nova página
    if (yPosition > pageHeight - 150) {
      doc.addPage();
      yPosition = 30;
    }
    
    // Seção: Top Alunos por Pagamento
    yPosition = createSectionHeader('TOP ALUNOS POR PAGAMENTO', 'users', [155, 89, 182], yPosition);
    
    // Tabela de alunos com mais pagamentos
    if (paymentsByStudent.length > 0) {
      // Ordenar por valor total pago (decrescente)
      const topStudents = [...paymentsByStudent]
        .sort((a, b) => b.paidAmount - a.paidAmount)
        .slice(0, 10); // Top 10
      
      const studentHeaders = ['Aluno', 'Pagos', 'Pendentes', 'Vencidos', 'Total'];
      const studentData = topStudents.map(item => [
        item.student.name.length > 20 ? item.student.name.substring(0, 20) + '...' : item.student.name,
        `R$ ${item.paidAmount.toFixed(2)}`,
        `R$ ${item.pendingAmount.toFixed(2)}`,
        `R$ ${item.overdueAmount.toFixed(2)}`,
        `R$ ${item.totalAmount.toFixed(2)}`
      ]);
      
      yPosition = createTable(studentHeaders, studentData, yPosition, {
        headerBgColor: [155, 89, 182],
        headerTextColor: [255, 255, 255],
        alternateRowColor: true
      });
    } else {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text('Não há dados de pagamentos por aluno para exibir.', margin, yPosition);
      yPosition += 20;
    }
    
    yPosition += 15;
    
    // Verificar se precisa de nova página
    if (yPosition > pageHeight - 150) {
      doc.addPage();
      yPosition = 30;
    }
    
    // Seção: Alerta de Planos Vencendo
    if (expiringStudents.length > 0) {
      yPosition = createSectionHeader('ALERTA: PLANOS VENCENDO EM 30 DIAS', 'alert', [231, 76, 60], yPosition);
      
      const expiringHeaders = ['Aluno', 'Plano', 'Data de Vencimento', 'Dias Restantes'];
      const expiringData = expiringStudents.map(student => {
        const plan = plans.find(p => p.id === student.planId);
        const daysToExpire = Math.ceil(
          (new Date(student.expirationDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        return [
          student.name.length > 20 ? student.name.substring(0, 20) + '...' : student.name,
          plan?.name || 'Desconhecido',
          formatLocalDate(student.expirationDate),
          daysToExpire.toString()
        ];
      });
      
      yPosition = createTable(expiringHeaders, expiringData, yPosition, {
        headerBgColor: [231, 76, 60],
        headerTextColor: [255, 255, 255],
        alternateRowColor: true
      });
      
      yPosition += 15;
    }
    
    // Adicionar rodapé em todas as páginas
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      
      // Linha decorativa
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
      
      // Texto do rodapé
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text('© GymTech - Sistema de Gestão para Academias', margin, pageHeight - 10);
      doc.text(`Página ${i} de ${totalPages}`, pageWidth - margin - 25, pageHeight - 10);
    }
    
    // Adicionar página de detalhamento de pagamentos por estudante
    if (paymentsByStudent.length > 0) {
      doc.addPage();
      yPosition = 30;
      
      // Título da seção
      yPosition = createSectionHeader('DETALHAMENTO DE PAGAMENTOS POR ESTUDANTE', 'money', [41, 65, 171], yPosition);
      
      // Para cada estudante com pagamentos, mostrar detalhes
      for (const item of paymentsByStudent) {
        // Verificar se precisa adicionar nova página
        if (yPosition > pageHeight - 100) {
          doc.addPage();
          yPosition = 30;
        }
        
        // Cabeçalho do estudante
        const plan = plans.find(p => p.id === item.student.planId);
        
        doc.setFillColor(230, 236, 250);
        doc.rect(margin, yPosition, pageWidth - 2 * margin, 25, 'F');
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(41, 65, 171);
        doc.text(item.student.name, margin + 5, yPosition + 12);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        const studentInfo = `E-mail: ${item.student.email} | Plano: ${plan?.name || 'Não definido'} | Vencimento: ${formatLocalDate(item.student.expirationDate)}`;
        doc.text(studentInfo, margin + 5, yPosition + 20);
        
        yPosition += 30;
        
        // Obter todos os pagamentos do estudante
        const studentPayments = payments.filter(p => p.studentId === item.student.id);
        
        if (studentPayments.length > 0) {
          // Cabeçalho da tabela de pagamentos
          const paymentHeaders = ['Data Vencimento', 'Valor', 'Status', 'Método', 'Plano'];
          const paymentData = studentPayments.map(payment => {
            // Definir cor do status
            let statusText = '';
            let statusClass = '';
            
            switch (payment.status) {
              case 'paid':
                statusClass = 'text-green-600';
                statusText = 'Pago';
                break;
              case 'pending':
                statusClass = 'text-yellow-600';
                statusText = 'Pendente';
                break;
              case 'overdue':
                statusClass = 'text-red-600';
                statusText = 'Vencido';
                break;
              default:
                statusClass = 'text-gray-600';
                statusText = payment.status;
            }
            
            // Encontrar o nome do plano
            const planName = plans.find(p => p.id === payment.planId)?.name || '-';
            
            return [
              formatLocalDate(payment.dueDate),
              `R$ ${payment.amount.toFixed(2)}`,
              statusText,
              payment.method ? 
                payment.method === 'cash' ? 'Dinheiro' :
                payment.method === 'card' ? 'Cartão' :
                payment.method === 'pix' ? 'PIX' :
                payment.method === 'transfer' ? 'Transferência' :
                payment.method
              : 'Não informado',
              planName
            ];
          });
          
          yPosition = createTable(paymentHeaders, paymentData, yPosition, {
            headerBgColor: [220, 230, 242],
            headerTextColor: [41, 65, 171],
            alternateRowColor: true,
            colWidths: [40, 40, 40, 40, pageWidth - 2 * margin - 160]
          });
          
          // Resumo financeiro
          doc.setFillColor(240, 249, 255);
          doc.rect(margin, yPosition, pageWidth - 2 * margin, 20, 'F');
          
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(41, 65, 171);
          doc.text(`Resumo Financeiro: Pagos: R$ ${item.paidAmount.toFixed(2)} | Pendentes: R$ ${item.pendingAmount.toFixed(2)} | Vencidos: R$ ${item.overdueAmount.toFixed(2)} | Total: R$ ${item.totalAmount.toFixed(2)}`, margin + 5, yPosition + 12);
          
          yPosition += 30;
        } else {
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(10);
          doc.setTextColor(128, 128, 128);
          doc.text('Nenhum pagamento registrado para este aluno.', margin + 5, yPosition);
          yPosition += 20;
        }
        
        // Linha separadora entre estudantes
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.line(margin, yPosition - 5, pageWidth - margin, yPosition - 5);
        
        yPosition += 15;
      }
    }
    
    // Salvar o PDF
    const fileName = `relatorio-gymtech-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    toast({
      title: "PDF exportado com sucesso",
      description: `O relatório completo foi salvo como ${fileName}`,
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
              paymentsByStudent.map(item => {
                // Estado para controlar a expansão dos detalhes de pagamento
                const [expanded, setExpanded] = React.useState(false);
                
                // Obter pagamentos do aluno e ordenar por data
                const studentPayments = payments
                  .filter(p => p.studentId === item.student.id)
                  .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
                
                return (
                  <div key={item.student.id} className="flex flex-col bg-blue-50 border border-blue-200 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between p-2 md:p-3">
                      <div>
                        <div className="font-medium text-gray-900 text-xs md:text-sm">{item.student.name}</div>
                        <div className="text-xs text-gray-600">
                          {item.totalPayments} {item.totalPayments === 1 ? 'pagamento' : 'pagamentos'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right text-xs">
                          <div className="text-green-600 font-semibold">Pago: R$ {item.paidAmount.toFixed(2)}</div>
                          <div className="text-yellow-600">Pendente: R$ {item.pendingAmount.toFixed(2)}</div>
                          <div className="text-red-600">Vencido: R$ {item.overdueAmount.toFixed(2)}</div>
                          <div className="text-blue-600 font-bold">Total: R$ {item.totalAmount.toFixed(2)}</div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="ml-2 h-8 text-xs bg-white"
                          onClick={() => setExpanded(!expanded)}
                        >
                          {expanded ? "Recolher" : "Expandir"}
                        </Button>
                      </div>
                    </div>
                    
                    {/* Detalhes expandidos */}
                    {expanded && (
                      <div className="p-2 md:p-3 border-t border-blue-200 bg-white">
                        <div className="text-xs font-medium text-gray-700 mb-2">Histórico de Pagamentos</div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead className="bg-blue-100">
                              <tr>
                                <th className="px-2 py-1 text-left">Data</th>
                                <th className="px-2 py-1 text-left">Valor</th>
                                <th className="px-2 py-1 text-left">Status</th>
                                <th className="px-2 py-1 text-left">Método</th>
                                <th className="px-2 py-1 text-left">Plano</th>
                              </tr>
                            </thead>
                            <tbody>
                              {studentPayments.map(payment => {
                                // Encontrar o plano associado ao pagamento
                                const plan = plans.find(p => p.id === payment.planId);
                                
                                // Definir classe de cor com base no status
                                let statusClass = '';
                                let statusText = '';
                                
                                switch (payment.status) {
                                  case 'paid':
                                    statusClass = 'text-green-600';
                                    statusText = 'Pago';
                                    break;
                                  case 'pending':
                                    statusClass = 'text-yellow-600';
                                    statusText = 'Pendente';
                                    break;
                                  case 'overdue':
                                    statusClass = 'text-red-600';
                                    statusText = 'Vencido';
                                    break;
                                  default:
                                    statusClass = 'text-gray-600';
                                    statusText = payment.status;
                                }
                                
                                return (
                                  <tr key={payment.id} className="border-b border-blue-50 hover:bg-blue-50">
                                    <td className="px-2 py-1">
                                      {formatLocalDate(payment.dueDate)}
                                      {payment.paymentDate && (
                                        <span className="text-green-600 ml-1">
                                          (Pago: {formatLocalDate(payment.paymentDate)})
                                        </span>
                                      )}
                                    </td>
                                    <td className="px-2 py-1 font-medium">R$ {payment.amount.toFixed(2)}</td>
                                    <td className={`px-2 py-1 font-medium ${statusClass}`}>{statusText}</td>
                                    <td className="px-2 py-1">
                                      {payment.method ? 
                                        payment.method === 'cash' ? 'Dinheiro' :
                                        payment.method === 'card' ? 'Cartão' :
                                        payment.method === 'pix' ? 'PIX' :
                                        payment.method === 'transfer' ? 'Transferência' :
                                        payment.method
                                      : 'Não informado'}
                                    </td>
                                    <td className="px-2 py-1">{plan?.name || '-'}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
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
                        Vence em {formatLocalDate(student.expirationDate)}
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
