
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Teacher } from '@/types';

export const useTeachers = () => {
  return useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Teacher[];
    }
  });
};

export const useCreateTeacher = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (teacher: Omit<Teacher, 'id'>) => {
      const { data, error } = await supabase
        .from('teachers')
        .insert([{
          name: teacher.name,
          cpf: teacher.cpf,
          phone: teacher.phone,
          email: teacher.email,
          specialties: teacher.specialties,
          status: teacher.status,
          hire_date: teacher.hireDate
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    }
  });
};

export const useUpdateTeacher = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, teacher }: { id: string; teacher: Partial<Teacher> }) => {
      const updateData: any = {};
      if (teacher.name !== undefined) updateData.name = teacher.name;
      if (teacher.cpf !== undefined) updateData.cpf = teacher.cpf;
      if (teacher.phone !== undefined) updateData.phone = teacher.phone;
      if (teacher.email !== undefined) updateData.email = teacher.email;
      if (teacher.specialties !== undefined) updateData.specialties = teacher.specialties;
      if (teacher.status !== undefined) updateData.status = teacher.status;
      if (teacher.hireDate !== undefined) updateData.hire_date = teacher.hireDate;

      const { data, error } = await supabase
        .from('teachers')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    }
  });
};

export const useDeleteTeacher = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('teachers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    }
  });
};
