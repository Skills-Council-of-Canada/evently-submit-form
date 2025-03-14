
import { toast } from "@/hooks/use-toast";
import { EventRecord } from "./types";

// Define the email notification options
export interface EmailNotification {
  to: string;
  subject: string;
  body: string;
  includeApprovalButtons?: boolean;
}

/**
 * Send email notification through email service API
 * This is a placeholder that would connect to SendGrid, Mailgun, etc.
 */
export const sendEmailNotification = async (notification: EmailNotification): Promise<boolean> => {
  try {
    // This would be replaced with actual API call to email service
    console.log("Sending email notification:", notification);
    
    // Mock API call - in production, replace with actual email service API
    const response = await fetch("https://api.youremailservice.com/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_API_KEY_HERE" // Would use environment variable in production
      },
      body: JSON.stringify({
        to: notification.to,
        subject: notification.subject,
        html: notification.body,
        // Additional options for the email service
      })
    });

    // For demonstration purposes, we'll assume it succeeded
    // In production, you would check the response status
    return true;
  } catch (error) {
    console.error("Failed to send email notification:", error);
    return false;
  }
};

/**
 * Create an email for the PDSB communications team about a new event submission
 */
export const createNewEventNotificationEmail = (event: EventRecord, recordId: string): EmailNotification => {
  const reviewUrl = `${window.location.origin}/content-review/${recordId}`;
  
  // Create HTML content for the email
  const emailBody = `
    <h1>New Event Submission</h1>
    <p>A new event has been submitted and requires your review.</p>
    
    <h2>Event Details</h2>
    <ul>
      <li><strong>Event Name:</strong> ${event.eventName}</li>
      <li><strong>Date:</strong> ${event.eventDate.toLocaleDateString()}</li>
      <li><strong>Time:</strong> ${event.eventTime}</li>
      <li><strong>School:</strong> ${event.schoolName}</li>
      <li><strong>Contact:</strong> ${event.contactName} (${event.contactEmail})</li>
      <li><strong>Audience:</strong> ${event.audienceType}</li>
    </ul>
    
    <h3>Description</h3>
    <p>${event.description}</p>
    
    <div style="margin-top: 20px;">
      <a href="${reviewUrl}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; margin-right: 10px;">
        Review Event
      </a>
    </div>
  `;
  
  return {
    to: "communications@pdsb.org", // Replace with actual PDSB communications team email
    subject: `New Event Submission: ${event.eventName}`,
    body: emailBody,
    includeApprovalButtons: true
  };
};

/**
 * Create a confirmation email for the school when their event is approved
 */
export const createEventApprovalEmail = (event: EventRecord): EmailNotification => {
  const emailBody = `
    <h1>Event Approved</h1>
    <p>Your event submission "${event.eventName}" has been approved by the PDSB communications team.</p>
    
    <h2>Marketing Content</h2>
    <p>Marketing content for your event has been created and scheduled for distribution. You can expect to see promotion through the following channels:</p>
    <ul>
      <li>Social media posts (Twitter, Facebook, LinkedIn)</li>
      <li>PDSB Newsletter</li>
      <li>Press releases (when applicable)</li>
    </ul>
    
    <p>If you have any questions or need to make changes to your event, please contact the PDSB communications team.</p>
    
    <h2>Event Details</h2>
    <ul>
      <li><strong>Event Name:</strong> ${event.eventName}</li>
      <li><strong>Date:</strong> ${event.eventDate.toLocaleDateString()}</li>
      <li><strong>Time:</strong> ${event.eventTime}</li>
      <li><strong>Location:</strong> ${event.schoolName}</li>
    </ul>
    
    <p>Thank you for submitting your event!</p>
  `;
  
  return {
    to: event.contactEmail,
    subject: `Event Approved: ${event.eventName}`,
    body: emailBody
  };
};

/**
 * Create a feedback request email for the school when changes are needed
 */
