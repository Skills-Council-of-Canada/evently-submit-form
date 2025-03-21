
// This file is maintained for backwards compatibility
// New code should import from @/services/events directly
import { 
  EventRecord,
  getAllEvents,
  submitEvent,
  checkEventExists,
  updateEventStatus
} from './events';

export type { EventRecord };
export { getAllEvents, submitEvent, checkEventExists, updateEventStatus };
