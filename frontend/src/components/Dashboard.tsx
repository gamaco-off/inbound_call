import React, { useState, useEffect } from 'react';
import { Phone, Users, Clock, TrendingUp, RefreshCw, Search, Filter } from 'lucide-react';
import { ConversationSummary } from '../types/conversation';
import { ConversationCard } from './ConversationCard';
import { ConversationDetail } from './ConversationDetail';
import { StatsCard } from './StatsCard';

export const Dashboard: React.FC = () => {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationSummary | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockConversations: ConversationSummary[] = [
      {
        id: '1',
        clientPhone: '+1-555-0123',
        startTime: new Date(Date.now() - 300000).toISOString(),
        status: 'active',
        summary: 'Client calling to schedule an appointment with Dr. Smith for next week.',
        transcript: [
          {
            id: '1',
            timestamp: new Date(Date.now() - 280000).toISOString(),
            speaker: 'ai',
            message: 'Hello there! I am Jane from Medical Centre. How can I assist you today?',
            confidence: 0.95
          },
          {
            id: '2',
            timestamp: new Date(Date.now() - 270000).toISOString(),
            speaker: 'client',
            message: 'Hi, I would like to schedule an appointment with Dr. Smith.',
            confidence: 0.92
          }
        ]
      },
      {
        id: '2',
        clientPhone: '+1-555-0456',
        startTime: new Date(Date.now() - 1800000).toISOString(),
        endTime: new Date(Date.now() - 1200000).toISOString(),
        status: 'completed',
        duration: 600,
        summary: 'Successfully scheduled appointment with Dr. Johnson for patient John Doe.',
        appointmentDetails: {
          docname: 'Johnson',
          name: 'John Doe',
          phone: '+1-555-0456',
          appointment_datetime: 'Tomorrow 2:00 PM'
        },
        transcript: [
          {
            id: '3',
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            speaker: 'ai',
            message: 'Hello there! I am Jane from Medical Centre. How can I assist you today?',
            confidence: 0.98
          },
          {
            id: '4',
            timestamp: new Date(Date.now() - 1790000).toISOString(),
            speaker: 'client',
            message: 'I need to book an appointment with Dr. Johnson.',
            confidence: 0.94
          }
        ]
      },
      {
        id: '3',
        clientPhone: '+1-555-0789',
        startTime: new Date(Date.now() - 3600000).toISOString(),
        endTime: new Date(Date.now() - 3300000).toISOString(),
        status: 'error',
        duration: 300,
        summary: 'Call ended unexpectedly during appointment scheduling process.',
      }
    ];
    
    setConversations(mockConversations);
  }, []);

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.clientPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (conv.appointmentDetails?.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || conv.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalCalls: conversations.length,
    activeCalls: conversations.filter(c => c.status === 'active').length,
    completedCalls: conversations.filter(c => c.status === 'completed').length,
    avgDuration: conversations
      .filter(c => c.duration)
      .reduce((acc, c) => acc + (c.duration || 0), 0) / 
      conversations.filter(c => c.duration).length || 0
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Medical Centre Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                  AI Conversation Management
                </p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Calls"
            value={stats.totalCalls}
            icon={<Phone className="w-6 h-6" />}
            color="primary"
          />
          <StatsCard
            title="Active Calls"
            value={stats.activeCalls}
            icon={<Users className="w-6 h-6" />}
            color="success"
          />
          <StatsCard
            title="Completed"
            value={stats.completedCalls}
            icon={<TrendingUp className="w-6 h-6" />}
            color="primary"
          />
          <StatsCard
            title="Avg Duration"
            value={`${Math.round(stats.avgDuration / 60)}m`}
            icon={<Clock className="w-6 h-6" />}
            color="warning"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by phone, name, or summary..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="error">Error</option>
              </select>
            </div>
          </div>
        </div>

        {/* Conversations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredConversations.map((conversation) => (
            <ConversationCard
              key={conversation.id}
              conversation={conversation}
              onClick={() => setSelectedConversation(conversation)}
            />
          ))}
        </div>

        {filteredConversations.length === 0 && (
          <div className="text-center py-12">
            <Phone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No conversations found
            </h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Conversations will appear here when clients call.'}
            </p>
          </div>
        )}
      </main>

      {/* Conversation Detail Modal */}
      {selectedConversation && (
        <ConversationDetail
          conversation={selectedConversation}
          onClose={() => setSelectedConversation(null)}
        />
      )}
    </div>
  );
};