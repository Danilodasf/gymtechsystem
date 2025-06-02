
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseData } from '../contexts/SupabaseDataProvider';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Search, Plus, Edit, Trash2, Calendar, Clock, User, MapPin } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const Classes: React.FC = () => {
  const { classes, deleteClass, getTeacherById } = useSupabaseData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClasses = classes.filter(classItem =>
    classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classItem.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classItem.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a aula ${name}?`)) {
      deleteClass(id);
      toast({
        title: "Aula excluída",
        description: `${name} foi removida do sistema`,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Ativa</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelada</Badge>;
      case 'completed':
        return <Badge variant="secondary" className="bg-blue-500 text-white hover:bg-blue-600">Concluída</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5); // Remove seconds from time
  };

  return (
    <div className="space-y-3 md:space-y-6">
      <div className="flex flex-col gap-2 md:gap-0 md:flex-row md:justify-between md:items-center">
        <div className="mb-2 md:mb-0">
          <h1 className="text-lg md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Gerenciamento de Aulas
          </h1>
          <p className="text-xs md:text-base text-gray-600 mt-1">Organize e gerencie as aulas da academia</p>
        </div>
        <Link to="/classes/new">
          <Button className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 text-xs md:text-sm h-8 md:h-10">
            <Plus size={14} className="mr-1 md:mr-2" />
            Nova Aula
          </Button>
        </Link>
      </div>

      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-lg p-3 md:p-6">
          <CardTitle className="flex flex-col gap-3 md:gap-0 lg:flex-row lg:items-center lg:justify-between">
            <span className="text-sm md:text-xl text-gray-800">Lista de Aulas</span>
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Buscar por nome, tipo ou local..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 focus:border-indigo-400 focus:ring-indigo-400 text-xs md:text-sm h-8 md:h-10"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left py-2 md:py-4 px-3 md:px-6 font-semibold text-gray-700 text-xs md:text-sm">Aula</th>
                  <th className="text-left py-2 md:py-4 px-3 md:px-6 font-semibold text-gray-700 text-xs md:text-sm">Professor</th>
                  <th className="text-left py-2 md:py-4 px-3 md:px-6 font-semibold text-gray-700 text-xs md:text-sm">Horário</th>
                  <th className="text-left py-2 md:py-4 px-3 md:px-6 font-semibold text-gray-700 text-xs md:text-sm">Local</th>
                  <th className="text-left py-2 md:py-4 px-3 md:px-6 font-semibold text-gray-700 text-xs md:text-sm">Status</th>
                  <th className="text-center py-2 md:py-4 px-3 md:px-6 font-semibold text-gray-700 text-xs md:text-sm">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredClasses.map((classItem) => {
                  const teacher = getTeacherById(classItem.teacherId);
                  return (
                    <tr key={classItem.id} className="border-b border-gray-50 hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-blue-50/30 transition-all duration-200">
                      <td className="py-2 md:py-4 px-3 md:px-6">
                        <div className="flex items-center space-x-2 md:space-x-3">
                          <div className="bg-gradient-to-r from-indigo-100 to-blue-100 p-1 md:p-2 rounded-full">
                            <Calendar className="h-3 w-3 md:h-5 md:w-5 text-indigo-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-xs md:text-sm">{classItem.name}</div>
                            <div className="text-xs text-gray-500">{classItem.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 md:py-4 px-3 md:px-6">
                        <div className="flex items-center space-x-2">
                          <User className="h-3 w-3 md:h-4 md:w-4 text-gray-400" />
                          <span className="text-gray-700 text-xs md:text-sm">{teacher?.name || 'Professor não encontrado'}</span>
                        </div>
                      </td>
                      <td className="py-2 md:py-4 px-3 md:px-6">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-3 w-3 md:h-4 md:w-4 text-gray-400" />
                          <div className="text-xs md:text-sm">
                            <div className="text-gray-700 capitalize">{classItem.dayOfWeek}</div>
                            <div className="text-gray-500">{formatTime(classItem.startTime)} - {formatTime(classItem.endTime)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 md:py-4 px-3 md:px-6">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-3 w-3 md:h-4 md:w-4 text-gray-400" />
                          <span className="text-gray-700 text-xs md:text-sm">{classItem.location}</span>
                        </div>
                      </td>
                      <td className="py-2 md:py-4 px-3 md:px-6">{getStatusBadge(classItem.status)}</td>
                      <td className="py-2 md:py-4 px-3 md:px-6">
                        <div className="flex justify-center space-x-1">
                          <Link to={`/classes/edit/${classItem.id}`}>
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors h-6 w-6 md:h-8 md:w-8 p-0">
                              <Edit size={12} className="md:hidden" />
                              <Edit size={16} className="hidden md:block" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors h-6 w-6 md:h-8 md:w-8 p-0"
                            onClick={() => handleDelete(classItem.id, classItem.name)}
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

            {filteredClasses.length === 0 && (
              <div className="text-center py-8 md:py-16 text-gray-500">
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-full w-12 h-12 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-2 md:mb-4">
                  <Calendar className="h-6 w-6 md:h-10 md:w-10 text-indigo-400" />
                </div>
                <h3 className="text-sm md:text-lg font-medium text-gray-900 mb-1 md:mb-2">
                  {searchTerm ? 'Nenhuma aula encontrada' : 'Nenhuma aula cadastrada'}
                </h3>
                <p className="text-gray-500 text-xs md:text-sm">
                  {searchTerm ? 'Tente ajustar os critérios de busca.' : 'Comece criando sua primeira aula.'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Classes;
