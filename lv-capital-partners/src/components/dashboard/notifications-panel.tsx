"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  Building,
  Check,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  TrendingUp,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Notification {
  id: string;
  type:
    | "distribution"
    | "investment"
    | "document"
    | "system"
    | "alert"
    | "performance";
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: "low" | "medium" | "high";
  actionUrl?: string;
  actionLabel?: string;
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "distribution",
    title: "Distribution Received",
    message: "You received $12,500 from Austin Tech Campus investment",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: false,
    priority: "high",
    actionUrl: "/dashboard?tab=documents",
    actionLabel: "View Details",
  },
  {
    id: "2",
    type: "document",
    title: "Q4 Report Available",
    message: "Your quarterly portfolio report is ready for download",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    isRead: false,
    priority: "medium",
    actionUrl: "/dashboard?tab=documents",
    actionLabel: "Download",
  },
  {
    id: "3",
    type: "performance",
    title: "Portfolio Update",
    message: "Manhattan Luxury Tower valuation increased by 8.5%",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    isRead: false,
    priority: "medium",
    actionUrl: "/investments/manhattan-luxury-tower",
    actionLabel: "View Property",
  },
  {
    id: "4",
    type: "investment",
    title: "New Investment Opportunity",
    message: "Seattle Waterfront Development - Early access available",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    isRead: true,
    priority: "high",
    actionUrl: "/investments/opportunities",
    actionLabel: "View Deal",
  },
  {
    id: "5",
    type: "alert",
    title: "Action Required",
    message: "Tax documents require your review and digital signature",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isRead: true,
    priority: "high",
    actionUrl: "/dashboard?tab=documents",
    actionLabel: "Review Documents",
  },
  {
    id: "6",
    type: "system",
    title: "System Maintenance",
    message: "Scheduled maintenance window: Dec 15, 2:00 AM - 4:00 AM EST",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    isRead: true,
    priority: "low",
  },
];

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "distribution":
      return <DollarSign className="w-5 h-5 text-vault-accent" />;
    case "investment":
      return <Building className="w-5 h-5 text-vault-primary" />;
    case "document":
      return <FileText className="w-5 h-5 text-vault-secondary" />;
    case "performance":
      return <TrendingUp className="w-5 h-5 text-vault-accent" />;
    case "alert":
      return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    case "system":
      return <AlertCircle className="w-5 h-5 text-vault-muted" />;
    default:
      return <Bell className="w-5 h-5 text-vault-muted" />;
  }
};

const getPriorityColor = (priority: Notification["priority"]) => {
  switch (priority) {
    case "high":
      return "text-red-600 bg-red-50 border-red-200";
    case "medium":
      return "text-vault-secondary bg-vault-secondary/10 border-vault-secondary/20";
    case "low":
      return "text-vault-muted bg-vault-background border-vault-light";
    default:
      return "text-vault-muted bg-vault-background border-vault-light";
  }
};

const formatTimeAgo = (timestamp: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor(
    (now.getTime() - timestamp.getTime()) / 1000,
  );

  if (diffInSeconds < 60) {
    return "Just now";
  }
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  }
  const days = Math.floor(diffInSeconds / 86400);
  return `${days}d ago`;
};

export function NotificationsPanel() {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    // Simulate real-time notifications
    const interval = setInterval(() => {
      // Randomly add new notifications (for demo purposes)
      if (Math.random() > 0.95) {
        // 5% chance every second
        const newNotification: Notification = {
          id: `new_${Date.now()}`,
          type: (["distribution", "performance", "document"] as const)[
            Math.floor(Math.random() * 3)
          ] as Notification['type'],
          title: "New Update",
          message: "Portfolio performance update available",
          timestamp: new Date(),
          isRead: false,
          priority: "medium",
        };

        setNotifications((prev) => [newNotification, ...prev.slice(0, 9)]); // Keep last 10
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true })),
    );
  };

  const removeNotification = (notificationId: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId),
    );
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative p-2 hover:bg-vault-background/50"
        >
          <Bell className="w-5 h-5 text-vault-primary" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 text-white border-0">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-96 p-0 bg-white border border-vault-light shadow-xl"
        align="end"
      >
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3 border-b border-vault-light/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-vault-primary">
                Notifications
              </CardTitle>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs text-vault-muted hover:text-vault-primary"
                  >
                    Mark all read
                  </Button>
                )}
                <Badge
                  variant="outline"
                  className="border-vault-light text-vault-muted"
                >
                  {unreadCount} new
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Bell className="w-12 h-12 text-vault-light mb-3" />
                  <p className="text-vault-muted font-medium">
                    No notifications
                  </p>
                  <p className="text-sm text-vault-muted/60">
                    You're all caught up!
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-vault-light/30">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-vault-background/30 transition-colors ${
                        !notification.isRead ? "bg-vault-background/20" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4
                              className={`font-semibold text-sm ${
                                !notification.isRead
                                  ? "text-vault-primary"
                                  : "text-vault-muted"
                              }`}
                            >
                              {notification.title}
                            </h4>
                            <div className="flex items-center gap-1">
                              <Badge
                                variant="outline"
                                className={`text-xs px-2 py-0 ${getPriorityColor(notification.priority)}`}
                              >
                                {notification.priority}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  removeNotification(notification.id)
                                }
                                className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>

                          <p className="text-sm text-vault-muted mb-2 line-clamp-2">
                            {notification.message}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-vault-muted">
                              <Clock className="w-3 h-3" />
                              <span>
                                {formatTimeAgo(notification.timestamp)}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {notification.actionUrl && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 text-xs px-2 text-vault-primary hover:bg-vault-primary/10"
                                  onClick={() => {
                                    markAsRead(notification.id);
                                    setIsOpen(false);
                                    // In a real app, navigate to actionUrl
                                  }}
                                >
                                  {notification.actionLabel || "View"}
                                </Button>
                              )}

                              {!notification.isRead && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="h-6 w-6 p-0 text-vault-accent hover:bg-vault-accent/10"
                                >
                                  <Check className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
