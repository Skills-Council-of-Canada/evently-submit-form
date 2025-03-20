
import { toast } from "@/hooks/use-toast";
import { EventRecord } from "./eventService";

export interface ContentTemplate {
  id: string;
  sourceEventId: string;
  socialMediaPost: string;
  pressRelease: string;
  newsletterContent: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewerNotes?: string;
}

/**
 * Mock function for getting content templates
 */
export const getContentTemplates = async (eventId: string): Promise<ContentTemplate[]> => {
  console.log(`Getting content templates for event ${eventId}`);
  
  // Return a mock template for demo purposes
  return [{
    id: "mock-content-id",
    sourceEventId: eventId,
    socialMediaPost: "This is a social media post template. It will be replaced with real content from Supabase.",
    pressRelease: "This is a press release template. It will be replaced with real content from Supabase.",
    newsletterContent: "This is a newsletter content template. It will be replaced with real content from Supabase.",
    status: "pending"
  }];
};

/**
 * Mock function for updating content approval
 */
export const updateContentApproval = async (
  templateId: string,
  status: 'approved' | 'rejected',
  reviewerNotes: string = ""
): Promise<boolean> => {
  console.log(`Updating content approval for template ${templateId} to ${status} with notes: ${reviewerNotes}`);
  
  // Simulate a successful update
  return true;
};
