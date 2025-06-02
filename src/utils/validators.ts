
// Utilitários de validação
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateCPF = (cpf: string): boolean => {
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '');
  
  // Aceita qualquer sequência de números digitados pelo usuário
  // Verifica apenas se tem pelo menos 1 dígito e no máximo 11
  return cleanCPF.length >= 1 && cleanCPF.length <= 11;
};

export const validatePhone = (phone: string): boolean => {
  // Remove caracteres não numéricos
  const cleanPhone = phone.replace(/\D/g, '');
  // Verifica se tem 10 ou 11 dígitos (telefone fixo ou celular)
  return cleanPhone.length === 10 || cleanPhone.length === 11;
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const formatCPF = (cpf: string): string => {
  const cleanCPF = cpf.replace(/\D/g, '');
  return cleanCPF
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

export const formatPhone = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length <= 10) {
    return cleanPhone
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  } else {
    return cleanPhone
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  }
};

export const formatCurrency = (value: string): string => {
  const numericValue = value.replace(/\D/g, '');
  const floatValue = parseFloat(numericValue) / 100;
  return floatValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};
