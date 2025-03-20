
// Export all content-related functions from a central location
import { getContentTemplates } from "./contentQueries";
import { 
  approveContentTemplate, 
  rejectContentTemplate, 
  updateContentTemplate, 
  updateContentApproval 
} from "./contentUpdates";

export {
  getContentTemplates,
  approveContentTemplate,
  rejectContentTemplate,
  updateContentTemplate,
  updateContentApproval
};
