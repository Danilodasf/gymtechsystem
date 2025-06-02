
// Utility functions to transform data between frontend types and Supabase schema
export const transformStudentFromDB = (dbStudent: any) => ({
  id: dbStudent.id,
  name: dbStudent.name,
  cpf: dbStudent.cpf,
  birthDate: dbStudent.birth_date,
  phone: dbStudent.phone,
  email: dbStudent.email,
  address: dbStudent.address,
  planId: dbStudent.plan_id,
  enrollmentDate: dbStudent.enrollment_date,
  expirationDate: dbStudent.expiration_date,
  status: dbStudent.status
});

export const transformPaymentFromDB = (dbPayment: any) => ({
  id: dbPayment.id,
  studentId: dbPayment.student_id,
  planId: dbPayment.plan_id,
  amount: dbPayment.amount,
  dueDate: dbPayment.due_date,
  paymentDate: dbPayment.payment_date,
  status: dbPayment.status,
  method: dbPayment.method
});

export const transformTeacherFromDB = (dbTeacher: any) => ({
  id: dbTeacher.id,
  name: dbTeacher.name,
  cpf: dbTeacher.cpf,
  phone: dbTeacher.phone,
  email: dbTeacher.email,
  specialties: dbTeacher.specialties || [],
  status: dbTeacher.status,
  hireDate: dbTeacher.hire_date
});

export const transformClassFromDB = (dbClass: any) => ({
  id: dbClass.id,
  name: dbClass.name,
  description: dbClass.description,
  teacherId: dbClass.teacher_id,
  date: dbClass.date,
  startTime: dbClass.start_time,
  endTime: dbClass.end_time,
  maxStudents: dbClass.max_students,
  enrolledStudents: dbClass.enrolled_students || [],
  status: dbClass.status,
  type: dbClass.type,
  location: dbClass.location,
  dayOfWeek: dbClass.day_of_week
});
