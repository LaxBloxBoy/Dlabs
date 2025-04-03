import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import CourseDetail from "@/pages/CourseDetail";
import AboutPage from "@/pages/AboutPage";
import AllCoursesPage from "@/pages/AllCoursesPage";
import AuthPage from "@/pages/auth-page";
import ProfilePage from "@/pages/profile-page";
import CourseLearningPage from "@/pages/CourseLearningPage";
import SubscriptionPage from "@/pages/SubscriptionPage";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import CoursesPage from "@/pages/profile/CoursesPage";
import BillingPage from "@/pages/profile/BillingPage";
import NotificationsPage from "@/pages/profile/NotificationsPage";
import SettingsPage from "@/pages/profile/SettingsPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/courses" component={AllCoursesPage} />
      <Route path="/courses/:id" component={CourseDetail} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/auth/:tab" component={AuthPage} />
      {/* Legacy routes that redirect to new auth page */}
      <Route path="/login">
        <Redirect to="/auth" />
      </Route>
      <Route path="/signup">
        <Redirect to="/auth/signup" />
      </Route>
      {/* Protected routes */}
      <Route path="/profile" component={ProfilePage} />
      <Route path="/profile/courses" component={CoursesPage} />
      <Route path="/profile/billing" component={BillingPage} />
      <Route path="/profile/notifications" component={NotificationsPage} />
      <Route path="/profile/settings" component={SettingsPage} />
      <Route path="/courses/:courseId/learn" component={CourseLearningPage} />
      <Route path="/subscriptions" component={SubscriptionPage} />
      <Route path="/about" element={<AboutPage />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;