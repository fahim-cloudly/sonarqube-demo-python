import { Search, Bell, User, Stethoscope, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface ChatHeaderProps {
  userType: 'patient' | 'expert';
  onUserTypeChange: (type: 'patient' | 'expert') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  notificationCount: number;
}

export function ChatHeader({ 
  userType, 
  onUserTypeChange, 
  searchQuery, 
  onSearchChange, 
  notificationCount 
}: ChatHeaderProps) {
  return (
    <header className="border-b bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Stethoscope className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">MedChat AI</h1>
              <p className="text-sm text-gray-500">Medical Research Assistant</p>
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search medical topics, treatments, trials..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant={userType === 'patient' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onUserTypeChange('patient')}
              className="text-xs"
            >
              <User className="h-3 w-3 mr-1" />
              Patient
            </Button>
            <Button
              variant={userType === 'expert' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onUserTypeChange('expert')}
              className="text-xs"
            >
              <Stethoscope className="h-3 w-3 mr-1" />
              Expert
            </Button>
          </div>

          <div className="relative">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                  {notificationCount}
                </Badge>
              )}
            </Button>
          </div>

          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {userType === 'expert' ? 'Dr' : 'P'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}