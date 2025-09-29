import { useState, useEffect } from 'react';
import { ChatHeader } from './components/ChatHeader';
import { ChatSidebar } from './components/ChatSidebar';
import { ChatInterface } from './components/ChatInterface';
import { NotificationPanel } from './components/NotificationPanel';
import { ChatMessageData } from './components/ChatMessage';

// Mock data for demonstration
const mockRecentChats = [
  { id: '1', title: 'Diabetes treatment options', timestamp: '2 hours ago', type: 'query' as const },
  { id: '2', title: 'Latest cancer immunotherapy', timestamp: '1 day ago', type: 'research' as const },
  { id: '3', title: 'COVID-19 vaccine trials', timestamp: '2 days ago', type: 'trial' as const },
  { id: '4', title: 'Heart disease prevention', timestamp: '3 days ago', type: 'query' as const },
];

const mockClinicalTrials = [
  {
    id: '1',
    title: 'Novel Alzheimer\'s Drug Trial',
    phase: 'III',
    status: 'Recruiting',
    location: 'Multiple sites'
  },
  {
    id: '2', 
    title: 'CAR-T Cell Therapy for Leukemia',
    phase: 'II',
    status: 'Active',
    location: 'Boston, MA'
  },
  {
    id: '3',
    title: 'Gene Therapy for Rare Disease',
    phase: 'I',
    status: 'Recruiting',
    location: 'San Francisco, CA'
  }
];

const mockNotifications = [
  {
    id: '1',
    type: 'breakthrough' as const,
    title: 'New Alzheimer\'s Treatment Shows Promise',
    description: 'Phase III trial results show 32% reduction in cognitive decline',
    timestamp: '2 hours ago',
    isRead: false,
    priority: 'high' as const,
    metadata: {
      source: 'New England Journal of Medicine',
      affectedPopulation: 'Early-stage Alzheimer\'s patients'
    }
  },
  {
    id: '2',
    type: 'trial-update' as const,
    title: 'COVID-19 Vaccine Trial Update',
    description: 'Phase II results exceed efficacy expectations',
    timestamp: '5 hours ago',
    isRead: false,
    priority: 'medium' as const,
    metadata: {
      trialPhase: 'Phase II',
      source: 'Clinical Trials Registry'
    }
  },
  {
    id: '3',
    type: 'guideline' as const,
    title: 'Updated Diabetes Management Guidelines',
    description: 'ADA releases new recommendations for Type 2 diabetes',
    timestamp: '1 day ago',
    isRead: true,
    priority: 'medium' as const,
    metadata: {
      source: 'American Diabetes Association'
    }
  }
];

export default function App() {
  const [userType, setUserType] = useState<'patient' | 'expert'>('patient');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadNotificationCount = notifications.filter(n => !n.isRead).length;

  const generateMockResponse = (userMessage: string, userType: 'patient' | 'expert'): ChatMessageData => {
    const isTrialQuery = userMessage.toLowerCase().includes('trial') || userMessage.toLowerCase().includes('clinical');
    const isResearchQuery = userMessage.toLowerCase().includes('research') || userMessage.toLowerCase().includes('study');
    
    if (isTrialQuery) {
      return {
        id: Date.now().toString(),
        type: 'clinical-trial',
        content: 'I found a relevant clinical trial that matches your query. This trial is currently recruiting participants and may be suitable for your condition.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metadata: {
          confidence: 85,
          trialData: {
            phase: 'III',
            status: 'Recruiting',
            participants: 500,
            location: 'Multiple US locations',
            eligibility: [
              'Ages 18-75 years',
              'Confirmed diagnosis required',
              'No previous experimental treatments',
              'Adequate organ function'
            ]
          },
          sources: [
            { title: 'ClinicalTrials.gov', url: '#', type: 'trial' as const },
            { title: 'FDA Trial Database', url: '#', type: 'guideline' as const }
          ]
        }
      };
    }
    
    if (isResearchQuery) {
      return {
        id: Date.now().toString(),
        type: 'research-insight',
        content: 'Recent research has shown promising results in this area. A comprehensive meta-analysis published last month demonstrates significant clinical benefits.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metadata: {
          confidence: 92,
          researchData: {
            journal: 'Nature Medicine',
            authors: ['Smith, J.', 'Johnson, M.', 'Williams, K.'],
            publicationDate: 'March 2024',
            doi: '10.1038/nm.2024.001'
          },
          sources: [
            { title: 'PubMed Central', url: '#', type: 'journal' as const },
            { title: 'Nature Medicine', url: '#', type: 'journal' as const }
          ]
        }
      };
    }
    
    // Standard response
    const responses = userType === 'expert' ? [
      'Based on current clinical evidence, the recommended approach involves a multi-modal treatment strategy. Recent guidelines suggest...',
      'The latest research indicates improved outcomes with combination therapy. Key studies from 2024 show...',
      'Current best practices recommend individualized treatment protocols. Evidence from recent meta-analyses...'
    ] : [
      'This is a common concern, and there are several effective treatment options available. Let me explain in simple terms...',
      'Based on medical guidelines, here\'s what you should know about this condition and its management...',
      'Many patients have similar questions. The good news is that modern treatments are quite effective...'
    ];
    
    return {
      id: Date.now().toString(),
      type: 'bot',
      content: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      metadata: {
        confidence: Math.floor(Math.random() * 20) + 80,
        sources: [
          { title: userType === 'expert' ? 'Clinical Guidelines' : 'Patient Education Resource', url: '#', type: 'guideline' as const },
          { title: 'Medical Literature Review', url: '#', type: 'journal' as const }
        ]
      }
    };
  };

  const handleSendMessage = async (message: string) => {
    // Add user message
    const userMessage: ChatMessageData = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const botResponse = generateMockResponse(message, userType);
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <ChatHeader
        userType={userType}
        onUserTypeChange={setUserType}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        notificationCount={unreadNotificationCount}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <ChatSidebar
          selectedFilters={selectedFilters}
          onFilterChange={setSelectedFilters}
          recentChats={mockRecentChats}
          clinicalTrials={mockClinicalTrials}
        />
        
        <div className="flex-1 flex">
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            userType={userType}
            isLoading={isLoading}
          />
        </div>
      </div>

      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationAsRead}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
      />
      
      {/* Floating notification button for demo */}
      <button
        onClick={() => setShowNotifications(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <span className="sr-only">Open notifications</span>
        📧
      </button>
    </div>
  );
}