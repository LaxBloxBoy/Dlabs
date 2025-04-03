import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { ProtectedRoute } from "@/lib/protected-route";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, Shield, CheckCircle, RefreshCw, Star, Zap, 
  Package, Plus, X, CreditCardIcon, Loader2, CpuIcon, CheckCircle2
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const subscriptionPlans = [
  {
    id: "free",
    name: "Free Plan",
    price: 0,
    interval: "forever",
    description: "Basic access to courses and learning materials",
    features: [
      "Access to free courses",
      "Limited course previews",
      "Community forum access",
      "Email support"
    ],
    limitations: [
      "No premium courses",
      "No certificate of completion",
      "No personal learning path",
      "No priority support"
    ],
    action: "Current Plan",
    badge: "",
    recommended: false
  },
  {
    id: "standard",
    name: "Standard",
    price: 19.99,
    interval: "month",
    description: "Enhanced access with premium courses and features",
    features: [
      "All free plan features",
      "Access to premium courses",
      "Course completion certificates",
      "Learning path customization",
      "Priority email support"
    ],
    limitations: [
      "Limited course downloads",
      "No unlimited access"
    ],
    action: "Upgrade",
    badge: "",
    recommended: false
  },
  {
    id: "premium",
    name: "Premium",
    price: 49.99,
    interval: "month",
    description: "Full unlimited access to all courses and premium features",
    features: [
      "All standard plan features",
      "Unlimited access to all courses",
      "Offline course access",
      "Live webinars and workshops",
      "Personal coaching sessions",
      "24/7 priority support"
    ],
    limitations: [],
    action: "Upgrade",
    badge: "Best Value",
    recommended: true
  }
];

function BillingContent() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  // Get current billing info - in a real app this would be a separate API call
  const currentPlan = user?.subscriptionTier || "free";
  const hasUnlimitedAccess = user?.hasUnlimitedAccess || false;

  // Subscription upgrade/downgrade mutation
  const updateSubscriptionMutation = useMutation({
    mutationFn: async ({ subscriptionTier, hasUnlimitedAccess }: { subscriptionTier: string, hasUnlimitedAccess: boolean }) => {
      const res = await apiRequest("PATCH", "/api/user/subscription", { 
        subscriptionTier,
        hasUnlimitedAccess
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Subscription updated!",
        description: `Your subscription has been successfully updated to the ${selectedPlan?.name} plan.`,
      });
      setPaymentModalOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating subscription",
        description: error.message || "Failed to update subscription. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleUpgrade = (plan: any) => {
    setSelectedPlan(plan);
    // In a real app, this would open a payment form
    setPaymentModalOpen(true);
  };

  const handleConfirmUpgrade = () => {
    if (selectedPlan) {
      updateSubscriptionMutation.mutate({
        subscriptionTier: selectedPlan.id,
        hasUnlimitedAccess: selectedPlan.id === "premium"
      });
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Billing & Subscription</h1>
        <p className="text-muted-foreground">Manage your subscription and payment details</p>
      </div>

      {/* Current subscription */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Current Subscription</CardTitle>
          <CardDescription>
            Your current plan and subscription details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            {currentPlan === "premium" ? (
              <div className="h-14 w-14 rounded-full bg-yellow-100 flex items-center justify-center">
                <Star className="h-7 w-7 text-yellow-600" />
              </div>
            ) : currentPlan === "standard" ? (
              <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center">
                <Shield className="h-7 w-7 text-blue-600" />
              </div>
            ) : (
              <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center">
                <Package className="h-7 w-7 text-slate-600" />
              </div>
            )}

            <div>
              <h3 className="font-bold text-lg mb-1">
                {currentPlan === "premium" ? "Premium Plan" : 
                 currentPlan === "standard" ? "Standard Plan" : "Free Plan"}
                {hasUnlimitedAccess && (
                  <Badge className="ml-2 bg-gradient-to-r from-yellow-500 to-amber-500">Unlimited Access</Badge>
                )}
              </h3>
              <p className="text-muted-foreground">
                {currentPlan === "premium" ? 
                  "You have unlimited access to all courses and premium features" : 
                 currentPlan === "standard" ? 
                  "You have access to premium courses and features" : 
                  "Basic access to courses and learning materials"}
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Next billing date</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {currentPlan === "free" ? "N/A" : "May 03, 2025"}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Current period</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {currentPlan === "free" ? "N/A" : "Apr 03 - May 03"}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {currentPlan === "premium" ? "$49.99" : 
                   currentPlan === "standard" ? "$19.99" : 
                   "$0.00"}/mo
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Payment method</CardTitle>
              </CardHeader>
              <CardContent>
                {currentPlan !== "free" ? (
                  <div className="flex items-center">
                    <CreditCardIcon className="h-5 w-5 mr-2 text-slate-400" />
                    <span className="font-bold">•••• 4242</span>
                  </div>
                ) : (
                  <div className="text-muted-foreground">None</div>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          {currentPlan !== "free" && (
            <div className="flex gap-4">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Change Payment Method
              </Button>
              <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                Cancel Subscription
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>

      {/* Subscription Plans */}
      <h2 className="text-2xl font-bold mb-6">Available Plans</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {subscriptionPlans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative overflow-hidden ${plan.recommended ? 'border-primary shadow-md' : ''}`}
          >
            {plan.badge && (
              <div className="absolute top-0 right-0">
                <Badge className="rounded-bl-md rounded-tr-md rounded-br-none rounded-tl-none bg-primary">
                  {plan.badge}
                </Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/{plan.interval}</span>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2 mb-6">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
                {plan.limitations.map((limitation, i) => (
                  <div key={i} className="flex items-start text-muted-foreground">
                    <X className="h-5 w-5 text-slate-300 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{limitation}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                className={`w-full ${currentPlan === plan.id ? 'bg-green-500 hover:bg-green-600' : plan.recommended ? 'bg-primary' : ''}`}
                onClick={() => currentPlan !== plan.id && handleUpgrade(plan)}
                disabled={currentPlan === plan.id}
              >
                {currentPlan === plan.id ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Current Plan
                  </>
                ) : plan.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment confirmation modal */}
      <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Subscription Change</DialogTitle>
            <DialogDescription>
              You are upgrading to the {selectedPlan?.name} plan.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <CpuIcon className="h-4 w-4" />
              <AlertTitle>Simulation Mode</AlertTitle>
              <AlertDescription>
                This is a demo environment. In a real application, you would be redirected to a secure payment page. No actual charges will be made.
              </AlertDescription>
            </Alert>
            
            <div className="bg-slate-50 p-4 rounded-md">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-medium">{selectedPlan?.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Price</span>
                <span className="font-medium">${selectedPlan?.price}/{selectedPlan?.interval}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total today</span>
                <span className="font-bold">${selectedPlan?.price}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmUpgrade}
              disabled={updateSubscriptionMutation.isPending}
            >
              {updateSubscriptionMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                "Confirm Upgrade"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const BillingPage = () => {
  return (
    <ProtectedRoute path="/profile/billing">
      <DashboardLayout>
        <BillingContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default BillingPage;