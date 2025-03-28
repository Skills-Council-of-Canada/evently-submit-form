export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          audience_type: string
          contact_email: string
          contact_name: string
          content_highlight: string | null
          created_at: string
          description: string
          estimated_attendance: string | null
          event_date: string
          event_location: string | null
          event_name: string
          event_time: string
          id: string
          image_permission: boolean | null
          image_url: string | null
          key_highlights: string | null
          message_tone: string | null
          notable_achievements: string | null
          participants: string | null
          school_name: string
          special_guests: string | null
          status: string
          submission_date: string
          suggested_caption: string | null
        }
        Insert: {
          audience_type: string
          contact_email: string
          contact_name: string
          content_highlight?: string | null
          created_at?: string
          description: string
          estimated_attendance?: string | null
          event_date: string
          event_location?: string | null
          event_name: string
          event_time: string
          id?: string
          image_permission?: boolean | null
          image_url?: string | null
          key_highlights?: string | null
          message_tone?: string | null
          notable_achievements?: string | null
          participants?: string | null
          school_name: string
          special_guests?: string | null
          status?: string
          submission_date: string
          suggested_caption?: string | null
        }
        Update: {
          audience_type?: string
          contact_email?: string
          contact_name?: string
          content_highlight?: string | null
          created_at?: string
          description?: string
          estimated_attendance?: string | null
          event_date?: string
          event_location?: string | null
          event_name?: string
          event_time?: string
          id?: string
          image_permission?: boolean | null
          image_url?: string | null
          key_highlights?: string | null
          message_tone?: string | null
          notable_achievements?: string | null
          participants?: string | null
          school_name?: string
          special_guests?: string | null
          status?: string
          submission_date?: string
          suggested_caption?: string | null
        }
        Relationships: []
      }
      schools: {
        Row: {
          created_at: string
          family: string | null
          full_address: string | null
          grades: string | null
          id: string
          municipality: string | null
          panel: string | null
          postal_code: string | null
          school: string
          school_name: string
          school_type: string | null
          street_name: string | null
          street_number: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          family?: string | null
          full_address?: string | null
          grades?: string | null
          id?: string
          municipality?: string | null
          panel?: string | null
          postal_code?: string | null
          school: string
          school_name: string
          school_type?: string | null
          street_name?: string | null
          street_number?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          family?: string | null
          full_address?: string | null
          grades?: string | null
          id?: string
          municipality?: string | null
          panel?: string | null
          postal_code?: string | null
          school?: string
          school_name?: string
          school_type?: string | null
          street_name?: string | null
          street_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
