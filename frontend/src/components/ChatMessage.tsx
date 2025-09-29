import { Bot, User, ExternalLink, Calendar, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { MarkdownMessage } from "./utils/MarkdownMessage";

export interface ChatMessageData {
  id: string;
  type: 'user' | 'bot' | 'clinical-trial' | 'research-insight';
  content: string;
  timestamp: string;
  metadata?: {
    confidence?: number;
    sources?: Array<{
      title: string;
      url: string;
      type: 'journal' | 'trial' | 'guideline';
    }>;
    trialData?: {
      phase: string;
      status: string;
      participants: number;
      location: string;
      eligibility: string[];
    };
    researchData?: {
      journal: string;
      authors: string[];
      publicationDate: string;
      doi: string;
    };
  };
}

interface ChatMessageProps {
  message: ChatMessageData;
  userType: 'patient' | 'expert';
}

export function ChatMessage({ message, userType }: ChatMessageProps) {
  const isUser = message.type === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex items-start mb-5  ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <Avatar className="h-8 w-8">
          <AvatarFallback className={isUser ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}>
            {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
          </AvatarFallback>
        </Avatar>
        
        <div className={`${isUser ? 'items-end' : 'items-start'} flex flex-col space-y-2`}>
          <Card className={`${isUser ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}>
            <CardContent className="p-4">
              {message.type === 'clinical-trial' && message.metadata?.trialData ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold">Clinical Trial Match</span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                  
                  <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">Phase {message.metadata.trialData.phase}</Badge>
                      <Badge variant={message.metadata.trialData.status === 'Recruiting' ? 'default' : 'secondary'}>
                        {message.metadata.trialData.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1 text-gray-500" />
                        {message.metadata.trialData.participants} participants
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-gray-500" />
                        {message.metadata.trialData.location}
                      </div>
                    </div>
                    
                    {userType === 'patient' && message.metadata.trialData.eligibility && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-700">Key Eligibility:</p>
                        <ul className="text-xs text-gray-600 mt-1 space-y-1">
                          {message.metadata.trialData.eligibility.slice(0, 3).map((criteria, idx) => (
                            <li key={idx}>• {criteria}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ) : message.type === 'research-insight' && message.metadata?.researchData ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="h-4 w-4 text-green-600" />
                    <span className="font-semibold">Research Insight</span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                  
                  <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                    <p className="text-sm font-medium">{message.metadata.researchData.journal}</p>
                    <p className="text-xs text-gray-600">
                      {message.metadata.researchData.authors.slice(0, 3).join(', ')}
                      {message.metadata.researchData.authors.length > 3 && ' et al.'}
                    </p>
                    <p className="text-xs text-gray-500">{message.metadata.researchData.publicationDate}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm"><MarkdownMessage content={message.content} /></p>
                  
                  {message.metadata?.confidence && !isUser && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Confidence:</span>
                      <Badge variant="secondary" className="text-xs">
                        {message.metadata.confidence}%
                      </Badge>
                    </div>
                  )}
                </div>
              )}
              
              {message.metadata?.sources && message.metadata.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs font-medium text-gray-700 mb-2">Sources:</p>
                  <div className="space-y-1">
                    {message.metadata.sources.map((source, idx) => (
                      <Button
                        key={idx}
                        variant="ghost"
                        size="sm"
                        className="h-auto p-1 text-xs text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        {source.title}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <span className={`text-xs text-gray-500 ${isUser ? 'text-right' : 'text-left'}`}>
            {message.timestamp}
          </span>
        </div>
      </div>
    </div>
  );
}