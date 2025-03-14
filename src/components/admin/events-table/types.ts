
import { EventRecord } from "@/services/airtableService";

export interface ExtendedEventRecord extends EventRecord {
  id: string;
  status: "pending" | "approved" | "published";
  contentGenerated?: boolean;
}

export interface EventsTableProps {
  searchQuery: string;
  selectedSchool: string | null;
  selectedStatus: string | null;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

export interface EventRowProps {
  event: ExtendedEventRecord;
  onViewDetails: (event: ExtendedEventRecord) => void;
  onApprove: (eventId: string) => void;
  onPublish: (eventId: string) => void;
  onDelete: (eventId: string) => void;
}

export interface EventActionsProps {
  event: ExtendedEventRecord;
  onViewDetails: () => void;
  onApprove: (eventId: string) => void;
  onPublish: (eventId: string) => void;
  onDelete: (eventId: string) => void;
}

export interface EventDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: ExtendedEventRecord | null;
  onApprove: (eventId: string) => void;
  onPublish: (eventId: string) => void;
}

export interface DeleteEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: () => void;
}
