
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSupabaseData } from '../contexts/SupabaseDataProvider';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const ClassForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { classes, teachers, addClass, updateClass } = useSupabaseData();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    teacherId: '',
    date: '',
    startTime: '',
    endTime: '',
    maxStudents: 10,
    status: 'scheduled' as 'scheduled' | 'completed' | 'cancelled',
    type: '',
    location: ''
  });

  useEffect(() => {
    if (isEditing && id) {
      const classItem = classes.find(c => c.id === id);
      if (classItem) {
        setFormData({
          name: classItem.name,
          description: classItem.description || '',
          teacherId: classItem.teacherId,
          date: classItem.date,
          startTime: classItem.startTime,
          endTime: classItem.endTime,
          maxStudents: classItem.maxStudents,
          status: classItem.status,
          type: classItem.type,
          location: classItem.location
        });
      }
    }
  }, [id, isEditing, classes]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.teacherId || !formData.date || !formData.startTime || !formData.endTime || !formData.type.trim() || !formData.location.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    if (formData.startTime >= formData.endTime) {
      toast({
        title: "Erro",
        description: "O horário de término deve ser posterior ao de início",
        variant: "destructive"
      });
      return;
    }

    // Extrair o dia da semana da data selecionada
    const selectedDate = new Date(formData.date);
    const daysOfWeek = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
    const dayOfWeek = daysOfWeek[selectedDate.getDay()];

    const classData = {
      ...formData,
      dayOfWeek: dayOfWeek,
      enrolledStudents: isEditing ? classes.find(c => c.id === id)?.enrolledStudents || [] : []
    };

    if (isEditing && id) {
      updateClass(id, classData);
      toast({
        title: "Aula atualizada",
        description: `${formData.name} foi atualizada com sucesso`,
      });
    } else {
      addClass(classData);
      toast({
        title: "Aula agendada",
        description: `${formData.name} foi agendada com sucesso`,
      });
    }

    navigate('/classes');
  };

  const activeTeachers = teachers.filter(teacher => teacher.status === 'active');

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/classes')}
          className="p-2"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            {isEditing ? 'Editar Aula' : 'Nova Aula'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditing ? 'Atualize as informações da aula' : 'Preencha os dados para agendar uma nova aula'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Aula</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome da Aula *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ex: Yoga Matinal, Crossfit Intenso..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tipo da Aula *</label>
                <Input
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  placeholder="Ex: Yoga, Crossfit, Musculação..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Professor *</label>
                <Select
                  value={formData.teacherId}
                  onValueChange={(value) => handleInputChange('teacherId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um professor" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeTeachers.map(teacher => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name} - {teacher.specialties.join(', ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Local *</label>
                <Input
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Ex: Sala 1, Sala 2, Área externa..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Data da Aula *</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Máximo de Alunos</label>
                <Input
                  type="number"
                  value={formData.maxStudents}
                  onChange={(e) => handleInputChange('maxStudents', parseInt(e.target.value))}
                  min="1"
                  max="50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Horário de Início *</label>
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Horário de Término *</label>
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Agendada</SelectItem>
                    <SelectItem value="completed">Concluída</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Descrição</label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md resize-none"
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descreva a aula (opcional)..."
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <Button
                type="submit"
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                {isEditing ? 'Atualizar Aula' : 'Agendar Aula'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/classes')}
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

export default ClassForm;
