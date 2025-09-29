import { Clock, Filter, Bookmark, TrendingUp, Calendar, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";

interface ChatSidebarProps {
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
  recentChats: Array<{
    id: string;
    title: string;
    timestamp: string;
    type: 'query' | 'research' | 'trial';
  }>;
  clinicalTrials: Array<{
    id: string;
    title: string;
    phase: string;
    status: string;
    location: string;
  }>;
}

const filterOptions = [
  { id: 'treatments', label: 'New Treatments', icon: TrendingUp },
  { id: 'trials', label: 'Clinical Trials', icon: Calendar },
  { id: 'research', label: 'Latest Research', icon: Bookmark },
  { id: 'guidelines', label: 'Guidelines', icon: Filter },
];

export function ChatSidebar({ 
  selectedFilters, 
  onFilterChange, 
  recentChats, 
  clinicalTrials 
}: ChatSidebarProps) {
  const handleFilterToggle = (filterId: string) => {
    const newFilters = selectedFilters.includes(filterId)
      ? selectedFilters.filter(f => f !== filterId)
      : [...selectedFilters, filterId];
    onFilterChange(newFilters);
  };

  return (
    <div className="w-80 border-r bg-gray-50 flex flex-col">
      <div className="p-4">
        <h3 className="font-semibold mb-3">Filters</h3>
        <div className="space-y-2">
          {filterOptions.map((filter) => {
            const Icon = filter.icon;
            const isSelected = selectedFilters.includes(filter.id);
            return (
              <Button
                key={filter.id}
                variant={isSelected ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleFilterToggle(filter.id)}
                className="w-full justify-start"
              >
                <Icon className="h-4 w-4 mr-2" />
                {filter.label}
              </Button>
            );
          })}
        </div>
      </div>

      <Separator />

      <div className="p-4">
        <h3 className="font-semibold mb-3">Recent Conversations</h3>
        <ScrollArea className="h-48">
          <div className="space-y-2">
            {recentChats.map((chat) => (
              <Card key={chat.id} className="p-3 cursor-pointer hover:bg-gray-100">
                <div className="flex items-start space-x-2">
                  <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{chat.title}</p>
                    <p className="text-xs text-gray-500">{chat.timestamp}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {chat.type}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      <Separator />

      <div className="flex-1 p-4">
        <h3 className="font-semibold mb-3">Active Clinical Trials</h3>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {clinicalTrials.map((trial) => (
              <Card key={trial.id} className="p-3">
                <CardHeader className="p-0 pb-2">
                  <CardTitle className="text-sm">{trial.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      Phase {trial.phase}
                    </Badge>
                    <Badge 
                      variant={trial.status === 'Recruiting' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {trial.status}
                    </Badge>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <MapPin className="h-3 w-3 mr-1" />
                    {trial.location}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}