
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
}
