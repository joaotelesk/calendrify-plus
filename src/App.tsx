import { Layout } from "@/components/Layout";
import { LoginPage } from "@/components/LoginPage";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AvailableRooms } from "@/pages/AvailableRooms";
import { CreateEvent } from "@/pages/CreateEvent";
import { Dashboard } from "@/pages/Dashboard";
import { MyAgenda } from "@/pages/MyAgenda";
import { MyEvents } from "@/pages/MyEvents";
import { MyRegistrations } from "@/pages/MyRegistrations";
import { PublicEvents } from "@/pages/PublicEvents";
import { RoomsManagement } from "@/pages/RoomsManagement";
import { Settings } from "@/pages/Settings";
import { Users } from "@/pages/Users";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginF from "./components/LoginF";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  console.log(user);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route path="/login" element={<LoginF />} />
                <Route path="/public" element={<PublicEvents />} />
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="agenda" element={<MyAgenda />} />
                  <Route path="rooms" element={<RoomsManagement />} />
                  <Route path="users" element={<Users />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="create-event" element={<CreateEvent />} />
                  <Route path="my-events" element={<MyEvents />} />
                  <Route path="available-rooms" element={<AvailableRooms />} />
                  <Route path="public-events" element={<PublicEvents />} />
                  <Route
                    path="my-registrations"
                    element={<MyRegistrations />}
                  />
                </Route>
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
