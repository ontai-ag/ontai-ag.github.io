
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAppAuth } from "./contexts/AuthContext";
import React, { useEffect, Suspense, lazy } from "react"; // Add Suspense and lazy
import { useTranslation } from 'react-i18next'; // Импортируем хук
// import LanguageSwitcher from "@/components/ui-custom/LanguageSwitcher";

// Lazy load pages
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const AgentMarketplace = lazy(() => import("./pages/AgentMarketplace"));
const SignIn = lazy(() => import("./pages/auth/SignIn"));
const SignUp = lazy(() => import("./pages/auth/SignUp"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const DeveloperDashboard = lazy(() => import("./pages/developer/Dashboard"));
const CreateAgent = lazy(() => import("./pages/developer/CreateAgent"));
const ManageAgents = lazy(() => import("./pages/developer/ManageAgents"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const TaskSubmission = lazy(() => import("./pages/TaskSubmission"));
const TaskDetails = lazy(() => import("./pages/TaskDetails"));
const ForProviders = lazy(() => import("./pages/ForProviders")); // Lazy load ForProviders
const Pricing = lazy(() => import("./pages/Pricing")); // Add this line

import ProtectedRoute from "./components/auth/ProtectedRoute";

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
        <img src="/ezgif-1de2b2f378170e.gif" alt="Loading..." className="h-24 w-auto" />
      </div>
    );
  }
  
  return <>{children}</>;
};

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <img src="/ezgif-1de2b2f378170e.gif" alt="Loading..." className="h-24 w-auto" />
  </div>
);

function App() {
  const { t } = useTranslation(); // Используем хук для получения функции перевода

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthChecker>
          <TooltipProvider>
            <BrowserRouter>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/agent-marketplace" element={<AgentMarketplace />} />
                  <Route path="/for-providers" element={<ForProviders />} /> {/* Add route for ForProviders */}
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
                  <Route path="/pricing" element={<Pricing />} /> {/* Add this line */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
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
