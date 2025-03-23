
import { useMemo } from "react";

export function useTimeOptions() {
  // Generate time options only once
  const timeOptions = useMemo(() => {
    // Hours options: 1-12
    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
    
    // Minutes options: 00, 15, 30, 45
    const minutes = ["00", "15", "30", "45"];
    
    // Periods: AM, PM
    const periods = ["AM", "PM"];

    return { hours, minutes, periods };
  }, []);

  return timeOptions;
}
