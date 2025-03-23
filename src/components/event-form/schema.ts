
import { z } from "zod";

// Form schema definition
export const formSchema = z.object({
  eventName: z.string().min(3, {
    message: "Event name must be at least 3 characters.",
  }),
  eventDate: z.date({
    required_error: "Event date is required.",
  }),
  eventTime: z.string().min(1, {
    message: "Event time is required.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }).max(500, {
    message: "Description cannot exceed 500 characters.",
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
});

export type FormValues = z.infer<typeof formSchema>;
