
import { Database } from './types';

// Extended Database type with events table
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
    } & Database['public']['Tables'];
  };
};
