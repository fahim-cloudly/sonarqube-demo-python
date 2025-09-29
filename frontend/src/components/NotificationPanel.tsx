import { useState } from "react";
import { X, Bell, TrendingUp, Calendar, FileText, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";

interface Notification {
  id: string;
  type: 'breakthrough' | 'trial-update' | 'guideline' | 'research';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
  metadata?: {
    source?: string;
    url?: string;
    trialPhase?: string;
    affectedPopulation?: string;
  };
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export function NotificationPanel({ 
  isOpen, 
  onClose, 
  notifications, 
  onMarkAsRead, 
  onMarkAllAsRead 
}: NotificationPanelProps) {
  if (!isOpen) return null;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'breakthrough':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'trial-update':
        return <Calendar className="h-4 w-4 text-blue-600" />;
      case 'guideline':
        return <FileText className="h-4 w-4 text-purple-600" />;
      case 'research':
        return <FileText className="h-4 w-4 text-orange-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 border-red-200';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200';
      case 'low':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-96 h-full shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <h2 className="font-semibold">Notifications</h2>
            {unreadCount > 0 && (
              <Badge variant="default" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={onMarkAllAsRead}>
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No notifications yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  We'll notify you of medical breakthroughs and trial updates
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <Card 
                  key={notification.id}
                  className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                    getPriorityColor(notification.priority)
                  } ${!notification.isRead ? 'ring-2 ring-blue-200' : ''}`}
                  onClick={() => !notification.isRead && onMarkAsRead(notification.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getNotificationIcon(notification.type)}
                        <CardTitle className="text-sm">{notification.title}</CardTitle>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 mb-2">
                      {notification.description}
                    </p>
                    
                    {notification.metadata && (
                      <div className="space-y-1 text-xs text-gray-500">
                        {notification.metadata.source && (
                          <p>Source: {notification.metadata.source}</p>
                        )}
                        {notification.metadata.trialPhase && (
                          <p>Phase: {notification.metadata.trialPhase}</p>
                        )}
                        {notification.metadata.affectedPopulation && (
                          <p>Population: {notification.metadata.affectedPopulation}</p>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">
                        {notification.timestamp}
                      </span>
                      {notification.metadata?.url && (
                        <Button variant="ghost" size="sm" className="text-xs h-auto p-1">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}