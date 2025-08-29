import axios from 'axios';
import { ConversationSummary } from '../types/conversation';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.warn('Unauthorized access detected');
    }
    return Promise.reject(error);
  }
);

export const conversationAPI = {
  // Get all conversations
  getConversations: async (): Promise<ConversationSummary[]> => {
    try {
      const response = await api.get('/conversations');
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  },

  // Get specific conversation
  getConversation: async (id: string): Promise<ConversationSummary> => {
    try {
      const response = await api.get(`/conversations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  },

  // Get conversation transcript
  getTranscript: async (id: string) => {
    try {
      const response = await api.get(`/conversations/${id}/transcript`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transcript:', error);
      throw error;
    }
  },

  // Update conversation status
  updateConversationStatus: async (id: string, status: string) => {
    try {
      const response = await api.patch(`/conversations/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating conversation status:', error);
      throw error;
    }
  },

  // Get real-time updates
  getUpdates: async (since?: string) => {
    try {
      const params = since ? { since } : {};
      const response = await api.get('/conversations/updates', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching updates:', error);
      throw error;
    }
  }
};

export default api;