import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { ProtectedRoute } from "@/lib/protected-route";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Megaphone, 
  Calendar, 
  GraduationCap, 
  Tag,
  Clock, 
  CheckCircle, 
  Info
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock notifications for demonstration
const notifications = [
  {
    id: 1,
    type: "course_update",
    title: "Course Update: Introduction to React",
    description: "New module on React Hooks has been added to your enrolled course.",
    date: "2025-04-01T10:30:00Z",
    read: false
  },
  {
    id: 2,
    type: "system",
    title: "Welcome to D-Code Labs!",
    description: "Thank you for joining our learning platform. Start exploring courses today!",
    date: "2025-03-30T15:45:00Z",
    read: true
  },
  {
    id: 3,
    type: "promotional",
    title: "Special Offer: 30% Off React Courses",
    description: "For a limited time, enjoy 30% off on all React related courses. Use code REACT30.",
    date: "2025-03-28T09:15:00Z",
    read: false
  },
  {
    id: 4,
    type: "course_update",
    title: "New Quiz Available: JavaScript Fundamentals",
    description: "Test your knowledge with our new interactive quiz in the JavaScript Fundamentals course.",
    date: "2025-03-27T14:20:00Z",
    read: true
  },
  {
    id: 5,
    type: "event",
    title: "Upcoming Webinar: Advanced TypeScript",
    description: "Join our expert-led webinar on Advanced TypeScript Patterns on April 10, 2025.",
    date: "2025-03-26T11:05:00Z",
    read: false
  }
];

