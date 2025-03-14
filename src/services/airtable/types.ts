
// Define the structure of an event record
export interface EventRecord {
  eventName: string;
  eventDate: Date;
  eventTime: string;
  description: string;
  schoolName: string;
  contactName: string;
  contactEmail: string;
  audienceType: string;
  eventImage?: FileList;
}

// Define structure for content templates that Make.com will create
export interface ContentTemplate {
  sourceEventId: string;
  socialMediaPost: string;
  pressRelease: string;
  newsletterContent: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewerNotes?: string;
}
