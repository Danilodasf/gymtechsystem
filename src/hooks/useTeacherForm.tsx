
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSupabaseData } from '../contexts/SupabaseDataProvider';
import { validateEmail, validateCPF, validatePhone, formatCPF, formatPhone } from '../utils/validators';

interface FormData {
  name: string;
  cpf: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  hireDate: string;
}

export const useTeacherForm = () => {
  const { id } = useParams();
  const { teachers } = useSupabaseData();
  const isEditing = !!id;

  const [formData, setFormData] = useState<FormData>({
    name: '',
    cpf: '',
    phone: '',
    email: '',
    status: 'active' as 'active' | 'inactive',
    hireDate: new Date().toISOString().split('T')[0]
  });

  const [specialties, setSpecialties] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isEditing && id) {
      const teacher = teachers.find(t => t.id === id);
      if (teacher) {
        setFormData({
          name: teacher.name,
          cpf: teacher.cpf,
          phone: teacher.phone,
          email: teacher.email,
          status: teacher.status,
          hireDate: teacher.hireDate
        });
        setSpecialties(teacher.specialties);
      }
    }
  }, [id, isEditing, teachers]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Telefone inválido';
    }

    if (specialties.length === 0) {
      newErrors.specialties = 'Adicione pelo menos uma especialidade';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;

    if (field === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (field === 'phone') {
      formattedValue = formatPhone(value);
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addSpecialty = (specialty: string) => {
    if (specialty && !specialties.includes(specialty)) {
      setSpecialties(prev => [...prev, specialty]);
      
      // Clear specialties error
      if (errors.specialties) {
        setErrors(prev => ({ ...prev, specialties: '' }));
      }
    }
  };

  const removeSpecialty = (specialty: string) => {
    setSpecialties(prev => prev.filter(s => s !== specialty));
  };

  return {
    formData,
    specialties,
    errors,
    isEditing,
    handleInputChange,
    addSpecialty,
    removeSpecialty,
    validateForm
  };
};
