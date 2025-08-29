import React from 'react';
import { Phone, Clock, User, Calendar, CheckCircle, AlertCircle, Activity } from 'lucide-react';
import { ConversationSummary } from '../types/conversation';
import { formatDistanceToNow, format } from 'date-fns';

interface ConversationCardProps {
  conversation: ConversationSummary;
  onClick: () => void;
}

export const ConversationCard: React.FC<ConversationCardProps> = ({ 
  conversation, 
  onClick 
}) => {
  const getStatusIcon = () => {
    switch (conversation.status) {
      case 'active':
        return <Activity className="w-4 h-4 text-success-600 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-primary-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-error-600" />;
      default:
        return null;
    }
  };

  const getStatusClass = () => {
    switch (conversation.status) {
      case 'active':
        return 'status-badge status-active';
      case 'completed':
        return 'status-badge status-completed';
      case 'error':
        return 'status-badge status-error';
      default:
        return 'status-badge';
    }
  };

  return (
    <div 
      className="card cursor-pointer hover:shadow-lg transition-all duration-300 animate-fade-in"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Phone className="w-5 h-5 text-gray-500" />
          <span className="font-semibold text-gray-900">
            {conversation.clientPhone}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className={getStatusClass()}>
            {conversation.status}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          <span>
            {formatDistanceToNow(new Date(conversation.startTime), { addSuffix: true })}
          </span>
          {conversation.duration && (
            <span className="ml-2 text-gray-400">
              • {Math.round(conversation.duration / 60)}m {conversation.duration % 60}s
            </span>
          )}
        </div>

        <p className="text-gray-700 text-sm line-clamp-2">
          {conversation.summary}
        </p>

        {conversation.appointmentDetails && (
          <div className="bg-primary-50 rounded-lg p-3 space-y-2">
            <div className="flex items-center text-sm">
              <User className="w-4 h-4 mr-2 text-primary-600" />
              <span className="font-medium text-primary-900">
                {conversation.appointmentDetails.name}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 mr-2 text-primary-600" />
              <span className="text-primary-800">
                Dr. {conversation.appointmentDetails.docname} - {conversation.appointmentDetails.appointment_datetime}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};