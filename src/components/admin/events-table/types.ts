
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
