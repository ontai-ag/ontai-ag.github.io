
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAppAuth } from "./contexts/AuthContext";
import { useEffect } from "react";

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

const routes = [
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/marketplace",
    element: <Marketplace />,
  },
  {
    path: "/agents",
    element: <AgentMarketplace />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/developer",
    element: (
      <ProtectedRoute allowedRoles={['developer', 'admin']}>
        <DeveloperDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/developer/create-agent",
    element: (
      <ProtectedRoute allowedRoles={['developer', 'admin']}>
        <CreateAgent />
      </ProtectedRoute>
    ),
  },
  {
    path: "/developer/manage-agents",
    element: (
      <ProtectedRoute allowedRoles={['developer', 'admin']}>
        <ManageAgents />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/*",
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/task-submission",
    element: <TaskSubmission />,
  },
  {
    path: "/tasks/:id",
    element: (
      <ProtectedRoute>
        <TaskDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AuthChecker>
            <Routes>
              {routes.map((route) => (
                <Route key={route.path} {...route} />
              ))}
            </Routes>
          </AuthChecker>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
