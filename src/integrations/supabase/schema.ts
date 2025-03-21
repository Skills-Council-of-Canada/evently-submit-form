
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
