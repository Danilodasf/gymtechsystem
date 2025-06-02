
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseData } from '../contexts/SupabaseDataProvider';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import { useTeacherForm } from '../hooks/useTeacherForm';
import TeacherFormFields from './TeacherFormFields';
import SpecialtyManager from './SpecialtyManager';

const TeacherForm: React.FC = () => {
  const navigate = useNavigate();
  const { addTeacher, updateTeacher } = useSupabaseData();
  
  const {
    formData,
    specialties,
    errors,
    isEditing,
    handleInputChange,
    addSpecialty,
    removeSpecialty,
    validateForm
  } = useTeacherForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Erro",
        description: "Por favor, corrija os erros no formulário",
        variant: "destructive"
      });
      return;
    }

    const teacherData = {
      ...formData,
      specialties
    };

    if (isEditing) {
      const urlParams = new URLSearchParams(window.location.search);
      const id = window.location.pathname.split('/').pop();
      if (id) {
        updateTeacher(id, teacherData);
        toast({
          title: "Professor atualizado",
          description: `${formData.name} foi atualizado com sucesso`,
        });
      }
    } else {
      addTeacher(teacherData);
      toast({
        title: "Professor cadastrado",
        description: `${formData.name} foi cadastrado com sucesso`,
      });
    }

    navigate('/teachers');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/teachers')}
          className="p-2"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {isEditing ? 'Editar Professor' : 'Novo Professor'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditing ? 'Atualize as informações do professor' : 'Preencha os dados para cadastrar um novo professor'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Professor</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <TeacherFormFields
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
            />

            <SpecialtyManager
              specialties={specialties}
              onAddSpecialty={addSpecialty}
              onRemoveSpecialty={removeSpecialty}
              error={errors.specialties}
            />

            <div className="flex space-x-4 pt-4">
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isEditing ? 'Atualizar Professor' : 'Cadastrar Professor'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/teachers')}
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

export default TeacherForm;
