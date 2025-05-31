
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ResponsiveLayout from "./components/ResponsiveLayout";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Students from "./components/Students";
import StudentForm from "./components/StudentForm";
import Plans from "./components/Plans";
import PlanForm from "./components/PlanForm";
import Payments from "./components/Payments";
import PaymentForm from "./components/PaymentForm";
import Teachers from "./components/Teachers";
import TeacherForm from "./components/TeacherForm";
import Classes from "./components/Classes";
import ClassForm from "./components/ClassForm";
import Reports from "./components/Reports";
import Profile from "./components/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              <Route element={
                <ProtectedRoute>
                  <ResponsiveLayout />
                </ProtectedRoute>
              }>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/students" element={<Students />} />
                <Route path="/students/new" element={<StudentForm />} />
                <Route path="/students/edit/:id" element={<StudentForm />} />
                <Route path="/plans" element={<Plans />} />
                <Route path="/plans/new" element={<PlanForm />} />
                <Route path="/plans/edit/:id" element={<PlanForm />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/payments/new" element={<PaymentForm />} />
                <Route path="/teachers" element={<Teachers />} />
                <Route path="/teachers/new" element={<TeacherForm />} />
                <Route path="/teachers/edit/:id" element={<TeacherForm />} />
                <Route path="/classes" element={<Classes />} />
                <Route path="/classes/new" element={<ClassForm />} />
                <Route path="/classes/edit/:id" element={<ClassForm />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
