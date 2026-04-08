import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function CalendarHeader({
  currentDate,
  onPrevious,
  onNext,
  onToday,
}: CalendarHeaderProps): React.JSX.Element {
  return (
    <header className="mb-4 flex items-center justify-between">
      <h2 className="text-[22px] font-semibold tracking-tight text-gray-900">
        {format(currentDate, "MMMM yyyy")}
      </h2>
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <Button
          variant="outline"
          onClick={onPrevious}
          aria-label="Go to previous month"
          className="flex items-center gap-2 rounded-md border border-gray-200/70 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          onClick={onNext}
          aria-label="Go to next month"
          className="flex items-center gap-2 rounded-md border border-gray-200/70 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          className="flex items-center gap-2 rounded-md border border-gray-200/70 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
          onClick={onToday}
        >
          Today
        </Button>
      </div>
    </header>
  );
}
