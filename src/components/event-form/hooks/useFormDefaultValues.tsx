
import { FormValues } from "../schema";

export function useFormDefaultValues(savedValues: Partial<FormValues> = {}) {
  // Create default values with saved state or empty values
  const defaultValues: Partial<FormValues> = {
    eventName: savedValues.eventName || "",
    description: savedValues.description || "",
    schoolName: savedValues.schoolName || "",
    contactName: savedValues.contactName || "",
    contactEmail: savedValues.contactEmail || "",
    eventLocation: savedValues.eventLocation || "",
    estimatedAttendance: savedValues.estimatedAttendance || "",
    participants: savedValues.participants || "",
    keyHighlights: savedValues.keyHighlights || "",
    specialGuests: savedValues.specialGuests || "",
    notableAchievements: savedValues.notableAchievements || "",
    imagePermission: savedValues.imagePermission || false,
    suggestedCaption: savedValues.suggestedCaption || "",
    contentHighlight: savedValues.contentHighlight || "",
    // Use saved dates if available
    eventDate: savedValues.eventDate,
    submissionDate: savedValues.submissionDate,
    // Add other properties that need default values
    audienceType: savedValues.audienceType || undefined,
    eventTime: savedValues.eventTime || undefined,
  };

  return defaultValues;
}
