
export interface EventRecord {
  id?: string;
  eventName: string;
  eventDate: Date;
  eventTime: string;
  description: string;
  schoolName: string;
  contactName: string;
  contactEmail: string;
  audienceType: string;
  submissionDate?: Date;
  imageUrl?: string | null;
  status?: 'pending' | 'approved' | 'published';
  createdAt?: string;
  eventLocation?: string;
  estimatedAttendance?: string;
  participants?: string;
  keyHighlights?: string;
  specialGuests?: string;
  notableAchievements?: string;
  imagePermission?: boolean;
  suggestedCaption?: string;
  contentHighlight?: string;
  messageTone?: string;
}
