import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import CourseSection from "@/components/CourseSection";
import CategoriesSection from "@/components/CategoriesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import WaitlistCTA from "@/components/WaitlistCTA";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FaGoogle, FaAmazon, FaMicrosoft, FaApple, FaSlack } from "react-icons/fa";
import { SiTesla, SiSamsung, SiOracle, SiLinkedin, SiIntel } from "react-icons/si";
import { 
  ArrowDown, 
  Sparkles, 
  Award, 
  BarChart, 
  BookOpen,
  GraduationCap,
  Layers,
  MessagesSquare,
  Check,
  Code,
  Database,
  PenTool,
  BriefcaseBusiness,
  Smartphone,
  Globe,
  Gamepad2,
  BarChart2,
  FileBadge
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

// Define types for our data
interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  difficulty: string;
  duration: string;
  isNew?: boolean;
  isPopular?: boolean;
  rating: number;
  instructor?: {
    id: number;
    name: string;
    avatar: string;
  };
}

interface Category {
  id: number;
  name: string;
  icon: string;
  courseCount: number;
}

// Define form schema
const waitlistFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  interest: z.string().optional(),
});

type WaitlistFormValues = z.infer<typeof waitlistFormSchema>;

const Home = () => {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const statsRef = useRef<HTMLDivElement>(null);
  
  // Get courses for the "Most Popular" section
  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  // Get categories for the "Explore Categories" section
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Setup form for waitlist
  const form = useForm<WaitlistFormValues>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: {
      name: "",
      email: "",
      interest: "Web Development",
    },
  });

  const waitlistMutation = useMutation({
    mutationFn: async (data: WaitlistFormValues) => {
      const response = await apiRequest("POST", "/api/waitlist", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You've been added to our waitlist. We'll notify you when we launch!",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to join waitlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: WaitlistFormValues) => {
    waitlistMutation.mutate(data);
  };

  // Animation trigger for smooth scroll
  const scrollToStats = () => {
    statsRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  // Function to render proper icons based on category name/icon
  const renderCategoryIcon = (iconName: string) => {
    switch(iconName.toLowerCase()) {
      case 'code':
        return <Code className="h-6 w-6 text-emerald-600" />;
      case 'database':
        return <Database className="h-6 w-6 text-emerald-600" />;
      case 'pen-tool':
      case 'design':
        return <PenTool className="h-6 w-6 text-emerald-600" />;
      case 'briefcase':
      case 'business':
        return <BriefcaseBusiness className="h-6 w-6 text-emerald-600" />;
      case 'smartphone':
      case 'mobile':
        return <Smartphone className="h-6 w-6 text-emerald-600" />;
      case 'globe':
      case 'web':
        return <Globe className="h-6 w-6 text-emerald-600" />;
      case 'gamepad':
      case 'game':
        return <Gamepad2 className="h-6 w-6 text-emerald-600" />;
      case 'chart':
      case 'data':
        return <BarChart2 className="h-6 w-6 text-emerald-600" />;
      case 'certificate':
      case 'badge':
        return <FileBadge className="h-6 w-6 text-emerald-600" />;
      default:
        return <BookOpen className="h-6 w-6 text-emerald-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />

      {/* Hero Section - Enhanced with animated elements and gradient */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-900 text-white">
        {/* Abstract background shapes */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-emerald-500 blur-3xl"></div>
          <div className="absolute top-40 -left-40 w-80 h-80 rounded-full bg-teal-500 blur-3xl"></div>
          <div className="absolute bottom-40 right-20 w-80 h-80 rounded-full bg-green-500 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-4 bg-emerald-600 hover:bg-emerald-700 text-white border-0 py-1 px-3 text-sm">
                <Sparkles className="h-3.5 w-3.5 mr-1" /> New ISO Certification Courses Available
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-emerald-200">
                Elevate Your Career with D-Code Labs
              </h1>
              <p className="text-xl text-slate-100 mb-8 max-w-xl">
                Our cutting-edge platform combines expert-led instruction, interactive learning experiences, and industry-recognized certifications to accelerate your professional growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 rounded-full font-medium"
                  onClick={() => document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Explore Courses
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10 px-8 rounded-full"
                  onClick={scrollToStats}
                >
                  Learn More
                </Button>
              </div>
              <div className="flex items-center">
                <div className="flex -space-x-2 overflow-hidden mr-3">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-emerald-900" 
                      style={{
                        backgroundColor: `hsl(${160 + i * 10}, 70%, ${50 + i * 5}%)`,
                        zIndex: 5 - i
                      }}
                    />
                  ))}
                </div>
                <div>
                  <p className="text-emerald-200 text-sm font-medium">
                    Trusted by <span className="font-bold text-white">10,000+</span> professionals
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative hidden lg:block"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-30"></div>
                <div className="relative bg-slate-800 rounded-xl shadow-2xl border border-slate-700/50 overflow-hidden">
                  <div className="px-6 py-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                        <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                      </div>
                      <div className="text-sm text-slate-400">
                        D-Code Labs
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div className="rounded-lg bg-slate-700/50 p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-white" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-medium text-white">ISO 9001 Certification</h3>
                            <p className="text-xs text-emerald-200">Quality Management Systems</p>
                          </div>
                        </div>
                        <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 w-[75%]"></div>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-slate-400">Progress: 75%</span>
                          <Badge className="bg-emerald-500 text-xs">In Progress</Badge>
                        </div>
                      </div>

                      <div className="rounded-lg bg-slate-700/50 p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                            <Layers className="h-5 w-5 text-white" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-medium text-white">Full-Stack Development</h3>
                            <p className="text-xs text-green-200">Web Application Architecture</p>
                          </div>
                        </div>
                        <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 w-[92%]"></div>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-slate-400">Progress: 92%</span>
                          <Badge className="bg-green-500 text-xs">Nearly Complete</Badge>
                        </div>
                      </div>

                      <div className="rounded-lg bg-slate-700/50 p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                            <BarChart className="h-5 w-5 text-white" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-medium text-white">Data Analytics</h3>
                            <p className="text-xs text-teal-200">Business Intelligence</p>
                          </div>
                        </div>
                        <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 w-[45%]"></div>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-slate-400">Progress: 45%</span>
                          <Badge className="bg-teal-500 text-xs">In Progress</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <GraduationCap className="h-12 w-12 text-white" />
              </div>
            </motion.div>
          </div>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ArrowDown className="h-6 w-6 text-white/60" onClick={scrollToStats} />
          </div>
        </div>
      </section>

      {/* Trusted by Companies */}
      <section className="py-10 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-center text-sm font-semibold text-slate-500 mb-8 uppercase tracking-wide">
            Trusted by leading companies worldwide
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-9 gap-8 items-center justify-items-center">
            <FaGoogle className="h-8 w-8 text-slate-400 hover:text-emerald-600 transition-colors" />
            <FaAmazon className="h-8 w-8 text-slate-400 hover:text-emerald-600 transition-colors" />
            <FaMicrosoft className="h-8 w-8 text-slate-400 hover:text-emerald-600 transition-colors" />
            <FaApple className="h-8 w-8 text-slate-400 hover:text-emerald-600 transition-colors" />
            <SiTesla className="h-8 w-8 text-slate-400 hover:text-emerald-600 transition-colors" />
            <SiSamsung className="h-8 w-8 text-slate-400 hover:text-emerald-600 transition-colors" />
            <SiOracle className="h-8 w-8 text-slate-400 hover:text-emerald-600 transition-colors" />
            <SiLinkedin className="h-8 w-8 text-slate-400 hover:text-emerald-600 transition-colors" />
            <SiIntel className="h-8 w-8 text-slate-400 hover:text-emerald-600 transition-colors" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-semibold text-emerald-600 tracking-widest uppercase">
              Why D-Code Labs Stands Out
            </h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
              The Future of Professional Education
            </p>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500">
              Our platform combines cutting-edge technology with expert instruction to deliver an unmatched learning experience.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 shadow-md bg-white hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="rounded-full bg-emerald-100 p-3 w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                  <GraduationCap className="h-7 w-7 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">50+</h3>
                <p className="text-slate-500 mt-2">Expert Instructors</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-white hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="rounded-full bg-teal-100 p-3 w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                  <BookOpen className="h-7 w-7 text-teal-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">200+</h3>
                <p className="text-slate-500 mt-2">Specialized Courses</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-white hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="rounded-full bg-green-100 p-3 w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                  <Award className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">15+</h3>
                <p className="text-slate-500 mt-2">Industry Certifications</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-white hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="rounded-full bg-amber-100 p-3 w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                  <MessagesSquare className="h-7 w-7 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">24/7</h3>
                <p className="text-slate-500 mt-2">Learning Support</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-20">
            <div className="grid gap-12 lg:grid-cols-3">
              <div className="col-span-1">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">What Sets Us Apart</h3>
                <p className="text-slate-600 mb-6">
                  Our platform is designed to provide an immersive and effective learning experience that prepares you for real-world challenges.
                </p>
                <ul className="space-y-4">
                  {[
                    "Industry-recognized certifications",
                    "Hands-on practical projects",
                    "Personalized learning paths",
                    "Experienced industry instructors",
                    "Interactive learning environment",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <div className="rounded-full bg-green-100 p-1 mr-3 mt-0.5">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Button 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    Explore Categories
                  </Button>
                </div>
              </div>

              <div className="col-span-2 relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-20"></div>
                <div className="relative bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden p-8">
                  <div className="grid gap-8 md:grid-cols-2">
                    {[
                      {
                        icon: <BookOpen className="h-7 w-7 text-emerald-600" />,
                        title: "Comprehensive Curriculum",
                        description: "Structured learning paths designed by industry experts to ensure you master every concept."
                      },
                      {
                        icon: <Layers className="h-7 w-7 text-teal-600" />,
                        title: "Modular Learning",
                        description: "Break down complex topics into manageable modules for more effective learning."
                      },
                      {
                        icon: <BarChart className="h-7 w-7 text-green-600" />,
                        title: "Progress Tracking",
                        description: "Advanced analytics to monitor your progress and identify areas for improvement."
                      },
                      {
                        icon: <Award className="h-7 w-7 text-amber-600" />,
                        title: "Industry Certification",
                        description: "Earn credentials that are recognized and valued by employers worldwide."
                      },
                    ].map((feature, i) => (
                      <div key={i} className="relative">
                        <div className="rounded-xl bg-slate-50 p-6 h-full">
                          <div className="rounded-full bg-white p-3 w-14 h-14 shadow-sm mb-4 flex items-center justify-center">
                            {feature.icon}
                          </div>
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                          <p className="text-slate-600">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses - Top Slider */}
      <section className="py-16 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-sm font-semibold text-emerald-600 tracking-widest uppercase">
                Featured This Month
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Top-Rated Courses
              </p>
            </div>
            <Button 
              variant="outline" 
              className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
              onClick={() => setLocation("/courses")}
            >
              View All Courses
            </Button>
          </div>

          {/* Featured courses carousel */}
          <div className="overflow-hidden relative pb-8">
            <div className="flex space-x-6 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              {(courses as Course[]).slice(0, 6).map((course) => (
                <div key={course.id} className="min-w-[300px] max-w-[300px] flex-shrink-0">
                  <div className="relative rounded-xl overflow-hidden group">
                    <div className="aspect-video bg-slate-100 relative overflow-hidden">
                      <img 
                        src={course.image} 
                        alt={course.title} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {course.isNew && (
                        <Badge className="absolute top-2 right-2 bg-amber-500 text-white border-0">
                          New
                        </Badge>
                      )}
                      {course.isPopular && (
                        <Badge className="absolute top-2 right-2 bg-emerald-600 text-white border-0">
                          Popular
                        </Badge>
                      )}
                    </div>
                    <div className="p-4 bg-white border border-slate-100 rounded-b-xl shadow-sm">
                      <div className="flex items-center text-sm text-slate-500 mb-2">
                        <BookOpen className="h-4 w-4 mr-1 text-emerald-500" />
                        <span>{course.difficulty}</span>
                        <span className="mx-2">•</span>
                        <span>{course.duration}</span>
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-1 line-clamp-1">
                        {course.title}
                      </h3>
                      <div className="flex items-center mb-3">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < Math.floor(course.rating) ? "text-amber-400" : "text-slate-300"}>★</span>
                          ))}
                        </div>
                        <span className="text-sm text-slate-600 ml-1">{course.rating}</span>
                      </div>
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => setLocation(`/courses/${course.id}`)}
                      >
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute left-0 bottom-0 w-full flex justify-center space-x-2 pb-2">
              {[...Array(3)].map((_, i) => (
                <button 
                  key={i}
                  className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-emerald-600' : 'bg-slate-300'}`}
                >
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Content Sections */}
      <div id="courses">
        <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-sm font-semibold text-emerald-600 tracking-widest uppercase">
                Our Curriculum
              </h2>
              <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
                Discover Our Popular Courses
              </p>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500">
                From beginner-friendly introductions to specialized certification programs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(courses as Course[]).slice(0, 6).map((course) => (
                <motion.div 
                  key={course.id}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="group"
                >
                  <div className="bg-white rounded-xl shadow-md overflow-hidden h-full border border-slate-100 transition-all duration-300 hover:shadow-xl flex flex-col">
                    <div className="relative">
                      <img 
                        src={course.image} 
                        alt={course.title} 
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <div className="flex items-center text-sm mb-1">
                          <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                            {course.difficulty}
                          </Badge>
                          <span className="mx-2">•</span>
                          <span>{course.duration}</span>
                        </div>
                        <h3 className="font-semibold text-lg">{course.title}</h3>
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <p className="text-slate-600 text-sm line-clamp-2 mb-4 flex-1">
                        {course.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white mr-2">
                            <img 
                              src={course.instructor?.avatar || "https://via.placeholder.com/40"}
                              alt={course.instructor?.name || "Instructor"}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-sm text-slate-700">{course.instructor?.name || "Instructor"}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="flex text-amber-400 mr-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < Math.floor(course.rating) ? "text-amber-400" : "text-slate-300"}>★</span>
                            ))}
                          </div>
                          <span className="text-sm text-slate-600">{course.rating}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                        <div className="text-2xl font-bold text-slate-900">
                          {course.price === 0 ? (
                            <span className="text-green-600">Free</span>
                          ) : (
                            <span>${course.price}</span>
                          )}
                        </div>
                        <Button 
                          onClick={() => setLocation(`/courses/${course.id}`)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                          View Course
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                onClick={() => setLocation("/courses")}
              >
                View All Courses
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Categories Grid */}
      <div id="categories">
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-sm font-semibold text-emerald-600 tracking-widest uppercase">
                Diverse Curriculum
              </h2>
              <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
                Explore Learning Categories
              </p>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500">
                Discover specialized courses in various domains to advance your career
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {(categories as Category[]).map((category) => (
                <motion.div 
                  key={category.id}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100 transition-all duration-300 hover:shadow-xl hover:border-emerald-100 group">
                    <div className="p-8 text-center">
                      <div className="w-16 h-16 rounded-2xl mx-auto bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 mb-4">
                        {renderCategoryIcon(category.icon)}
                      </div>
                      <h3 className="font-semibold text-lg text-slate-900 mb-2">{category.name}</h3>
                      <p className="text-slate-500 text-sm mb-4">{category.courseCount} courses</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                        onClick={() => setLocation(`/courses?category=${category.id}`)}
                      >
                        Browse Courses
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Testimonials - Revamped */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-sm font-semibold text-emerald-600 tracking-widest uppercase">
              Success Stories
            </h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
              Hear From Our Students
            </p>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500">
              Real-world results from professionals who've transformed their careers with D-Code Labs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* We'll render testimonials here. If there's an issue with data, we'll use placeholders */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100 p-8 relative">
                <div className="text-emerald-500 mb-4">
                  <svg width="45" height="36" className="fill-current opacity-20" viewBox="0 0 45 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.4 36C8.86667 36 5.2 34.4 2.4 31.2C0.8 28.8 0 25.8667 0 22.4C0 18.4 1.06667 14.6667 3.2 11.2C5.33333 7.73333 8.4 4.53333 12.4 1.6L20 8.8C18 10.1333 16.2667 11.8667 14.8 14C13.3333 16.1333 12.6 18 12.6 19.6C12.6 19.8667 12.7333 20.1333 13 20.4C13.2667 20.6667 13.6 20.8 14 20.8C14.5333 20.8 15.3333 20.4 16.4 19.6C17.4667 18.8 18.2 18.4 18.6 18.4C20.2 18.4 21.5333 19 22.6 20.2C23.6667 21.4 24.2 22.8 24.2 24.4C24.2 27.2 23.1333 29.6 21 31.6C18.8667 34.5333 16.3333 36 13.4 36ZM34.6 36C30.0667 36 26.4 34.4 23.6 31.2C22 28.8 21.2 25.8667 21.2 22.4C21.2 18.4 22.2667 14.6667 24.4 11.2C26.5333 7.73333 29.6 4.53333 33.6 1.6L41.2 8.8C39.2 10.1333 37.4667 11.8667 36 14C34.5333 16.1333 33.8 18 33.8 19.6C33.8 19.8667 33.9333 20.1333 34.2 20.4C34.4667 20.6667 34.8 20.8 35.2 20.8C35.7333 20.8 36.5333 20.4 37.6 19.6C38.6667 18.8 39.4 18.4 39.8 18.4C41.4 18.4 42.7333 19 43.8 20.2C44.8667 21.4 45.4 22.8 45.4 24.4C45.4 27.2 44.3333 29.6 42.2 31.6C40.0667 34.5333 37.5333 36 34.6 36Z" />
                  </svg>
                </div>
                <p className="text-slate-700 mb-6 relative z-10">
                  {i === 0 ? 
                    "The ISO certification courses gave me the expertise I needed to implement quality management systems in my organization. The step-by-step approach made complex concepts easy to understand." :
                    i === 1 ?
                    "D-Code Labs helped me transition from a junior developer to a full-stack engineer in just 6 months. The practical projects and mentor feedback were invaluable to my growth." :
                    "As a business owner, the specialized courses on process improvement have transformed our operations. The ROI on this investment has been tremendous."
                  }
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src={`https://randomuser.me/api/portraits/${i === 0 ? 'women' : i === 1 ? 'men' : 'women'}/${i + 1}.jpg`}
                      alt="Student" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">
                      {i === 0 ? "Sarah Johnson" : i === 1 ? "David Chen" : "Emily Rodriguez"}
                    </h4>
                    <p className="text-sm text-slate-500">
                      {i === 0 ? "Quality Manager, TechCorp" : i === 1 ? "Full-Stack Developer, StartupX" : "CEO, Innovate Solutions"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-semibold text-emerald-600 tracking-widest uppercase">
              Membership Plans
            </h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
              Choose the Right Plan for You
            </p>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500">
              Unlock your full potential with our flexible membership options.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Basic",
                price: "Free",
                description: "Perfect for exploring our platform",
                features: [
                  "Access to free courses",
                  "Basic community support",
                  "Course recommendations",
                  "Mobile access",
                ],
                buttonText: "Get Started",
                highlighted: false,
                buttonVariant: "outline"
              },
              {
                name: "Pro",
                price: "$29/mo",
                description: "Most popular for professionals",
                features: [
                  "Everything in Basic",
                  "Access to all courses",
                  "Priority support",
                  "Course completion certificates",
                  "Downloadable resources",
                  "No ads"
                ],
                buttonText: "Upgrade to Pro",
                highlighted: true,
                buttonVariant: "default"
              },
              {
                name: "Enterprise",
                price: "$99/mo",
                description: "For teams and organizations",
                features: [
                  "Everything in Pro",
                  "ISO certification courses",
                  "Team management dashboard",
                  "Dedicated account manager",
                  "Custom learning paths",
                  "Advanced analytics"
                ],
                buttonText: "Contact Sales",
                highlighted: false,
                buttonVariant: "outline"
              }
            ].map((tier, i) => (
              <div key={i} className={`rounded-xl ${tier.highlighted ? 'ring-2 ring-emerald-600 shadow-xl' : 'border border-slate-200 shadow-md'} bg-white overflow-hidden transition-all duration-300 hover:shadow-xl`}>
                <div className={`p-8 ${tier.highlighted ? 'bg-emerald-600' : 'bg-white'}`}>
                  <h3 className={`text-xl font-semibold ${tier.highlighted ? 'text-white' : 'text-slate-900'}`}>{tier.name}</h3>
                  <p className={`mt-4 text-3xl font-bold ${tier.highlighted ? 'text-white' : 'text-slate-900'}`}>{tier.price}</p>
                  <p className={`mt-2 text-sm ${tier.highlighted ? 'text-emerald-100' : 'text-slate-500'}`}>{tier.description}</p>
                </div>
                <div className="p-8">
                  <ul className="space-y-4">
                    {tier.features.map((feature, j) => (
                      <li key={j} className="flex items-start">
                        <div className={`rounded-full ${tier.highlighted ? 'bg-emerald-100' : 'bg-slate-100'} p-1 mr-3 mt-0.5`}>
                          <Check className={`h-4 w-4 ${tier.highlighted ? 'text-emerald-600' : 'text-slate-700'}`} />
                        </div>
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Button 
                      className={`w-full ${tier.highlighted ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}
                      variant={tier.buttonVariant as any}
                      onClick={() => tier.name === "Basic" ? setLocation("/auth") : document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
                    >
                      {tier.buttonText}
                    </Button>
                  </div>
                </div>
                {tier.highlighted && (
                  <div className="bg-emerald-600 py-2 text-center text-sm text-white">
                    Most Popular Choice
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-emerald-400 blur-3xl"></div>
          <div className="absolute bottom-40 right-20 w-80 h-80 rounded-full bg-teal-300 blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Career?</h2>
            <p className="text-lg md:text-xl text-emerald-100 mb-8">
              Join thousands of professionals who are advancing their careers with D-Code Labs certification courses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-emerald-700 hover:bg-emerald-50 px-8 rounded-full"
                onClick={() => setLocation("/auth")}
              >
                Get Started Today
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-emerald-500 px-8 rounded-full"
                onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
              >
                Join Our Waitlist
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Learn More Resources */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-semibold text-emerald-600 tracking-widest uppercase">
              Resources
            </h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
              Expand Your Knowledge
            </p>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500">
              Explore our comprehensive resources to enhance your learning journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Learning Guides",
                description: "Step-by-step tutorials and guides to help you master new skills efficiently.",
                icon: <BookOpen className="h-6 w-6 text-emerald-600" />,
                link: "#"
              },
              {
                title: "Industry Insights",
                description: "Stay updated with the latest trends and developments in your field.",
                icon: <BarChart className="h-6 w-6 text-green-600" />,
                link: "#"
              },
              {
                title: "Certification Paths",
                description: "Structured learning paths to achieve recognized industry certifications.",
                icon: <Award className="h-6 w-6 text-amber-600" />,
                link: "#"
              }
            ].map((resource, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group">
                <div className="p-6">
                  <div className="rounded-full bg-slate-100 p-3 w-14 h-14 group-hover:bg-emerald-50 transition-colors duration-300 mb-4 flex items-center justify-center">
                    {resource.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors duration-300">{resource.title}</h3>
                  <p className="text-slate-600 mb-4">{resource.description}</p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-emerald-600 hover:text-emerald-800 font-medium"
                    onClick={() => toast({ 
                      title: "Coming Soon", 
                      description: "This feature will be available in the next update!" 
                    })}
                  >
                    Learn More →
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-semibold text-emerald-600 tracking-widest uppercase">
              FAQ
            </h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
              Frequently Asked Questions
            </p>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500">
              Find answers to common questions about our platform and courses
            </p>
          </div>

          <div className="max-w-3xl mx-auto divide-y divide-slate-200">
            {[
              {
                question: "How do I enroll in a course?",
                answer: "You can browse our course catalog and click on any course to view its details. From there, you can click the 'Enroll' button to join the course. Some courses require a subscription plan."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, PayPal, and bank transfers for our subscription plans and individual course purchases."
              },
              {
                question: "Are the certifications recognized by employers?",
                answer: "Yes, our certifications are industry-recognized and valued by employers worldwide. Our ISO certification courses are especially valued for those in quality management roles."
              },
              {
                question: "Can I access the courses on mobile devices?",
                answer: "Absolutely! Our platform is fully responsive and optimized for learning on any device, including smartphones and tablets."
              },
              {
                question: "What is your refund policy?",
                answer: "We offer a 30-day money-back guarantee for all subscription plans. If you're not satisfied with your learning experience, you can request a full refund within 30 days of purchase."
              }
            ].map((faq, i) => (
              <div key={i} className="py-6">
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer text-lg font-medium text-slate-900">
                    <span>{faq.question}</span>
                    <span className="transition-transform duration-300 group-open:rotate-180">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-emerald-600">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </span>
                  </summary>
                  <div className="mt-3 text-slate-600">
                    <p>{faq.answer}</p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <div id="waitlist">
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-sm font-semibold text-emerald-600 tracking-widest uppercase">
                Stay Updated
              </h2>
              <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
                Join Our Waitlist
              </p>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500">
                Be the first to know about new courses, features, and special offers
              </p>
            </div>
            
            <div className="max-w-lg mx-auto">
              <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-100 p-8">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                    <input
                      {...form.register("name")}
                      id="name"
                      placeholder="John Doe"
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                    <input
                      {...form.register("email")}
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="interest" className="text-sm font-medium">Primary Interest</label>
                    <select
                      {...form.register("interest")}
                      id="interest"
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Web Development">Web Development</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Design">Design</option>
                      <option value="Business">Business</option>
                      <option value="Other">Other</option>
                    </select>
                    {form.formState.errors.interest && (
                      <p className="text-sm text-red-500">{form.formState.errors.interest.message}</p>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-md py-2.5"
                    disabled={waitlistMutation.isPending}
                  >
                    {waitlistMutation.isPending ? "Submitting..." : "Join Waitlist"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Contact Section */}
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Home;
