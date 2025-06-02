import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Payment } from '@/types';

export const usePayments = () => {
  return useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Payment[];
    }
  });
};

export const usePayment = (id: string) => {
  return useQuery({
    queryKey: ['payment', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Converter os nomes de colunas do banco de dados para o formato camelCase usado no front-end
      return {
        id: data.id,
        studentId: data.student_id,
        planId: data.plan_id,
        amount: data.amount,
        dueDate: data.due_date,
        paymentDate: data.payment_date,
        status: data.status,
        method: data.method,
        createdAt: data.created_at
      } as Payment;
    },
    enabled: !!id // Só executa a query se houver um ID
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payment: Omit<Payment, 'id'>) => {
      const { data, error } = await supabase
        .from('payments')
        .insert([{
          student_id: payment.studentId,
          plan_id: payment.planId,
          amount: payment.amount,
          due_date: payment.dueDate,
          payment_date: payment.paymentDate,
          status: payment.status,
          method: payment.method
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    }
  });
};

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, payment }: { id: string; payment: Partial<Payment> }) => {
      const updateData: any = {};
      if (payment.studentId !== undefined) updateData.student_id = payment.studentId;
      if (payment.planId !== undefined) updateData.plan_id = payment.planId;
      if (payment.amount !== undefined) updateData.amount = payment.amount;
      if (payment.dueDate !== undefined) updateData.due_date = payment.dueDate;
      if (payment.paymentDate !== undefined) updateData.payment_date = payment.paymentDate;
      if (payment.status !== undefined) updateData.status = payment.status;
      if (payment.method !== undefined) updateData.method = payment.method;

      const { data, error } = await supabase
        .from('payments')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    }
  });
};

export const useDeletePayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    }
  });
};
