
import React from 'react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface FormData {
  name: string;
  cpf: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  hireDate: string;
}

interface TeacherFormFieldsProps {
  formData: FormData;
  errors: { [key: string]: string };
  onInputChange: (field: string, value: string) => void;
}

const TeacherFormFields: React.FC<TeacherFormFieldsProps> = ({
  formData,
  errors,
  onInputChange
}) => {
  return (
    <div className="space-y-3 md:space-y-4">
      {/* Nome Completo - sempre em linha única no mobile */}
      <div>
        <label className="block text-xs md:text-sm font-medium mb-1 md:mb-2">Nome Completo *</label>
        <Input
          value={formData.name}
          onChange={(e) => onInputChange('name', e.target.value)}
          placeholder="Digite o nome completo"
          className={`text-xs md:text-sm h-8 md:h-10 ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      {/* Linha compacta para CPF e Telefone no mobile */}
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 md:gap-4">
        <div>
          <label className="block text-xs md:text-sm font-medium mb-1 md:mb-2">CPF *</label>
          <Input
            value={formData.cpf}
            onChange={(e) => onInputChange('cpf', e.target.value)}
            placeholder="000.000.000-00"
            maxLength={14}
            className={`text-xs md:text-sm h-8 md:h-10 ${errors.cpf ? 'border-red-500 focus:border-red-500' : ''}`}
          />
          {errors.cpf && <p className="text-red-500 text-xs mt-1">{errors.cpf}</p>}
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium mb-1 md:mb-2">Telefone</label>
          <Input
            value={formData.phone}
            onChange={(e) => onInputChange('phone', e.target.value)}
            placeholder="(00) 00000-0000"
            maxLength={15}
            className={`text-xs md:text-sm h-8 md:h-10 ${errors.phone ? 'border-red-500 focus:border-red-500' : ''}`}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>
      </div>

      {/* E-mail - linha única */}
      <div>
        <label className="block text-xs md:text-sm font-medium mb-1 md:mb-2">E-mail *</label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => onInputChange('email', e.target.value)}
          placeholder="professor@email.com"
          className={`text-xs md:text-sm h-8 md:h-10 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      {/* Status e Data em linha compacta no mobile */}
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 md:gap-4">
        <div>
          <label className="block text-xs md:text-sm font-medium mb-1 md:mb-2">Status</label>
          <Select
            value={formData.status}
            onValueChange={(value) => onInputChange('status', value)}
          >
            <SelectTrigger className="h-8 md:h-10 text-xs md:text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active" className="text-xs md:text-sm">Ativo</SelectItem>
              <SelectItem value="inactive" className="text-xs md:text-sm">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium mb-1 md:mb-2">Data de Contratação</label>
          <Input
            type="date"
            value={formData.hireDate}
            onChange={(e) => onInputChange('hireDate', e.target.value)}
            required
            className="text-xs md:text-sm h-8 md:h-10"
          />
        </div>
      </div>
    </div>
  );
};

export default TeacherFormFields;
