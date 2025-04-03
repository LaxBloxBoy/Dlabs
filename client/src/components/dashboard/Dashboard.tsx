import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Define types for our API responses
interface DashboardStats {
  enrolledCourses: number;
  completionRate: number;
  totalCoursesTime: number;
  averageProgress: number;
  activeCourses: number;
  completedCourses: number;
  notStartedCourses: number;
}

interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  enrolledAt: string;
  status: string;
  progress: number;
  course: {
    id: number;
    title: string;
    description: string;
    image: string;
    price: number;
    difficulty: string;
    duration: string;
    categoryId: number;
    instructorId: number;
    isPopular: boolean;
    isNew: boolean;
    rating: number;
    instructor: {
      id: number;
      name: string;
      avatar: string;
      bio: string;
    };
    category: {
      id: number;
      name: string;
      icon: string;
      courseCount: number;
    };
  };
}

import { StatCard } from "./StatCard";
import { CourseCard } from "./CourseCard";
import { ActivityChart } from "./ActivityChart";
import { ProgressIndicator } from "./ProgressIndicator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

import { 
  BookOpen,
  Clock,
  BarChart,
  Award,
  ChevronRight,
  Search,
  Filter,
  Settings,
  Bell
} from "lucide-react";

export function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("overview");

  // Fetch dashboard stats
  const { 
    data: stats, 
    isLoading: isLoadingStats,
    error: statsError
  } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
    enabled: !!user
  });

  // Fetch user enrollments
  const { 
    data: enrollments,
    isLoading: isLoadingEnrollments,
    error: enrollmentsError
  } = useQuery<Enrollment[]>({
    queryKey: ["/api/enrollments"],
    enabled: !!user
  });

  // Update course progress
  const updateProgressMutation = useMutation({
    mutationFn: async ({ enrollmentId, progress }: { enrollmentId: number; progress: number }) => {
      const res = await apiRequest("PATCH", `/api/enrollments/${enrollmentId}/progress`, { progress });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Progress updated",
        description: "Your course progress has been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update progress",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleContinueCourse = (enrollmentId: number) => {
    // In a real implementation, this would open the course content at the last position
    // For now, we'll simulate progress by adding 10% to the current progress

    if (!enrollments) return;
    const enrollment = enrollments.find((e) => e.id === enrollmentId);
    if (!enrollment) return;

    const newProgress = Math.min(enrollment.progress + 10, 100);
    updateProgressMutation.mutate({ enrollmentId, progress: newProgress });
  };

  if (isLoadingStats || isLoadingEnrollments) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex">
                  <Skeleton className="h-16 w-16 rounded-md" />
                  <div className="ml-4 flex-1">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/4 mb-2" />
                    <Skeleton className="h-2 w-full mt-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (statsError || enrollmentsError) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error Loading Dashboard</CardTitle>
          <CardDescription>
            There was a problem loading your dashboard data. Please try again later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
              queryClient.invalidateQueries({ queryKey: ["/api/enrollments"] });
            }}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Organize enrollments by status
  const activeEnrollments = enrollments?.filter((e) => e.status === "active" && e.progress < 100) || [];
  const completedEnrollments = enrollments?.filter((e) => e.progress === 100 || e.status === "completed") || [];
  const notStartedEnrollments = enrollments?.filter((e) => e.progress === 0 && e.status === "active") || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.username}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Your Courses"
          value={stats?.enrolledCourses || 0}
          icon={BookOpen}
          iconClassName="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
        />
        <StatCard
          title="Total Learning"
          value={`${stats?.totalCoursesTime || 0} hours`}
          icon={Clock}
          iconClassName="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
        />
        <StatCard
          title="Completion Rate"
          value={`${stats?.completionRate || 0}%`}
          icon={BarChart}
          iconClassName="bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
        />
        <StatCard
          title="Certificates"
          value={stats?.completedCourses || 0}
          icon={Award}
          iconClassName="bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300"
        />
      </div>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex md:grid-cols-none">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ActivityChart 
              title="Learning Activity" 
              description="Hours spent learning per month"
              chartType="area"
              className="lg:col-span-2"
            />
            
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
                <CardDescription>Overall statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Average Progress</span>
                      <span className="text-sm text-muted-foreground">{stats?.averageProgress || 0}%</span>
                    </div>
                    <ProgressIndicator progress={stats?.averageProgress || 0} showPercentage={false} />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
                        <span className="text-sm">Completed</span>
                      </div>
                      <span className="text-sm font-medium">{stats?.completedCourses || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-2 h-3 w-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm">In Progress</span>
                      </div>
                      <span className="text-sm font-medium">{stats?.activeCourses || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-2 h-3 w-3 rounded-full bg-gray-300"></div>
                        <span className="text-sm">Not Started</span>
                      </div>
                      <span className="text-sm font-medium">{stats?.notStartedCourses || 0}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Continue Learning</CardTitle>
                <CardDescription>Pick up where you left off</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedTab("courses")}>
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {activeEnrollments.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">You haven't started any courses yet.</p>
                  <Button 
                    className="mt-4"
                    onClick={() => setLocation("/")}
                  >
                    Browse Courses
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeEnrollments.slice(0, 4).map((enrollment) => (
                    <CourseCard
                      key={enrollment.id}
                      enrollment={enrollment}
                      onContinue={handleContinueCourse}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="courses" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
            <div>
              <Button 
                onClick={() => setLocation("/")}
              >
                Browse More Courses
              </Button>
            </div>
          </div>
          
          {enrollments?.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <BookOpen className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No courses yet</h3>
                <p className="text-muted-foreground text-center mt-2 max-w-md">
                  You haven't enrolled in any courses yet. Browse our catalog to get started.
                </p>
                <Button 
                  className="mt-4"
                  onClick={() => setLocation("/")}
                >
                  Browse Courses
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* In Progress Courses */}
              {activeEnrollments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>In Progress</CardTitle>
                    <CardDescription>Courses you're currently learning</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeEnrollments.map((enrollment) => (
                        <CourseCard
                          key={enrollment.id}
                          enrollment={enrollment}
                          onContinue={handleContinueCourse}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Completed Courses */}
              {completedEnrollments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Completed</CardTitle>
                    <CardDescription>Courses you've finished</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {completedEnrollments.map((enrollment) => (
                        <CourseCard
                          key={enrollment.id}
                          enrollment={enrollment}
                          onContinue={handleContinueCourse}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Not Started Courses */}
              {notStartedEnrollments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Not Started</CardTitle>
                    <CardDescription>Courses you've enrolled in but haven't started yet</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {notStartedEnrollments.map((enrollment) => (
                        <CourseCard
                          key={enrollment.id}
                          enrollment={enrollment}
                          onContinue={handleContinueCourse}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}