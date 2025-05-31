
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from '../hooks/use-toast';
import { Zap, Lock, User } from 'lucide-react';
import { validateEmail } from '../utils/validators';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ username: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = { username: '', password: '' };
    let isValid = true;

    if (!username.trim()) {
      newErrors.username = 'Usuário ou e-mail é obrigatório';
      isValid = false;
    } else if (username.includes('@') && !validateEmail(username)) {
      newErrors.username = 'E-mail inválido';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao GymTech",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Erro no login",
          description: "Usuário ou senha inválidos",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-2 md:p-4">
      <div className="w-full max-w-sm md:max-w-md mx-auto">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl border border-white/20">
          <CardHeader className="text-center pb-4 md:pb-6 pt-6 md:pt-8 px-4 md:px-8">
            <div className="flex justify-center mb-3 md:mb-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              GymTech
            </CardTitle>
            <CardDescription className="text-slate-600 text-sm md:text-lg mt-1 md:mt-2">
              Sistema de Gerenciamento de Academia
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-4 md:px-8 pb-6 md:pb-8">
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="space-y-1 md:space-y-2">
                <Label htmlFor="username" className="text-slate-700 font-medium text-xs md:text-sm">
                  Usuário ou E-mail
                </Label>
                <div className="relative">
                  <User className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-3 w-3 md:h-4 md:w-4" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (errors.username) setErrors(prev => ({ ...prev, username: '' }));
                    }}
                    placeholder="Digite seu usuário ou e-mail"
                    required
                    className={`h-10 md:h-12 pl-8 md:pl-10 bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 text-xs md:text-sm ${
                      errors.username ? 'border-red-500' : ''
                    }`}
                  />
                </div>
                {errors.username && (
                  <p className="text-xs text-red-500 mt-1">{errors.username}</p>
                )}
              </div>
              
              <div className="space-y-1 md:space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium text-xs md:text-sm">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-3 w-3 md:h-4 md:w-4" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                    }}
                    placeholder="Digite sua senha"
                    required
                    className={`h-10 md:h-12 pl-8 md:pl-10 bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 text-xs md:text-sm ${
                      errors.password ? 'border-red-500' : ''
                    }`}
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-10 md:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] text-xs md:text-sm"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-2 border-white border-t-transparent"></div>
                    Entrando...
                  </div>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>
            
            <div className="mt-4 md:mt-6 text-center">
              <p className="text-slate-600 text-xs md:text-sm">
                Não tem uma conta?{' '}
                <Link 
                  to="/register" 
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                >
                  Cadastrar-se
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
