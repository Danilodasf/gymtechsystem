
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Student } from '@/types';

export const useStudents = () => {
  return useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar estudantes:', error);
        throw error;
      }
      return data as Student[];
    }
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (student: Omit<Student, 'id'>) => {
      const { data, error } = await supabase
        .from('students')
        .insert([{
          name: student.name,
          cpf: student.cpf,
          birth_date: student.birthDate,
          phone: student.phone,
          email: student.email,
          address: student.address,
          plan_id: student.planId,
          enrollment_date: student.enrollmentDate,
          expiration_date: student.expirationDate,
          status: student.status
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    }
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, student }: { id: string; student: Partial<Student> }) => {
      const updateData: any = {};
      if (student.name !== undefined) updateData.name = student.name;
      if (student.cpf !== undefined) updateData.cpf = student.cpf;
      if (student.birthDate !== undefined) updateData.birth_date = student.birthDate;
      if (student.phone !== undefined) updateData.phone = student.phone;
      if (student.email !== undefined) updateData.email = student.email;
      if (student.address !== undefined) updateData.address = student.address;
      if (student.planId !== undefined) updateData.plan_id = student.planId;
      if (student.enrollmentDate !== undefined) updateData.enrollment_date = student.enrollmentDate;
      if (student.expirationDate !== undefined) updateData.expiration_date = student.expirationDate;
      if (student.status !== undefined) updateData.status = student.status;

      const { data, error } = await supabase
        .from('students')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    }
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    }
  });
};
