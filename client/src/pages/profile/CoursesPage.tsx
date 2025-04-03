import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { ProtectedRoute } from "@/lib/protected-route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SearchIcon, Filter, BookOpen, Clock, ChevronRight } from "lucide-react";

function CoursesContent() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  // Fetch user enrollments
  const { data: enrollments, isLoading } = useQuery<any[]>({
    queryKey: ["/api/enrollments"],
    enabled: !!user
  });

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="h-8 w-64 bg-slate-200 animate-pulse rounded mb-8"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-slate-200 animate-pulse rounded"></div>
        ))}
      </div>
    );
  }

  if (!enrollments) {
    return (
      <div className="text-center py-10">
        <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-medium mb-2">No courses yet</h3>
        <p className="text-muted-foreground mb-6">You haven't enrolled in any courses.</p>
        <Button onClick={() => setLocation("/courses")}>Browse Courses</Button>
      </div>
    );
  }

  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch = enrollment.course.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    if (filter === "in-progress") return matchesSearch && enrollment.progress > 0 && enrollment.progress < 100;
    if (filter === "completed") return matchesSearch && enrollment.progress === 100;
    if (filter === "not-started") return matchesSearch && enrollment.progress === 0;
    
    return matchesSearch;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">My Courses</h1>
        <p className="text-muted-foreground">View and manage your enrolled courses</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="relative max-w-sm">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search your courses..." 
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select 
            className="bg-transparent text-sm font-medium focus:outline-none"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Courses</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="not-started">Not Started</option>
          </select>
        </div>
      </div>

      <Tabs defaultValue="grid" className="mb-8">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          <Button onClick={() => setLocation("/courses")}>Browse More Courses</Button>
        </div>

        <TabsContent value="grid" className="mt-6">
          {filteredEnrollments.length === 0 ? (
            <div className="text-center py-10 border rounded-lg bg-slate-50">
              <SearchIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No courses found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search or filter to find what you're looking for.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEnrollments.map((enrollment) => (
                <Card key={enrollment.id} className="overflow-hidden">
                  <div className="aspect-video w-full overflow-hidden">
                    <img 
                      src={enrollment.course.image} 
                      alt={enrollment.course.title}
                      className="h-full w-full object-cover transition-all hover:scale-105"
                    />
                  </div>
                  <CardHeader className="p-4 pb-0">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{enrollment.course.title}</CardTitle>
                      <Badge variant={
                        enrollment.progress === 100 ? "secondary" : 
                        enrollment.progress > 0 ? "default" : 
                        "outline"
                      }>
                        {enrollment.progress === 100 ? "Completed" : 
                         enrollment.progress > 0 ? "In Progress" : "Not Started"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="mb-4">
                      <div className="flex justify-between mb-1.5 text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{enrollment.progress}%</span>
                      </div>
                      <Progress value={enrollment.progress} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>{enrollment.course.duration}</span>
                      </div>
                      <div>
                        <span>Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => setLocation(`/courses/${enrollment.courseId}/learn`)}
                    >
                      {enrollment.progress === 0 ? "Start Learning" : 
                       enrollment.progress === 100 ? "Review Course" : "Continue Learning"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="list" className="mt-6">
          {filteredEnrollments.length === 0 ? (
            <div className="text-center py-10 border rounded-lg bg-slate-50">
              <SearchIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No courses found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search or filter to find what you're looking for.</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-slate-50 dark:bg-slate-800 p-3 border-b grid grid-cols-12 text-sm font-medium">
                <div className="col-span-5">Course</div>
                <div className="col-span-2 text-center">Progress</div>
                <div className="col-span-2 text-center">Duration</div>
                <div className="col-span-2 text-center">Enrolled</div>
                <div className="col-span-1"></div>
              </div>
              <div className="divide-y">
                {filteredEnrollments.map((enrollment) => (
                  <div key={enrollment.id} className="p-3 grid grid-cols-12 items-center hover:bg-slate-50">
                    <div className="col-span-5 flex items-center gap-3">
                      <div className="h-12 w-20 overflow-hidden rounded">
                        <img 
                          src={enrollment.course.image} 
                          alt={enrollment.course.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{enrollment.course.title}</h4>
                        <Badge variant={
                          enrollment.progress === 100 ? "secondary" : 
                          enrollment.progress > 0 ? "default" : 
                          "outline"
                        } className="mt-1">
                          {enrollment.progress === 100 ? "Completed" : 
                           enrollment.progress > 0 ? "In Progress" : "Not Started"}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="col-span-2 text-center">
                      <div className="w-full h-2 bg-slate-200 rounded-full">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${enrollment.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs mt-1 block">{enrollment.progress}%</span>
                    </div>
                    
                    <div className="col-span-2 text-center text-sm text-muted-foreground">
                      {enrollment.course.duration}
                    </div>
                    
                    <div className="col-span-2 text-center text-sm text-muted-foreground">
                      {new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </div>
                    
                    <div className="col-span-1 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setLocation(`/courses/${enrollment.courseId}/learn`)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

const CoursesPage = () => {
  return (
    <ProtectedRoute path="/profile/courses">
      <DashboardLayout>
        <CoursesContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default CoursesPage;