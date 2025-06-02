
import React from "react";
import { 
  Home, 
  Users, 
  Calendar, 
  GraduationCap, 
  Package, 
  DollarSign, 
  BarChart3, 
  Settings,
  LogOut,
  Zap
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Button } from "./ui/button";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Alunos", url: "/students", icon: Users },
  { title: "Aulas", url: "/classes", icon: Calendar },
  { title: "Professores", url: "/teachers", icon: GraduationCap },
  { title: "Planos", url: "/plans", icon: Package },
  { title: "Pagamentos", url: "/payments", icon: DollarSign },
  { title: "Relatórios", url: "/reports", icon: BarChart3 },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  // Get username from user metadata or fallback to email
  const getUserDisplayName = () => {
    if (user?.user_metadata?.username) {
      return user.user_metadata.username;
    }
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    return user?.email?.split('@')[0] || 'Usuário';
  };

  const getInitials = () => {
    const displayName = getUserDisplayName();
    return displayName.charAt(0).toUpperCase();
  };

  return (
    <Sidebar className="border-r border-slate-200 dark:border-slate-700">
      <SidebarHeader className="border-b border-slate-200 dark:border-slate-700 p-4">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            GymTech
          </span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={isActive(item.url) ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300" : ""}
                  >
                    <Link to={item.url} className="flex items-center space-x-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-slate-200 dark:border-slate-700 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/profile" className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Perfil</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Button
              variant="ghost"
              onClick={logout}
              className="w-full justify-start p-2 h-auto text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        
        <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {getInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                {getUserDisplayName()}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Administrador</p>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
