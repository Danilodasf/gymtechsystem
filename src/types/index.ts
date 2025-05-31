
export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Student {
  id: string;
  name: string;
  cpf: string;
  birthDate: string;
  phone: string;
  email: string;
  address: string;
  planId: string;
  enrollmentDate: string;
  expirationDate: string;
  status: 'active' | 'inactive' | 'expired';
}

export interface Plan {
  id: string;
  name: string;
  duration: number; // in months
  price: number;
  description?: string;
}

export interface Payment {
  id: string;
  studentId: string;
  planId: string;
  amount: number;
  dueDate: string;
  paymentDate?: string;
  status: 'pending' | 'paid' | 'overdue';
  method?: 'cash' | 'card' | 'pix' | 'transfer';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface Teacher {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  email: string;
  specialties: string[];
  status: 'active' | 'inactive';
  hireDate: string;
}

export interface Class {
  id: string;
  name: string;
  description?: string;
  teacherId: string;
  date: string;
  startTime: string;
  endTime: string;
  maxStudents: number;
  enrolledStudents: string[]; // student IDs
  status: 'scheduled' | 'completed' | 'cancelled';
  type: string;
  location: string;
  dayOfWeek: string;
}

export interface ClassEnrollment {
  id: string;
  classId: string;
  studentId: string;
  enrollmentDate: string;
  status: 'enrolled' | 'attended' | 'absent';
}
