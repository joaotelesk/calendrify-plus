import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LoginPage } from "@/components/LoginPage";
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/pages/Dashboard";
import { RoomsManagement } from "@/pages/RoomsManagement";
import { CreateEvent } from "@/pages/CreateEvent";
import { PublicEvents } from "@/pages/PublicEvents";
import { MyAgenda } from "@/pages/MyAgenda";
import { MyEvents } from "@/pages/MyEvents";
import { AvailableRooms } from "@/pages/AvailableRooms";
import { MyRegistrations } from "@/pages/MyRegistrations";
import { Users } from "@/pages/Users";
import { Settings } from "@/pages/Settings";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }
  
  if (!user) {
    return <LoginPage />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/public" element={<PublicEvents />} />
              <Route path="/*" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="agenda" element={<MyAgenda />} />
                <Route path="rooms" element={<RoomsManagement />} />
                <Route path="users" element={<Users />} />
                <Route path="settings" element={<Settings />} />
                <Route path="create-event" element={<CreateEvent />} />
                <Route path="my-events" element={<MyEvents />} />
                <Route path="available-rooms" element={<AvailableRooms />} />
                <Route path="public-events" element={<PublicEvents />} />
                <Route path="my-registrations" element={<MyRegistrations />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
