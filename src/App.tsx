
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAppAuth } from "./contexts/AuthContext";
import { useEffect } from "react";
import { useTranslation } from 'react-i18next'; // Импортируем хук
// import LanguageSwitcher from "@/components/ui-custom/LanguageSwitcher";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Marketplace from "./pages/Marketplace";
import AgentMarketplace from "./pages/AgentMarketplace";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Dashboard from "./pages/Dashboard";
import DeveloperDashboard from "./pages/developer/Dashboard";
import CreateAgent from "./pages/developer/CreateAgent";
import ManageAgents from "./pages/developer/ManageAgents";
import AdminDashboard from "./pages/admin/Dashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import TaskSubmission from "./pages/TaskSubmission";
import TaskDetails from "./pages/TaskDetails";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
    },
  },
});

const DashboardRedirect = () => {
  const { getDashboardPath } = useAppAuth();
  return <Navigate to={getDashboardPath()} replace />;
};

const AuthChecker = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useAppAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return <>{children}</>;
};

function App() {
  const { t } = useTranslation(); // Используем хук для получения функции перевода

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthChecker>
          <TooltipProvider>
            <BrowserRouter>
              
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/agent-marketplace" element={<AgentMarketplace />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/dashboard" element={<DashboardRedirect />} />
                <Route
                  path="/dashboard/user"
                  element={<ProtectedRoute allowedRoles={['user']}><Dashboard /></ProtectedRoute>}
                />
                <Route
                  path="/dashboard/developer"
                  element={<ProtectedRoute allowedRoles={['developer']}><DeveloperDashboard /></ProtectedRoute>}
                />
                <Route
                  path="/dashboard/admin"
                  element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>}
                />
                <Route
                  path="/developer/create-agent"
                  element={<ProtectedRoute allowedRoles={['developer']}><CreateAgent /></ProtectedRoute>}
                />
                <Route
                  path="/developer/manage-agents"
                  element={<ProtectedRoute allowedRoles={['developer']}><ManageAgents /></ProtectedRoute>}
                />
                <Route 
                  path="/task-submission" 
                  element={<ProtectedRoute allowedRoles={['user']}><TaskSubmission /></ProtectedRoute>} 
                />
                <Route 
                  path="/task/:taskId" 
                  element={<ProtectedRoute allowedRoles={['user']}><TaskDetails /></ProtectedRoute>} 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </AuthChecker>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
