
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Class } from '@/types';

export const useClasses = () => {
  return useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Class[];
    }
  });
};

export const useCreateClass = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (classData: Omit<Class, 'id'>) => {
      const { data, error } = await supabase
        .from('classes')
        .insert([{
          name: classData.name,
          description: classData.description,
          teacher_id: classData.teacherId,
          date: classData.date,
          start_time: classData.startTime,
          end_time: classData.endTime,
          max_students: classData.maxStudents,
          enrolled_students: classData.enrolledStudents,
          status: classData.status,
          type: classData.type,
          location: classData.location,
          day_of_week: classData.dayOfWeek
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    }
  });
};

export const useUpdateClass = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, classData }: { id: string; classData: Partial<Class> }) => {
      const updateData: any = {};
      if (classData.name !== undefined) updateData.name = classData.name;
      if (classData.description !== undefined) updateData.description = classData.description;
      if (classData.teacherId !== undefined) updateData.teacher_id = classData.teacherId;
      if (classData.date !== undefined) updateData.date = classData.date;
      if (classData.startTime !== undefined) updateData.start_time = classData.startTime;
      if (classData.endTime !== undefined) updateData.end_time = classData.endTime;
      if (classData.maxStudents !== undefined) updateData.max_students = classData.maxStudents;
      if (classData.enrolledStudents !== undefined) updateData.enrolled_students = classData.enrolledStudents;
      if (classData.status !== undefined) updateData.status = classData.status;
      if (classData.type !== undefined) updateData.type = classData.type;
      if (classData.location !== undefined) updateData.location = classData.location;
      if (classData.dayOfWeek !== undefined) updateData.day_of_week = classData.dayOfWeek;

      const { data, error } = await supabase
        .from('classes')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    }
  });
};

export const useDeleteClass = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    }
  });
};
