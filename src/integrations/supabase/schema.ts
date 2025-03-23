
import { Database } from './types';

// Extended Database type with events and schools tables
export type ExtendedDatabase = Database & {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          event_name: string;
          event_date: string;
          event_time: string;
          description: string;
          school_name: string;
          contact_name: string;
          contact_email: string;
          audience_type: string;
          status: 'pending' | 'approved' | 'published';
          created_at: string;
          submission_date: string;
          event_location: string | null;
          estimated_attendance: string | null;
          participants: string | null;
          key_highlights: string | null;
          special_guests: string | null;
          notable_achievements: string | null;
          image_permission: boolean | null;
          suggested_caption: string | null;
          content_highlight: string | null;
          message_tone: string | null;
        };
        Insert: {
          id?: string;
          event_name: string;
          event_date: string;
          event_time: string;
          description: string;
          school_name: string;
          contact_name: string;
          contact_email: string;
          audience_type: string;
          status?: 'pending' | 'approved' | 'published';
          created_at?: string;
          submission_date: string;
          event_location?: string | null;
          estimated_attendance?: string | null;
          participants?: string | null;
          key_highlights?: string | null;
          special_guests?: string | null;
          notable_achievements?: string | null;
          image_permission?: boolean | null;
          suggested_caption?: string | null;
          content_highlight?: string | null;
          message_tone?: string | null;
        };
        Update: {
          id?: string;
          event_name?: string;
          event_date?: string;
          event_time?: string;
          description?: string;
          school_name?: string;
          contact_name?: string;
          contact_email?: string;
          audience_type?: string;
          status?: 'pending' | 'approved' | 'published';
          created_at?: string;
          submission_date?: string;
          event_location?: string | null;
          estimated_attendance?: string | null;
          participants?: string | null;
          key_highlights?: string | null;
          special_guests?: string | null;
          notable_achievements?: string | null;
          image_permission?: boolean | null;
          suggested_caption?: string | null;
          content_highlight?: string | null;
          message_tone?: string | null;
        };
        Relationships: [];
      };
      schools: {
        Row: {
          id: string;
          municipality?: string;
          school: string;
          school_type?: string;
          panel?: string;
          street_number?: string;
          street_name?: string;
          full_address?: string;
          postal_code?: string;
          grades?: string;
          family?: string;
          school_name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          municipality?: string;
          school: string;
          school_type?: string;
          panel?: string;
          street_number?: string;
          street_name?: string;
          full_address?: string;
          postal_code?: string;
          grades?: string;
          family?: string;
          school_name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          municipality?: string;
          school?: string;
          school_type?: string;
          panel?: string;
          street_number?: string;
          street_name?: string;
          full_address?: string;
          postal_code?: string;
          grades?: string;
          family?: string;
          school_name?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    } & Database['public']['Tables'];
  };
};
