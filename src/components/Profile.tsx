
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from '../hooks/use-toast';
import { User, Mail, Lock, Shield } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: user?.username || '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Erro na atualização",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    updateProfile(formData.username, formData.newPassword || undefined);
    
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram atualizadas com sucesso",
    });
    
    navigate('/dashboard');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 md:space-y-6 p-2 sm:p-4 md:p-6">
      <div className="text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Meu Perfil
        </h1>
        <p className="text-slate-600 mt-1 md:mt-2 text-sm sm:text-base md:text-lg">
          Gerencie suas informações de acesso ao sistema
        </p>
      </div>

      <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader className="pb-3 md:pb-4 p-3 md:p-6">
          <CardTitle className="flex items-center gap-2 md:gap-3 text-slate-800 text-base md:text-lg">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <User className="h-4 w-4 md:h-5 md:w-5 text-white" />
            </div>
            <span>Informações do Usuário</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6 p-3 md:p-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="space-y-1 md:space-y-2">
              <Label htmlFor="username" className="text-slate-700 font-medium text-sm md:text-base">
                Nome do Perfil
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-3 w-3 md:h-4 md:w-4" />
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="Seu nome de usuário"
                  required
                  className="pl-8 md:pl-10 bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 text-sm md:text-base h-9 md:h-10"
                />
              </div>
            </div>

            <div className="space-y-1 md:space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium text-sm md:text-base">
                E-mail Atual
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-3 w-3 md:h-4 md:w-4" />
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="pl-8 md:pl-10 bg-slate-100 text-slate-500 border-slate-200 text-sm md:text-base h-9 md:h-10"
                />
              </div>
              <p className="text-xs text-slate-500 ml-1">
                O e-mail não pode ser alterado nesta versão
              </p>
            </div>

            <div className="border-t border-slate-200 pt-4 md:pt-6">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Lock className="h-3 w-3 md:h-4 md:w-4 text-white" />
                </div>
                <h3 className="text-base md:text-lg font-semibold text-slate-800">Alterar Senha</h3>
              </div>
              <p className="text-xs md:text-sm text-slate-600 mb-3 md:mb-4">
                Deixe em branco se não desejar alterar a senha
              </p>
              
              <div className="space-y-3 md:space-y-4">
                <div className="space-y-1 md:space-y-2">
                  <Label htmlFor="newPassword" className="text-slate-700 font-medium text-sm md:text-base">
                    Nova Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-3 w-3 md:h-4 md:w-4" />
                    <Input
                      id="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => handleInputChange('newPassword', e.target.value)}
                      placeholder="Digite uma nova senha"
                      className="pl-8 md:pl-10 bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 text-sm md:text-base h-9 md:h-10"
                    />
                  </div>
                </div>

                <div className="space-y-1 md:space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-700 font-medium text-sm md:text-base">
                    Confirmar Nova Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-3 w-3 md:h-4 md:w-4" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="Confirme a nova senha"
                      disabled={!formData.newPassword}
                      className="pl-8 md:pl-10 bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 disabled:bg-slate-100 text-sm md:text-base h-9 md:h-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-4 md:pt-6">
              <Button 
                type="submit"
                className="flex-1 h-9 md:h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 text-sm md:text-base"
              >
                Salvar Alterações
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
                className="flex-1 h-9 md:h-11 border-slate-300 text-slate-700 hover:bg-slate-50 text-sm md:text-base"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-md">
        <CardContent className="pt-4 md:pt-6 p-3 md:p-6">
          <div className="flex items-start gap-3 md:gap-4">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <Shield className="h-4 w-4 md:h-5 md:w-5 text-white" />
            </div>
            <div className="text-xs md:text-sm text-blue-800">
              <p className="font-semibold mb-1 md:mb-2 text-sm md:text-base">Dica de Segurança:</p>
              <p className="leading-relaxed">
                Use senhas fortes com pelo menos 8 caracteres, incluindo letras maiúsculas, 
                minúsculas, números e símbolos para melhor proteção da sua conta.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
