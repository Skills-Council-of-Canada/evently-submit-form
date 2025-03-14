
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, FileText, Check, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteEventDialog } from "./DeleteEventDialog";
import { ExtendedEventRecord } from "./types";

interface EventActionsProps {
  event: ExtendedEventRecord;
  onViewDetails: () => void;
  onApprove: (eventId: string) => void;
  onPublish: (eventId: string) => void;
  onDelete: (eventId: string) => void;
}

export function EventActions({
  event,
  onViewDetails,
  onApprove,
  onPublish,
  onDelete,
}: EventActionsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    onDelete(event.id);
    setDeleteDialogOpen(false);
  };

  return (
    <div className="flex justify-end gap-1">
      <Button variant="ghost" size="icon" onClick={onViewDetails}>
        <Eye className="h-4 w-4" />
        <span className="sr-only">View details</span>
      </Button>
      
      {event.contentGenerated && (
        <Button
          variant="ghost"
          size="icon"
          className="text-blue-500 hover:text-blue-700"
          asChild
        >
          <Link to={`/content-review/${event.id}`}>
            <FileText className="h-4 w-4" />
            <span className="sr-only">Review Content</span>
          </Link>
        </Button>
      )}
      
      {event.status === "pending" && (
        <Button
          variant="ghost"
          size="icon"
          className="text-blue-500 hover:text-blue-700"
          onClick={() => onApprove(event.id)}
        >
          <Check className="h-4 w-4" />
          <span className="sr-only">Approve</span>
        </Button>
      )}
      
      {event.status === "approved" && (
        <Button
          variant="ghost"
          size="icon"
          className="text-green-500 hover:text-green-700"
          onClick={() => onPublish(event.id)}
        >
          <Check className="h-4 w-4" />
          <span className="sr-only">Publish</span>
        </Button>
      )}
      
      <Button variant="ghost" size="icon" className="text-amber-500 hover:text-amber-700">
        <Edit className="h-4 w-4" />
        <span className="sr-only">Edit</span>
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="text-red-500 hover:text-red-700"
        onClick={() => setDeleteDialogOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Delete</span>
      </Button>

      <DeleteEventDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirmDelete={handleDelete}
      />
    </div>
  );
}
