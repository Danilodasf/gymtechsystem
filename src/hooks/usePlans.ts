
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plan } from '@/types';

export const usePlans = () => {
  return useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      console.log('Buscando planos...');
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar planos:', error);
        throw error;
      }
      console.log('Planos encontrados:', data);
      return data as Plan[];
    }
  });
};

export const useCreatePlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (plan: Omit<Plan, 'id'>) => {
      console.log('Tentando criar plano:', plan);
      
      const { data, error } = await supabase
        .from('plans')
        .insert([{
          name: plan.name,
          duration: plan.duration,
          price: plan.price,
          description: plan.description
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Erro detalhado ao criar plano:', error);
        throw new Error(`Erro ao criar plano: ${error.message}`);
      }
      
      console.log('Plano criado com sucesso:', data);
      return data;
    },
    onSuccess: () => {
      console.log('Invalidando cache de planos...');
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
    onError: (error) => {
      console.error('Erro na mutação de criar plano:', error);
    }
  });
};

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, plan }: { id: string; plan: Partial<Plan> }) => {
      console.log('Tentando atualizar plano:', id, plan);
      
      const updateData: any = {};
      if (plan.name !== undefined) updateData.name = plan.name;
      if (plan.duration !== undefined) updateData.duration = plan.duration;
      if (plan.price !== undefined) updateData.price = plan.price;
      if (plan.description !== undefined) updateData.description = plan.description;

      const { data, error } = await supabase
        .from('plans')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao atualizar plano:', error);
        throw new Error(`Erro ao atualizar plano: ${error.message}`);
      }
      
      console.log('Plano atualizado com sucesso:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
    onError: (error) => {
      console.error('Erro na mutação de atualizar plano:', error);
    }
  });
};

export const useDeletePlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Tentando deletar plano:', id);
      
      const { error } = await supabase
        .from('plans')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Erro ao deletar plano:', error);
        throw new Error(`Erro ao deletar plano: ${error.message}`);
      }
      
      console.log('Plano deletado com sucesso');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
    onError: (error) => {
      console.error('Erro na mutação de deletar plano:', error);
    }
  });
};
