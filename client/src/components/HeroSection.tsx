import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const waitlistFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  interest: z.string().optional(),
});

type WaitlistFormValues = z.infer<typeof waitlistFormSchema>;

const HeroSection = () => {
  const { toast } = useToast();
  
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

  return (
    <div className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-serif font-bold tracking-tight sm:text-5xl">
              Accelerate your learning journey
            </h1>
            <p className="mt-4 text-xl text-slate-300">
              Join our waitlist for early access to the most comprehensive learning platform designed for modern professionals.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                variant="default" 
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-8"
                onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
              >
                Join Waitlist
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white bg-transparent hover:bg-white/10 px-8"
                onClick={() => document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" })}
              >
                Browse Courses
              </Button>
            </div>
            <div className="mt-6 flex items-center">
              <div className="flex -space-x-1 overflow-hidden">
                <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-slate-300"></div>
                <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-slate-400"></div>
                <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-slate-500"></div>
              </div>
              <span className="ml-3 text-sm text-slate-300">Joined by <span className="font-medium text-white">1,200+ learners</span></span>
            </div>
          </div>
          <div className="rounded-lg bg-slate-800 p-6 shadow-xl border border-slate-700">
            <h3 className="text-lg font-medium">Get Early Access</h3>
            <p className="mt-1 text-sm text-slate-400">Sign up for updates and secure your spot.</p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="John Doe" 
                          className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-white placeholder:text-slate-400 focus:border-indigo-500"
                        />
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
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="email" 
                          placeholder="john@example.com" 
                          className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-white placeholder:text-slate-400 focus:border-indigo-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="interest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Interest</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full mt-1 rounded-md border-slate-600 bg-slate-700 text-white focus:border-indigo-500">
                            <SelectValue placeholder="Select your interest" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Web Development">Web Development</SelectItem>
                          <SelectItem value="Data Science">Data Science</SelectItem>
                          <SelectItem value="Design">Design</SelectItem>
                          <SelectItem value="Business">Business</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                    disabled={waitlistMutation.isPending}
                  >
                    {waitlistMutation.isPending ? "Submitting..." : "Join Waitlist"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
