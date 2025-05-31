import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Student, Plan, Payment, Teacher, Class, ClassEnrollment } from '../types';

interface DataContextType {
  students: Student[];
  plans: Plan[];
  payments: Payment[];
  teachers: Teacher[];
  classes: Class[];
  classEnrollments: ClassEnrollment[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addPlan: (plan: Omit<Plan, 'id'>) => void;
  updatePlan: (id: string, plan: Partial<Plan>) => void;
  deletePlan: (id: string) => void;
  addPayment: (payment: Omit<Payment, 'id'>) => void;
  updatePayment: (id: string, payment: Partial<Payment>) => void;
  deletePayment: (id: string) => void;
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  addClass: (classData: Omit<Class, 'id'>) => void;
  updateClass: (id: string, classData: Partial<Class>) => void;
  deleteClass: (id: string) => void;
  enrollStudentInClass: (classId: string, studentId: string) => void;
  unenrollStudentFromClass: (classId: string, studentId: string) => void;
  getPlanById: (id: string) => Plan | undefined;
  getTeacherById: (id: string) => Teacher | undefined;
  getClassById: (id: string) => Class | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

const initialPlans: Plan[] = [
  { id: '1', name: 'Plano Mensal', duration: 1, price: 80, description: 'Acesso completo por 1 mês' },
  { id: '2', name: 'Plano Trimestral', duration: 3, price: 210, description: 'Acesso completo por 3 meses' },
  { id: '3', name: 'Plano Semestral', duration: 6, price: 390, description: 'Acesso completo por 6 meses' },
  { id: '4', name: 'Plano Anual', duration: 12, price: 720, description: 'Acesso completo por 12 meses' }
];

const initialStudents: Student[] = [
  {
    id: '1',
    name: 'João Silva',
    cpf: '123.456.789-00',
    birthDate: '1990-05-15',
    phone: '(11) 99999-9999',
    email: 'joao@email.com',
    address: 'Rua das Flores, 123',
    planId: '2',
    enrollmentDate: '2024-01-15',
    expirationDate: '2024-04-15',
    status: 'active'
  },
  {
    id: '2',
    name: 'Maria Santos',
    cpf: '987.654.321-00',
    birthDate: '1985-08-22',
    phone: '(11) 88888-8888',
    email: 'maria@email.com',
    address: 'Av. Principal, 456',
    planId: '1',
    enrollmentDate: '2024-02-01',
    expirationDate: '2024-03-01',
    status: 'expired'
  }
];

const initialPayments: Payment[] = [
  {
    id: '1',
    studentId: '1',
    planId: '2',
    amount: 210,
    dueDate: '2024-01-15',
    paymentDate: '2024-01-10',
    status: 'paid',
    method: 'card'
  },
  {
    id: '2',
    studentId: '2',
    planId: '1',
    amount: 80,
    dueDate: '2024-02-01',
    status: 'overdue'
  },
  {
    id: '3',
    studentId: '1',
    planId: '2',
    amount: 210,
    dueDate: '2024-04-15',
    status: 'pending'
  }
];

const initialTeachers: Teacher[] = [
  {
    id: '1',
    name: 'Carlos Silva',
    cpf: '111.222.333-44',
    phone: '(11) 99999-1111',
    email: 'carlos@academia.com',
    specialties: ['Musculação', 'Crossfit'],
    status: 'active',
    hireDate: '2024-01-01'
  },
  {
    id: '2',
    name: 'Ana Santos',
    cpf: '555.666.777-88',
    phone: '(11) 99999-2222',
    email: 'ana@academia.com',
    specialties: ['Yoga', 'Pilates', 'Funcional'],
    status: 'active',
    hireDate: '2024-02-01'
  }
];

const initialClasses: Class[] = [
  {
    id: '1',
    name: 'Yoga Matinal',
    description: 'Aula de yoga para relaxamento e fortalecimento',
    teacherId: '2',
    date: '2024-12-02',
    startTime: '07:00',
    endTime: '08:00',
    maxStudents: 15,
    enrolledStudents: ['1'],
    status: 'scheduled',
    type: 'Yoga',
    location: 'Sala 1',
    dayOfWeek: 'segunda-feira'
  },
  {
    id: '2',
    name: 'Crossfit Intenso',
    description: 'Treino funcional de alta intensidade',
    teacherId: '1',
    date: '2024-12-02',
    startTime: '18:00',
    endTime: '19:00',
    maxStudents: 10,
    enrolledStudents: ['1', '2'],
    status: 'scheduled',
    type: 'Crossfit',
    location: 'Sala 2',
    dayOfWeek: 'segunda-feira'
  }
];

const initialClassEnrollments: ClassEnrollment[] = [];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [classes, setClasses] = useState<Class[]>(initialClasses);
  const [classEnrollments, setClassEnrollments] = useState<ClassEnrollment[]>(initialClassEnrollments);

  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...studentData,
      id: Date.now().toString()
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const updateStudent = (id: string, updatedData: Partial<Student>) => {
    setStudents(prev => prev.map(student => 
      student.id === id ? { ...student, ...updatedData } : student
    ));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(student => student.id !== id));
  };

