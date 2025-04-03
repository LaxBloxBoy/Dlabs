import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(2, "Subject must be at least 2 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactSection = () => {
  const { toast } = useToast();
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormValues) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. We'll get back to you soon.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    contactMutation.mutate(data);
  };

  return (
    <div id="about" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl font-serif font-bold text-slate-900">
              Get in Touch
            </h2>
            <p className="mt-3 text-lg text-slate-600">
              Have a question or need more information? We're here to help you on your learning journey.
            </p>
            <div className="mt-8 space-y-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Mail className="text-primary" />
                </div>
                <div className="ml-3 text-base text-slate-600">
                  <p>support@learnhub.com</p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0">
                  <Phone className="text-primary" />
                </div>
                <div className="ml-3 text-base text-slate-600">
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0">
                  <MapPin className="text-primary" />
                </div>
                <div className="ml-3 text-base text-slate-600">
                  <p>123 Learning Lane, Education City, CA 94103</p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <div className="flex space-x-6">
                <a href="#" className="text-slate-400 hover:text-slate-500">
                  <span className="sr-only">Facebook</span>
                  <Facebook />
                </a>
                <a href="#" className="text-slate-400 hover:text-slate-500">
                  <span className="sr-only">Instagram</span>
                  <Instagram />
                </a>
                <a href="#" className="text-slate-400 hover:text-slate-500">
                  <span className="sr-only">Twitter</span>
                  <Twitter />
                </a>
                <a href="#" className="text-slate-400 hover:text-slate-500">
                  <span className="sr-only">LinkedIn</span>
                  <Linkedin />
                </a>
              </div>
            </div>
          </div>
          <div>
            <div className="bg-slate-50 p-8 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-slate-900">Send us a message</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium text-slate-700">Full name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="py-3 px-4 block w-full shadow-sm border-slate-300 rounded-md focus:ring-primary focus:border-primary"
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
                        <FormLabel className="block text-sm font-medium text-slate-700">Email</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="email" 
                            className="py-3 px-4 block w-full shadow-sm border-slate-300 rounded-md focus:ring-primary focus:border-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium text-slate-700">Subject</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="py-3 px-4 block w-full shadow-sm border-slate-300 rounded-md focus:ring-primary focus:border-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium text-slate-700">Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            rows={4} 
                            className="py-3 px-4 block w-full shadow-sm border-slate-300 rounded-md focus:ring-primary focus:border-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div>
                    <Button 
                      type="submit" 
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
                      disabled={contactMutation.isPending}
                    >
                      {contactMutation.isPending ? "Sending..." : "Send Message"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
