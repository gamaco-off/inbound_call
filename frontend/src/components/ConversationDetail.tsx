import React from 'react';
import { X, Phone, Clock, User, Calendar, MessageCircle, Bot, UserIcon } from 'lucide-react';
import { ConversationSummary, TranscriptEntry } from '../types/conversation';
import { format } from 'date-fns';

interface ConversationDetailProps {
  conversation: ConversationSummary;
  onClose: () => void;
}

export const ConversationDetail: React.FC<ConversationDetailProps> = ({ 
  conversation, 
  onClose 
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Phone className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">{conversation.clientPhone}</h2>
                <p className="text-primary-100 text-sm">
                  {format(new Date(conversation.startTime), 'PPpp')}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Summary Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-primary-600" />
              Conversation Summary
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">{conversation.summary}</p>
            </div>
          </div>

          {/* Appointment Details */}
          {conversation.appointmentDetails && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-primary-600" />
                Appointment Details
              </h3>
              <div className="bg-primary-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-primary-600" />
                    <span className="text-sm text-gray-600">Patient:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {conversation.appointmentDetails.name}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-primary-600" />
                    <span className="text-sm text-gray-600">Phone:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {conversation.appointmentDetails.phone}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-primary-600" />
                    <span className="text-sm text-gray-600">Doctor:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      Dr. {conversation.appointmentDetails.docname}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-primary-600" />
                    <span className="text-sm text-gray-600">Date & Time:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {conversation.appointmentDetails.appointment_datetime}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transcript */}
          {conversation.transcript && conversation.transcript.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-primary-600" />
                Conversation Transcript
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {conversation.transcript.map((entry) => (
                  <div
                    key={entry.id}
                    className={`flex items-start space-x-3 p-3 rounded-lg ${
                      entry.speaker === 'ai' 
                        ? 'bg-primary-50 border-l-4 border-primary-500' 
                        : 'bg-gray-50 border-l-4 border-gray-400'
                    }`}
                  >
                    <div className={`p-2 rounded-full ${
                      entry.speaker === 'ai' ? 'bg-primary-100' : 'bg-gray-200'
                    }`}>
                      {entry.speaker === 'ai' ? (
                        <Bot className="w-4 h-4 text-primary-600" />
                      ) : (
                        <UserIcon className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {entry.speaker === 'ai' ? 'AI Assistant' : 'Client'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(entry.timestamp), 'HH:mm:ss')}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">{entry.message}</p>
                      {entry.confidence && (
                        <div className="mt-1">
                          <span className="text-xs text-gray-500">
                            Confidence: {Math.round(entry.confidence * 100)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};