
import { z } from "zod";

// Form schema definition
export const formSchema = z.object({
  eventName: z.string().min(3, {
    message: "Event name must be at least 3 characters.",
  }),
  eventDate: z.date({
    required_error: "Event date is required.",
  }),
  eventTime: z.string().optional(),
  eventLocation: z.string().optional(),
  estimatedAttendance: z.string().optional(),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }).max(3000, {
    message: "Description cannot exceed 3000 characters.",
  }),
  schoolName: z.string().min(3, {
    message: "School name must be at least 3 characters.",
  }),
  contactName: z.string().min(3, {
    message: "Contact name must be at least 3 characters.",
  }),
  contactEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  audienceType: z.string({
    required_error: "Please select an audience type.",
  }),
  submissionDate: z.date(),
  eventImage: z.instanceof(FileList).optional(),
  participants: z.string().optional(),
  keyHighlights: z.string().optional(),
  specialGuests: z.string().optional(),
  notableAchievements: z.string().optional(),
  imagePermission: z.boolean().optional(),
  suggestedCaption: z.string().optional(),
  contentHighlight: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;
