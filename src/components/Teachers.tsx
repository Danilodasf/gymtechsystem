
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseData } from '../contexts/SupabaseDataProvider';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Search, Plus, Edit, Trash2, User, GraduationCap } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const Teachers: React.FC = () => {
  const { teachers, deleteTeacher } = useSupabaseData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.cpf.includes(searchTerm) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o professor ${name}?`)) {
      deleteTeacher(id);
      toast({
        title: "Professor excluído",
        description: `${name} foi removido do sistema`,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Ativo</Badge>;
      case 'inactive':
        return <Badge variant="secondary" className="hover:bg-gray-300">Inativo</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-3 md:space-y-6">
      <div className="flex flex-col gap-2 md:gap-0 md:flex-row md:justify-between md:items-center">
        <div className="mb-2 md:mb-0">
          <h1 className="text-lg md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Gerenciamento de Professores
          </h1>
          <p className="text-xs md:text-base text-gray-600 mt-1">Visualize e gerencie todos os professores cadastrados</p>
        </div>
        <Link to="/teachers/new">
          <Button className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-200 text-xs md:text-sm h-8 md:h-10">
            <Plus size={14} className="mr-1 md:mr-2" />
            Novo Professor
          </Button>
        </Link>
      </div>

      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg p-3 md:p-6">
          <CardTitle className="flex flex-col gap-3 md:gap-0 lg:flex-row lg:items-center lg:justify-between">
            <span className="text-sm md:text-xl text-gray-800">Lista de Professores</span>
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Buscar por nome, CPF, e-mail ou especialidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 focus:border-purple-400 focus:ring-purple-400 text-xs md:text-sm h-8 md:h-10"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left py-2 md:py-4 px-3 md:px-6 font-semibold text-gray-700 text-xs md:text-sm">Nome</th>
                  <th className="text-left py-2 md:py-4 px-3 md:px-6 font-semibold text-gray-700 text-xs md:text-sm">CPF</th>
                  <th className="text-left py-2 md:py-4 px-3 md:px-6 font-semibold text-gray-700 text-xs md:text-sm">Especialidades</th>
                  <th className="text-left py-2 md:py-4 px-3 md:px-6 font-semibold text-gray-700 text-xs md:text-sm">Status</th>
                  <th className="text-left py-2 md:py-4 px-3 md:px-6 font-semibold text-gray-700 text-xs md:text-sm">Data de Contratação</th>
                  <th className="text-center py-2 md:py-4 px-3 md:px-6 font-semibold text-gray-700 text-xs md:text-sm">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="border-b border-gray-50 hover:bg-gradient-to-r hover:from-purple-50/30 hover:to-pink-50/30 transition-all duration-200">
                    <td className="py-2 md:py-4 px-3 md:px-6">
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-1 md:p-2 rounded-full">
                          <GraduationCap className="h-3 w-3 md:h-5 md:w-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-xs md:text-sm">{teacher.name}</div>
                          <div className="text-xs text-gray-500">{teacher.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 md:py-4 px-3 md:px-6">
                      <span className="text-gray-700 font-mono text-xs md:text-sm">{teacher.cpf}</span>
                    </td>
                    <td className="py-2 md:py-4 px-3 md:px-6">
                      <div className="flex flex-wrap gap-1">
                        {teacher.specialties.slice(0, 2).map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-purple-200 text-purple-700 bg-purple-50">
                            {specialty}
                          </Badge>
                        ))}
                        {teacher.specialties.length > 2 && (
                          <Badge variant="outline" className="text-xs border-gray-200 text-gray-600">
                            +{teacher.specialties.length - 2}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-2 md:py-4 px-3 md:px-6">{getStatusBadge(teacher.status)}</td>
                    <td className="py-2 md:py-4 px-3 md:px-6">
                      <span className="text-gray-700 text-xs md:text-sm">
                        {new Date(teacher.hireDate).toLocaleDateString('pt-BR')}
                      </span>
                    </td>
                    <td className="py-2 md:py-4 px-3 md:px-6">
                      <div className="flex justify-center space-x-1">
                        <Link to={`/teachers/edit/${teacher.id}`}>
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors h-6 w-6 md:h-8 md:w-8 p-0">
                            <Edit size={12} className="md:hidden" />
                            <Edit size={16} className="hidden md:block" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors h-6 w-6 md:h-8 md:w-8 p-0"
                          onClick={() => handleDelete(teacher.id, teacher.name)}
                        >
                          <Trash2 size={12} className="md:hidden" />
                          <Trash2 size={16} className="hidden md:block" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredTeachers.length === 0 && (
              <div className="text-center py-8 md:py-16 text-gray-500">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-full w-12 h-12 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-2 md:mb-4">
                  <User className="h-6 w-6 md:h-10 md:w-10 text-purple-400" />
                </div>
                <h3 className="text-sm md:text-lg font-medium text-gray-900 mb-1 md:mb-2">
                  {searchTerm ? 'Nenhum professor encontrado' : 'Nenhum professor cadastrado'}
                </h3>
                <p className="text-gray-500 text-xs md:text-sm">
                  {searchTerm ? 'Tente ajustar os critérios de busca.' : 'Comece cadastrando seu primeiro professor.'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Teachers;
