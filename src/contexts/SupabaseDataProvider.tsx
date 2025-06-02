
import React, { createContext, useContext, ReactNode } from 'react';
import { 
  useStudents, useCreateStudent, useUpdateStudent, useDeleteStudent,
  usePlans, useCreatePlan, useUpdatePlan, useDeletePlan,
  usePayments, useCreatePayment, useUpdatePayment, useDeletePayment,
  useTeachers, useCreateTeacher, useUpdateTeacher, useDeleteTeacher,
  useClasses, useCreateClass, useUpdateClass, useDeleteClass
} from '../hooks';
import { transformStudentFromDB, transformPaymentFromDB, transformTeacherFromDB, transformClassFromDB } from '../utils/dataTransforms';
import { Student, Plan, Payment, Teacher, Class } from '../types';

interface SupabaseDataContextType {
  // Students
  students: Student[];
  studentsLoading: boolean;
  addStudent: (student: Omit<Student, 'id'>) => Promise<void>;
  updateStudent: (id: string, student: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  
  // Plans
  plans: Plan[];
  plansLoading: boolean;
  addPlan: (plan: Omit<Plan, 'id'>) => Promise<void>;
  updatePlan: (id: string, plan: Partial<Plan>) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  
  // Payments
  payments: Payment[];
  paymentsLoading: boolean;
  addPayment: (payment: Omit<Payment, 'id'>) => Promise<void>;
  updatePayment: (id: string, payment: Partial<Payment>) => Promise<void>;
  deletePayment: (id: string) => Promise<void>;
  
  // Teachers
  teachers: Teacher[];
  teachersLoading: boolean;
  addTeacher: (teacher: Omit<Teacher, 'id'>) => Promise<void>;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => Promise<void>;
  deleteTeacher: (id: string) => Promise<void>;
  
  // Classes
  classes: Class[];
  classesLoading: boolean;
  addClass: (classData: Omit<Class, 'id'>) => Promise<void>;
  updateClass: (id: string, classData: Partial<Class>) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
  
  // Helper functions
  getPlanById: (id: string) => Plan | undefined;
  getTeacherById: (id: string) => Teacher | undefined;
  getClassById: (id: string) => Class | undefined;
  enrollStudentInClass: (classId: string, studentId: string) => Promise<void>;
  unenrollStudentFromClass: (classId: string, studentId: string) => Promise<void>;
}

const SupabaseDataContext = createContext<SupabaseDataContextType | undefined>(undefined);

export const useSupabaseData = () => {
  const context = useContext(SupabaseDataContext);
  if (context === undefined) {
    throw new Error('useSupabaseData must be used within a SupabaseDataProvider');
  }
  return context;
};

export const SupabaseDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Students
  const { data: studentsData = [], isLoading: studentsLoading } = useStudents();
  const createStudentMutation = useCreateStudent();
  const updateStudentMutation = useUpdateStudent();
  const deleteStudentMutation = useDeleteStudent();
  
  // Plans
  const { data: plansData = [], isLoading: plansLoading } = usePlans();
  const createPlanMutation = useCreatePlan();
  const updatePlanMutation = useUpdatePlan();
  const deletePlanMutation = useDeletePlan();
  
  // Payments
  const { data: paymentsData = [], isLoading: paymentsLoading } = usePayments();
  const createPaymentMutation = useCreatePayment();
  const updatePaymentMutation = useUpdatePayment();
  const deletePaymentMutation = useDeletePayment();
  
  // Teachers
  const { data: teachersData = [], isLoading: teachersLoading } = useTeachers();
  const createTeacherMutation = useCreateTeacher();
  const updateTeacherMutation = useUpdateTeacher();
  const deleteTeacherMutation = useDeleteTeacher();
  
  // Classes
  const { data: classesData = [], isLoading: classesLoading } = useClasses();
  const createClassMutation = useCreateClass();
  const updateClassMutation = useUpdateClass();
  const deleteClassMutation = useDeleteClass();