export const createEventFeedbackRequestEmail = (
  event: EventRecord, 
  feedbackMessage: string
): EmailNotification => {
  const emailBody = `
    <h1>Event Feedback Required</h1>
    <p>Your event submission "${event.eventName}" requires some additional information or changes before it can be approved.</p>
    
    <h2>Feedback from PDSB Communications Team</h2>
    <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; margin: 15px 0;">
      <p>${feedbackMessage}</p>
    </div>
    
    <p>Please contact us at communications@pdsb.org with the requested information or changes.</p>
    
    <h2>Event Details (as submitted)</h2>
    <ul>
      <li><strong>Event Name:</strong> ${event.eventName}</li>
      <li><strong>Date:</strong> ${event.eventDate.toLocaleDateString()}</li>
      <li><strong>Time:</strong> ${event.eventTime}</li>
      <li><strong>Location:</strong> ${event.schoolName}</li>
    </ul>
    
    <p>Thank you for your patience as we work together to promote your event!</p>
  `;
  
  return {
    to: event.contactEmail,
    subject: `Additional Information Needed: ${event.eventName}`,
    body: emailBody
  };
};

/**
 * Send a Slack notification (placeholder - would use Slack API)
 */
export const sendSlackNotification = async (message: string, channel: string = "event-submissions"): Promise<boolean> => {
  try {
    console.log(`Sending Slack notification to #${channel}: ${message}`);
    
    // This would be replaced with actual Slack API call
    // Example using Slack's Web API
    // const response = await fetch("https://slack.com/api/chat.postMessage", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Authorization": "Bearer SLACK_BOT_TOKEN" // Would use environment variable
    //   },
    //   body: JSON.stringify({
    //     channel: channel,
    //     text: message,
    //     // Additional options like attachments for rich formatting
    //   })
    // });
    
    // For demonstration purposes, assume it succeeded
    return true;
  } catch (error) {
    console.error("Failed to send Slack notification:", error);
    return false;
  }
};

/**
 * Send notifications for a new event submission (both email and Slack)
 */
export const notifyNewEventSubmission = async (event: EventRecord, recordId: string): Promise<void> => {
  try {
    // Create and send email notification
    const emailNotification = createNewEventNotificationEmail(event, recordId);
    const emailSent = await sendEmailNotification(emailNotification);
    
    if (emailSent) {
      console.log("Email notification sent successfully");
    } else {
      console.error("Failed to send email notification");
    }
    
    // Create and send Slack notification
    const slackMessage = `🔔 *New Event Submission*: "${event.eventName}" at ${event.schoolName} on ${event.eventDate.toLocaleDateString()}. Review it here: ${window.location.origin}/content-review/${recordId}`;
    const slackSent = await sendSlackNotification(slackMessage);
    
    if (slackSent) {
      console.log("Slack notification sent successfully");
    } else {
      console.error("Failed to send Slack notification");
    }
    
  } catch (error) {
    console.error("Error in notification process:", error);
    toast({
      title: "Notification Error",
      description: "Failed to send notifications about the new event.",
      variant: "destructive",
    });
  }
};

/**
 * Send notification when event content is approved
 */
export const notifyEventApproved = async (event: EventRecord): Promise<void> => {
  try {
    // Send confirmation email to the event submitter
    const approvalEmail = createEventApprovalEmail(event);
    const emailSent = await sendEmailNotification(approvalEmail);
    
    if (emailSent) {
      console.log("Approval notification email sent successfully");
    } else {
      console.error("Failed to send approval notification email");
    }
    
    // Send Slack notification to the team
    const slackMessage = `✅ Event "${event.eventName}" has been approved and marketing content is ready for distribution.`;
    await sendSlackNotification(slackMessage, "event-approvals");
    
  } catch (error) {
    console.error("Error sending approval notifications:", error);
  }
};

/**
 * Send notification when feedback is requested for an event
 */
export const notifyFeedbackRequested = async (
  event: EventRecord, 
  feedbackMessage: string
): Promise<void> => {
  try {
    // Send feedback request email to the event submitter
    const feedbackEmail = createEventFeedbackRequestEmail(event, feedbackMessage);
    const emailSent = await sendEmailNotification(feedbackEmail);
    
    if (emailSent) {
      console.log("Feedback request email sent successfully");
    } else {
      console.error("Failed to send feedback request email");
    }
    
    // Send Slack notification to the team
    const slackMessage = `❓ Feedback requested for event "${event.eventName}". Message: ${feedbackMessage}`;
    await sendSlackNotification(slackMessage, "event-feedback");
    
  } catch (error) {
    console.error("Error sending feedback request notifications:", error);
  }
};
