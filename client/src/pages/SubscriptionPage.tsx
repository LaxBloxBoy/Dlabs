import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import { 
  Bookmark, 
  CheckCircle2, 
  Medal, 
  Crown, 
  Sparkles, 
  Check, 
  X, 
  LucideIcon,
  Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SubscriptionTier {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: {
    text: string;
    available: boolean;
  }[];
  icon: LucideIcon;
  popular?: boolean;
  buttonText: string;
  color: string;
}

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const { user, loginMutation } = useAuth();
  const { toast } = useToast();
  const [_, navigate] = useLocation();

  const subscriptionMutation = useMutation({
    mutationFn: async (tier: string) => {
      const res = await apiRequest("POST", "/api/subscriptions/upgrade", { tier });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Subscription upgraded!",
        description: "Your subscription has been successfully upgraded.",
        variant: "default",
      });
      navigate("/profile");
    },
    onError: (error: Error) => {
      toast({
        title: "Upgrade failed",
        description: error.message || "Failed to upgrade subscription. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubscribe = (tierId: string) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login or create an account to subscribe.",
        variant: "default",
      });
      navigate("/login");
      return;
    }

    subscriptionMutation.mutate(tierId);
  };

  const subscriptionTiers: SubscriptionTier[] = [
    {
      id: "free",
      name: "Free",
      description: "Basic access to get started with our platform",
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        { text: "Access to free courses only", available: true },
        { text: "Standard video quality", available: true },
        { text: "Basic support", available: true },
        { text: "No access to premium courses", available: false },
        { text: "No offline downloads", available: false },
        { text: "No certification included", available: false },
      ],
      icon: Bookmark,
      buttonText: "Current Plan",
      color: "text-slate-600"
    },
    {
      id: "standard",
      name: "Standard",
      description: "Great for casual learners and hobbyists",
      monthlyPrice: 14.99,
      yearlyPrice: 149.99,
      features: [
        { text: "All free courses", available: true },
        { text: "Access to select premium courses", available: true },
        { text: "HD video quality", available: true },
        { text: "Priority email support", available: true },
        { text: "Limited offline downloads", available: true },
        { text: "No certification included", available: false },
      ],
      icon: Medal,
      buttonText: "Get Standard",
      color: "text-emerald-600"
    },
    {
      id: "premium",
      name: "Premium",
      description: "Perfect for serious learners and professionals",
      monthlyPrice: 29.99,
      yearlyPrice: 299.99,
      features: [
        { text: "Unlimited access to all courses", available: true },
        { text: "4K video quality when available", available: true },
        { text: "Priority support via chat and email", available: true },
        { text: "Unlimited offline downloads", available: true },
        { text: "Certification included", available: true },
        { text: "Access to exclusive webinars", available: true },
      ],
      icon: Crown,
      buttonText: "Get Premium",
      color: "text-amber-600",
      popular: true
    },
    {
      id: "unlimited",
      name: "Unlimited",
      description: "Our most comprehensive learning package",
      monthlyPrice: 49.99,
      yearlyPrice: 499.99,
      features: [
        { text: "Everything in Premium", available: true },
        { text: "Early access to new courses", available: true },
        { text: "1-on-1 monthly coaching sessions", available: true },
        { text: "Direct instructor access", available: true },
        { text: "Custom learning path", available: true },
        { text: "Advanced certification", available: true },
      ],
      icon: Rocket,
      buttonText: "Get Unlimited",
      color: "text-purple-600"
    },
  ];

  const isCurrentPlan = (tierId: string) => {
    if (!user) return false;
    return user.subscriptionTier === tierId;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Choose Your Learning Journey</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Unlock your potential with our flexible subscription plans. Get unlimited access to our entire course library.
          </p>
          
          <div className="flex justify-center items-center mt-8 mb-12">
            <div className="bg-white rounded-full p-1 shadow-sm border border-slate-200 flex items-center">
              <button
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  billingCycle === "monthly"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                onClick={() => setBillingCycle("monthly")}
              >
                Monthly
              </button>
              <button
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  billingCycle === "yearly"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                onClick={() => setBillingCycle("yearly")}
              >
                <span className="flex items-center gap-2">
                  Yearly <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Save 20%</Badge>
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {subscriptionTiers.map((tier) => (
            <Card key={tier.id} className={`relative overflow-hidden border-slate-200 ${
              tier.popular ? 'ring-2 ring-emerald-500' : ''
            }`}>
              {tier.popular && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 transform translate-x-[30%] translate-y-[-0%] rotate-45">
                  <Sparkles className="h-3 w-3 inline mr-1" /> POPULAR
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-2 rounded-lg ${tier.color === 'text-emerald-600' ? 'bg-emerald-100' : 
                    tier.color === 'text-amber-600' ? 'bg-amber-100' : 
                    tier.color === 'text-purple-600' ? 'bg-purple-100' : 'bg-slate-100'}`}>
                    <tier.icon className={`h-5 w-5 ${tier.color}`} />
                  </div>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                </div>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <p className="text-3xl font-bold">
                    ${billingCycle === "monthly" ? tier.monthlyPrice : tier.yearlyPrice}
                    <span className="text-base font-normal text-slate-500">
                      {tier.monthlyPrice > 0 ? (billingCycle === "monthly" ? "/month" : "/year") : ""}
                    </span>
                  </p>
                </div>
                
                <ul className="space-y-3">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      {feature.available ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" />
                      ) : (
                        <X className="h-5 w-5 text-slate-300 mr-2 flex-shrink-0" />
                      )}
                      <span className={feature.available ? "text-slate-700" : "text-slate-400"}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  variant={tier.id === "free" ? "outline" : "default"}
                  className={`w-full ${
                    tier.id === "free" 
                      ? "border-slate-300 hover:bg-slate-50" 
                      : tier.id === "premium"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600"
                      : tier.id === "unlimited"
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                  onClick={() => handleSubscribe(tier.id)}
                  disabled={isCurrentPlan(tier.id) || subscriptionMutation.isPending}
                >
                  {isCurrentPlan(tier.id) ? (
                    <span className="flex items-center gap-2">
                      <Check className="h-4 w-4" /> Current Plan
                    </span>
                  ) : (
                    tier.buttonText
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="text-left bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-2">What happens when I upgrade?</h3>
              <p className="text-slate-600">When you upgrade, you immediately get access to all courses included in your selected plan. Your billing cycle starts today.</p>
            </div>
            <div className="text-left bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-2">Can I cancel anytime?</h3>
              <p className="text-slate-600">Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
            </div>
            <div className="text-left bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-2">What payment methods do you accept?</h3>
              <p className="text-slate-600">We accept all major credit cards, PayPal, and Apple Pay. All payments are securely processed.</p>
            </div>
            <div className="text-left bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-2">Do you offer refunds?</h3>
              <p className="text-slate-600">We offer a 14-day money-back guarantee if you're not satisfied with your subscription for any reason.</p>
            </div>
          </div>
        </div>
        
        <div className="mt-16 bg-gradient-to-r from-emerald-800 to-teal-700 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Need help choosing?</h2>
          <p className="mb-6">Contact our support team for personalized advice on the best plan for your learning goals.</p>
          <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-emerald-800">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}