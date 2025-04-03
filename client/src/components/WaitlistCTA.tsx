import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

const waitlistEmailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type WaitlistEmailFormValues = z.infer<typeof waitlistEmailSchema>;

const WaitlistCTA = () => {
  const { toast } = useToast();
  
  const form = useForm<WaitlistEmailFormValues>({
    resolver: zodResolver(waitlistEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const waitlistMutation = useMutation({
    mutationFn: async (data: WaitlistEmailFormValues) => {
      const response = await apiRequest("POST", "/api/waitlist", {
        email: data.email,
        name: "Anonymous User", // Default name
      });
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

  const onSubmit = (data: WaitlistEmailFormValues) => {
    waitlistMutation.mutate(data);
  };

  return (
    <div id="waitlist" className="py-16 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-3xl font-serif font-bold tracking-tight text-white sm:text-4xl">
              Ready to accelerate your career?
            </h2>
            <p className="mt-3 text-xl text-teal-100">
              Join our waitlist today for exclusive early access and special offers when we launch.
            </p>
          </div>
          <div className="mt-8 lg:mt-0 lg:ml-8 flex-shrink-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="sm:flex">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="min-w-0 flex-1">
                      <FormControl>
                        <Input 
                          {...field} 
                          type="email" 
                          placeholder="Enter your email" 
                          className="block w-full rounded-md border-0 py-3 px-4 text-base text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </FormControl>
                      <FormMessage className="text-white" />
                    </FormItem>
                  )}
                />
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Button 
                    type="submit" 
                    className="block w-full rounded-md bg-orange-500 hover:bg-orange-600 py-3 px-4 font-medium text-white shadow"
                    disabled={waitlistMutation.isPending}
                  >
                    {waitlistMutation.isPending ? "Submitting..." : "Join Waitlist"}
                  </Button>
                </div>
              </form>
            </Form>
            <p className="mt-3 text-sm text-teal-100">
              We care about your data. Read our <a href="#" className="font-medium text-white underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitlistCTA;