  // Transform data
  const students: Student[] = studentsData.map(transformStudentFromDB);
  const plans: Plan[] = plansData;
  const payments: Payment[] = paymentsData.map(transformPaymentFromDB);
  const teachers: Teacher[] = teachersData.map(transformTeacherFromDB);
  const classes: Class[] = classesData.map(transformClassFromDB);

  // Student methods
  const addStudent = async (student: Omit<Student, 'id'>) => {
    await createStudentMutation.mutateAsync(student);
  };

  const updateStudent = async (id: string, student: Partial<Student>) => {
    await updateStudentMutation.mutateAsync({ id, student });
  };

  const deleteStudent = async (id: string) => {
    await deleteStudentMutation.mutateAsync(id);
  };

  // Plan methods
  const addPlan = async (plan: Omit<Plan, 'id'>) => {
    await createPlanMutation.mutateAsync(plan);
  };

  const updatePlan = async (id: string, plan: Partial<Plan>) => {
    await updatePlanMutation.mutateAsync({ id, plan });
  };

  const deletePlan = async (id: string) => {
    await deletePlanMutation.mutateAsync(id);
  };

  // Payment methods
  const addPayment = async (payment: Omit<Payment, 'id'>) => {
    await createPaymentMutation.mutateAsync(payment);
  };

  const updatePayment = async (id: string, payment: Partial<Payment>) => {
    await updatePaymentMutation.mutateAsync({ id, payment });
  };

  const deletePayment = async (id: string) => {
    await deletePaymentMutation.mutateAsync(id);
  };

  // Teacher methods
  const addTeacher = async (teacher: Omit<Teacher, 'id'>) => {
    await createTeacherMutation.mutateAsync(teacher);
  };

  const updateTeacher = async (id: string, teacher: Partial<Teacher>) => {
    await updateTeacherMutation.mutateAsync({ id, teacher });
  };

  const deleteTeacher = async (id: string) => {
    await deleteTeacherMutation.mutateAsync(id);
  };

  // Class methods
  const addClass = async (classData: Omit<Class, 'id'>) => {
    await createClassMutation.mutateAsync(classData);
  };

  const updateClass = async (id: string, classData: Partial<Class>) => {
    await updateClassMutation.mutateAsync({ id, classData });
  };

  const deleteClass = async (id: string) => {
    await deleteClassMutation.mutateAsync(id);
  };

  const enrollStudentInClass = async (classId: string, studentId: string) => {
    const classToUpdate = classes.find(c => c.id === classId);
    if (classToUpdate && !classToUpdate.enrolledStudents.includes(studentId)) {
      const updatedEnrolledStudents = [...classToUpdate.enrolledStudents, studentId];
      await updateClass(classId, { enrolledStudents: updatedEnrolledStudents });
    }
  };

  const unenrollStudentFromClass = async (classId: string, studentId: string) => {
    const classToUpdate = classes.find(c => c.id === classId);
    if (classToUpdate) {
      const updatedEnrolledStudents = classToUpdate.enrolledStudents.filter(id => id !== studentId);
      await updateClass(classId, { enrolledStudents: updatedEnrolledStudents });
    }
  };

  // Helper functions
  const getPlanById = (id: string) => {
    return plans.find(plan => plan.id === id);
  };

  const getTeacherById = (id: string) => {
    return teachers.find(teacher => teacher.id === id);
  };

  const getClassById = (id: string) => {
    return classes.find(classItem => classItem.id === id);
  };

  return (
    <SupabaseDataContext.Provider value={{
      students,
      studentsLoading,
      addStudent,
      updateStudent,
      deleteStudent,
      plans,
      plansLoading,
      addPlan,
      updatePlan,
      deletePlan,
      payments,
      paymentsLoading,
      addPayment,
      updatePayment,
      deletePayment,
      teachers,
      teachersLoading,
      addTeacher,
      updateTeacher,
      deleteTeacher,
      classes,
      classesLoading,
      addClass,
      updateClass,
      deleteClass,
      enrollStudentInClass,
      unenrollStudentFromClass,
      getPlanById,
      getTeacherById,
      getClassById
    }}>
      {children}
    </SupabaseDataContext.Provider>
  );
};