function NotificationsContent() {
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState({
    courseUpdates: true,
    promotionalEmails: false,
    newsletterEmails: true,
    eventReminders: true,
    systemNotifications: true
  });
  const [pushNotifications, setPushNotifications] = useState({
    courseUpdates: true,
    newMessages: true,
    eventReminders: true,
    systemNotifications: false
  });
  const [activeNotifications, setActiveNotifications] = useState(notifications);
  const [activeTab, setActiveTab] = useState("all");

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "course_update":
        return <GraduationCap className="h-5 w-5 text-blue-500" />;
      case "system":
        return <Info className="h-5 w-5 text-purple-500" />;
      case "promotional":
        return <Tag className="h-5 w-5 text-green-500" />;
      case "event":
        return <Calendar className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-slate-500" />;
    }
  };

  const handleToggleEmailNotification = (key: string, value: boolean) => {
    setEmailNotifications(prev => ({
      ...prev,
      [key]: value
    }));
    toast({
      title: value ? "Email notification enabled" : "Email notification disabled",
      description: `You've ${value ? 'enabled' : 'disabled'} ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} email notifications.`
    });
  };

  const handleTogglePushNotification = (key: string, value: boolean) => {
    setPushNotifications(prev => ({
      ...prev,
      [key]: value
    }));
    toast({
      title: value ? "Push notification enabled" : "Push notification disabled",
      description: `You've ${value ? 'enabled' : 'disabled'} ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} push notifications.`
    });
  };

  const handleMarkAsRead = (id: number) => {
    setActiveNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read."
    });
  };

  const handleMarkAllAsRead = () => {
    setActiveNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
    toast({
      title: "All notifications marked as read",
      description: "All notifications have been marked as read."
    });
  };

  const handleFilterNotifications = (filter: string) => {
    setActiveTab(filter);
  };

  const filteredNotifications = activeTab === "all" 
    ? activeNotifications 
    : activeTab === "unread" 
      ? activeNotifications.filter(n => !n.read)
      : activeNotifications.filter(n => n.type === activeTab);

  const unreadCount = activeNotifications.filter(n => !n.read).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Notifications</h1>
        <p className="text-muted-foreground">Manage your notification preferences and view your notifications</p>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        {/* Notification Settings */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Customize how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium flex items-center mb-3">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Notifications
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label htmlFor="email-course-updates" className="text-sm">
                        Course updates
                      </label>
                      <Switch 
                        id="email-course-updates" 
                        checked={emailNotifications.courseUpdates} 
                        onCheckedChange={(value) => handleToggleEmailNotification("courseUpdates", value)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="email-promotional" className="text-sm">
                        Promotional emails
                      </label>
                      <Switch 
                        id="email-promotional" 
                        checked={emailNotifications.promotionalEmails} 
                        onCheckedChange={(value) => handleToggleEmailNotification("promotionalEmails", value)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="email-newsletter" className="text-sm">
                        Newsletter emails
                      </label>
                      <Switch 
                        id="email-newsletter" 
                        checked={emailNotifications.newsletterEmails} 
                        onCheckedChange={(value) => handleToggleEmailNotification("newsletterEmails", value)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="email-events" className="text-sm">
                        Event reminders
                      </label>
                      <Switch 
                        id="email-events" 
                        checked={emailNotifications.eventReminders} 
                        onCheckedChange={(value) => handleToggleEmailNotification("eventReminders", value)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="email-system" className="text-sm">
                        System notifications
                      </label>
                      <Switch 
                        id="email-system" 
                        checked={emailNotifications.systemNotifications} 
                        onCheckedChange={(value) => handleToggleEmailNotification("systemNotifications", value)}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium flex items-center mb-3">
                    <Bell className="h-4 w-4 mr-2" />
                    Push Notifications
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label htmlFor="push-course-updates" className="text-sm">
                        Course updates
                      </label>
                      <Switch 
                        id="push-course-updates" 
                        checked={pushNotifications.courseUpdates} 
                        onCheckedChange={(value) => handleTogglePushNotification("courseUpdates", value)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="push-messages" className="text-sm">
                        New messages
                      </label>
                      <Switch 
                        id="push-messages" 
                        checked={pushNotifications.newMessages} 
                        onCheckedChange={(value) => handleTogglePushNotification("newMessages", value)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="push-events" className="text-sm">
                        Event reminders
                      </label>
                      <Switch 
                        id="push-events" 
                        checked={pushNotifications.eventReminders} 
                        onCheckedChange={(value) => handleTogglePushNotification("eventReminders", value)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="push-system" className="text-sm">
                        System notifications
                      </label>
                      <Switch 
                        id="push-system" 
                        checked={pushNotifications.systemNotifications} 
                        onCheckedChange={(value) => handleTogglePushNotification("systemNotifications", value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications List */}
        <div className="md:col-span-3">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    Notifications 
                    {unreadCount > 0 && (
                      <Badge variant="default" className="ml-2">
                        {unreadCount} new
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>Your recent notifications</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  disabled={unreadCount === 0}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark all as read
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="mb-4">
                <TabsList className="grid grid-cols-5">
                  <TabsTrigger 
                    value="all" 
                    onClick={() => handleFilterNotifications("all")}
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger 
                    value="unread" 
                    onClick={() => handleFilterNotifications("unread")}
                  >
                    Unread
                  </TabsTrigger>
                  <TabsTrigger 
                    value="course_update" 
                    onClick={() => handleFilterNotifications("course_update")}
                  >
                    Courses
                  </TabsTrigger>
                  <TabsTrigger 
                    value="event" 
                    onClick={() => handleFilterNotifications("event")}
                  >
                    Events
                  </TabsTrigger>
                  <TabsTrigger 
                    value="system" 
                    onClick={() => handleFilterNotifications("system")}
                  >
                    System
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <h3 className="font-medium mb-1">No notifications</h3>
                  <p className="text-muted-foreground text-sm">
                    You don't have any {activeTab === "unread" ? "unread " : ""}notifications
                    {activeTab !== "all" && activeTab !== "unread" ? ` of type "${activeTab}"` : ""}.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredNotifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-3 rounded-lg transition-colors ${notification.read ? 'bg-white' : 'bg-blue-50'} hover:bg-slate-50`}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getTypeIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`font-medium text-sm ${notification.read ? '' : 'text-blue-600'}`}>
                              {notification.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {new Date(notification.date).toLocaleDateString()}
                              </span>
                              {!notification.read && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleMarkAsRead(notification.id)}
                                >
                                  <CheckCircle className="h-3.5 w-3.5 text-blue-500" />
                                </Button>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {notification.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

const NotificationsPage = () => {
  return (
    <ProtectedRoute path="/profile/notifications">
      <DashboardLayout>
        <NotificationsContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default NotificationsPage;