  const addPlan = (planData: Omit<Plan, 'id'>) => {
    const newPlan: Plan = {
      ...planData,
      id: Date.now().toString()
    };
    setPlans(prev => [...prev, newPlan]);
  };

  const updatePlan = (id: string, updatedData: Partial<Plan>) => {
    setPlans(prev => prev.map(plan => 
      plan.id === id ? { ...plan, ...updatedData } : plan
    ));
  };

  const deletePlan = (id: string) => {
    setPlans(prev => prev.filter(plan => plan.id !== id));
  };

  const addPayment = (paymentData: Omit<Payment, 'id'>) => {
    const newPayment: Payment = {
      ...paymentData,
      id: Date.now().toString()
    };
    setPayments(prev => [...prev, newPayment]);
  };

  const updatePayment = (id: string, updatedData: Partial<Payment>) => {
    setPayments(prev => prev.map(payment => 
      payment.id === id ? { ...payment, ...updatedData } : payment
    ));
  };

  const deletePayment = (id: string) => {
    setPayments(prev => prev.filter(payment => payment.id !== id));
  };

  const addTeacher = (teacherData: Omit<Teacher, 'id'>) => {
    const newTeacher: Teacher = {
      ...teacherData,
      id: Date.now().toString()
    };
    setTeachers(prev => [...prev, newTeacher]);
  };

  const updateTeacher = (id: string, updatedData: Partial<Teacher>) => {
    setTeachers(prev => prev.map(teacher => 
      teacher.id === id ? { ...teacher, ...updatedData } : teacher
    ));
  };

  const deleteTeacher = (id: string) => {
    setTeachers(prev => prev.filter(teacher => teacher.id !== id));
  };

  const addClass = (classData: Omit<Class, 'id'>) => {
    const newClass: Class = {
      ...classData,
      id: Date.now().toString()
    };
    setClasses(prev => [...prev, newClass]);
  };

  const updateClass = (id: string, updatedData: Partial<Class>) => {
    setClasses(prev => prev.map(classItem => 
      classItem.id === id ? { ...classItem, ...updatedData } : classItem
    ));
  };

  const deleteClass = (id: string) => {
    setClasses(prev => prev.filter(classItem => classItem.id !== id));
  };

  const enrollStudentInClass = (classId: string, studentId: string) => {
    setClasses(prev => prev.map(classItem => {
      if (classItem.id === classId && !classItem.enrolledStudents.includes(studentId)) {
        return {
          ...classItem,
          enrolledStudents: [...classItem.enrolledStudents, studentId]
        };
      }
      return classItem;
    }));
  };

  const unenrollStudentFromClass = (classId: string, studentId: string) => {
    setClasses(prev => prev.map(classItem => {
      if (classItem.id === classId) {
        return {
          ...classItem,
          enrolledStudents: classItem.enrolledStudents.filter(id => id !== studentId)
        };
      }
      return classItem;
    }));
  };

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
    <DataContext.Provider value={{
      students,
      plans,
      payments,
      teachers,
      classes,
      classEnrollments,
      addStudent,
      updateStudent,
      deleteStudent,
      addPlan,
      updatePlan,
      deletePlan,
      addPayment,
      updatePayment,
      deletePayment,
      addTeacher,
      updateTeacher,
      deleteTeacher,
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
    </DataContext.Provider>
  );
};
