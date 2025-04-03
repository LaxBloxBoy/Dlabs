import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { Dashboard } from "@/components/dashboard/Dashboard";

// Profile page wrapper with protected route
const ProfilePage = () => {
  const [location] = useLocation();
  
  return (
    <ProtectedRoute path="/profile*">
      <Dashboard />
    </ProtectedRoute>
  );
};

export default ProfilePage;