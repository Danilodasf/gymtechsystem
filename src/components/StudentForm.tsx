
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from '../hooks/use-toast';
import { Student } from '../types';
import { validateEmail, validateCPF, validatePhone, formatCPF, formatPhone } from '../utils/validators';

const StudentForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { students, plans, addStudent, updateStudent } = useData();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    birthDate: '',
    phone: '',
    email: '',
    address: '',
    planId: '',
    enrollmentDate: new Date().toISOString().split('T')[0],
    status: 'active' as 'active' | 'inactive' | 'expired'
  });

  const [errors, setErrors] = useState({
    name: '',
    cpf: '',
    email: '',
    phone: '',
    address: '',
    planId: ''
  });

  useEffect(() => {
    if (isEditing && id) {
      const student = students.find(s => s.id === id);
      if (student) {
        setFormData({
          name: student.name,
          cpf: student.cpf,
          birthDate: student.birthDate,
          phone: student.phone,
          email: student.email,
          address: student.address,
          planId: student.planId,
          enrollmentDate: student.enrollmentDate,
          status: student.status
        });
      }
    }
  }, [id, isEditing, students]);

  const validateForm = () => {
    const newErrors = {
      name: '',
      cpf: '',
      email: '',
      phone: '',
      address: '',
      planId: ''
    };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
      isValid = false;
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
      isValid = false;
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'E-mail inválido';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
      isValid = false;
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Telefone inválido';
      isValid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Endereço é obrigatório';
      isValid = false;
    }

    if (!formData.planId) {
      newErrors.planId = 'Plano é obrigatório';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const calculateExpirationDate = (enrollmentDate: string, planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return enrollmentDate;

    const enrollment = new Date(enrollmentDate);
    const expiration = new Date(enrollment);
    expiration.setMonth(expiration.getMonth() + plan.duration);
    
    return expiration.toISOString().split('T')[0];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const expirationDate = calculateExpirationDate(formData.enrollmentDate, formData.planId);

    if (isEditing && id) {
      updateStudent(id, {
        ...formData,
        expirationDate
      });
      toast({
        title: "Aluno atualizado",
        description: "Os dados do aluno foram atualizados com sucesso",
      });
    } else {
      addStudent({
        ...formData,
        expirationDate
      } as Omit<Student, 'id'>);
      toast({
        title: "Aluno cadastrado",
        description: "Novo aluno foi adicionado ao sistema",
      });
    }

    navigate('/students');
  };

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;

    // Aplicar formatação específica
    if (field === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (field === 'phone') {
      formattedValue = formatPhone(value);
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    
    // Limpar erro do campo ao digitar
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {isEditing ? 'Editar Aluno' : 'Cadastrar Novo Aluno'}
        </h1>
        <p className="text-gray-600 mt-2">
          {isEditing ? 'Atualize os dados do aluno' : 'Preencha os dados para cadastrar um novo aluno'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do Aluno</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => handleInputChange('cpf', e.target.value)}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  required
                  className={errors.cpf ? 'border-red-500' : ''}
                />
                {errors.cpf && (
                  <p className="text-sm text-red-500">{errors.cpf}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Data de Nascimento *</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                  required
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="planId">Plano *</Label>
                <Select value={formData.planId} onValueChange={(value) => handleInputChange('planId', value)}>
                  <SelectTrigger className={errors.planId ? 'border-red-500' : ''}>
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
                {errors.planId && (
                  <p className="text-sm text-red-500">{errors.planId}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="enrollmentDate">Data de Matrícula *</Label>
                <Input
                  id="enrollmentDate"
                  type="date"
                  value={formData.enrollmentDate}
                  onChange={(e) => handleInputChange('enrollmentDate', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                    <SelectItem value="expired">Expirado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Rua, número, bairro, cidade"
                required
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address}</p>
              )}
            </div>

            <div className="flex space-x-4 pt-6">
              <Button 
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isEditing ? 'Atualizar' : 'Cadastrar'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/students')}
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

export default StudentForm;
