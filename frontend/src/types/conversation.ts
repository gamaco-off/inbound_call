export interface ConversationSummary {
  id: string;
  clientPhone: string;
  startTime: string;
  endTime?: string;
  status: 'active' | 'completed' | 'error';
  duration?: number;
  summary: string;
  appointmentDetails?: AppointmentDetails;
  transcript?: TranscriptEntry[];
}

export interface AppointmentDetails {
  docname: string;
  name: string;
  phone: string;
  appointment_datetime: string;
}

export interface TranscriptEntry {
  id: string;
  timestamp: string;
  speaker: 'ai' | 'client';
  message: string;
  confidence?: number;
}

export interface ConversationUpdate {
  conversationId: string;
  type: 'transcript' | 'status' | 'appointment' | 'summary';
  data: any;
  timestamp: string;
}