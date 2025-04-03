import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BarChart2, Calendar, Clock, Star, CheckCircle, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

// Form schema
const waitlistFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
});

type WaitlistFormValues = z.infer<typeof waitlistFormSchema>;

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const courseId = parseInt(id);
  const { toast } = useToast();
  
  const { data: course, isLoading, error } = useQuery({
    queryKey: [`/api/courses/${courseId}`],
  });

  const form = useForm<WaitlistFormValues>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const waitlistMutation = useMutation({
    mutationFn: async (data: WaitlistFormValues) => {
      const response = await apiRequest("POST", "/api/waitlist", {
        ...data,
        courseId,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You've been added to the waitlist for this course. We'll notify you when it's available!",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to join the waitlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: WaitlistFormValues) => {
    waitlistMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/2 mb-8" />
              <Skeleton className="h-72 w-full mb-6" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-3/4" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-96 w-full rounded-lg" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Card>
            <CardHeader>
              <CardTitle>Course Not Found</CardTitle>
              <CardDescription>
                The course you are looking for does not exist or an error occurred.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Return to Home
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="pl-0 text-slate-600 hover:text-slate-900">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {course.category && (
                <Badge variant="secondary" className="bg-slate-200 text-slate-800">
                  {course.category.name}
                </Badge>
              )}
              <Badge variant="secondary" className="bg-slate-200 text-slate-800">
                <BarChart2 className="mr-1 h-3 w-3" />
                {course.difficulty}
              </Badge>
              <Badge variant="secondary" className="bg-slate-200 text-slate-800">
                <Clock className="mr-1 h-3 w-3" />
                {course.duration}
              </Badge>
              {course.isPopular && (
                <Badge variant="secondary" className="bg-orange-500 text-white">
                  Popular
                </Badge>
              )}
              {course.isNew && (
                <Badge variant="secondary" className="bg-indigo-600 text-white">
                  New
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">
              {course.title}
            </h1>
            
            <div className="flex items-center mb-6">
              {course.instructor && (
                <div className="flex items-center mr-4">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
                    <AvatarFallback>{course.instructor.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-slate-700">Instructor: <span className="font-medium">{course.instructor.name}</span></span>
                </div>
              )}
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                <span className="text-sm font-medium text-slate-700">{course.rating.toFixed(1)} rating</span>
              </div>
            </div>
            
            <div className="mb-8">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-auto rounded-lg shadow-md object-cover aspect-video"
              />
            </div>
            
            <Tabs defaultValue="description" className="mb-12">
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-6">
                <div className="space-y-4">
                  <p className="text-slate-600">{course.description}</p>
                  <h3 className="text-lg font-medium mt-6">What you'll learn</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <li key={item} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                        <span className="text-slate-600">Learning outcome {item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="curriculum" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Course Content</h3>
                  <p className="text-slate-600">This course includes 10 modules with over 40 hours of content.</p>
                  <div className="space-y-3 mt-4">
                    {[1, 2, 3, 4].map((module) => (
                      <Card key={module}>
                        <CardHeader className="p-4">
                          <CardTitle className="text-base">Module {module}: Introduction to the basics</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <ul className="space-y-2">
                            {[1, 2, 3].map((lesson) => (
                              <li key={lesson} className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <span className="text-sm text-slate-600">Lesson {lesson}: Getting started</span>
                                </div>
                                <Badge variant="outline">10 min</Badge>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="instructor" className="mt-6">
                {course.instructor && (
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Avatar className="h-16 w-16 mr-4">
                        <AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
                        <AvatarFallback>{course.instructor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-medium">{course.instructor.name}</h3>
                        <p className="text-slate-600">Expert Instructor</p>
                      </div>
                    </div>
                    <p className="text-slate-600 mt-4">{course.instructor.bio}</p>
                    <div className="flex items-center mt-4">
                      <Calendar className="h-4 w-4 text-slate-400 mr-2" />
                      <span className="text-sm text-slate-600">Teaching since 2018</span>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">${course.price}</CardTitle>
                <CardDescription>Join the waitlist for this course</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-slate-600">
                    This course is coming soon. Join the waitlist to be notified when enrollment opens.
                  </p>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={waitlistMutation.isPending}
                      >
                        {waitlistMutation.isPending ? "Processing..." : "Join Waitlist"}
                      </Button>
                    </form>
                  </Form>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 items-center justify-center border-t px-6 py-4">
                <div className="flex items-center justify-center w-full text-center">
                  <p className="text-xs text-slate-500">
                    30-Day Money-Back Guarantee<br />
                    Full Lifetime Access
                  </p>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CourseDetail;
