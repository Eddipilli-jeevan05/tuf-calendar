import {
  addDays,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import type { CalendarDay } from "@/types";

const CALENDAR_GRID_SIZE = 42;

export function generateCalendarDays(
  currentDate: Date,
  weekStartsOn: 0 | 1 = 0,
): CalendarDay[] {
  const monthStart = startOfMonth(currentDate);
  const gridStart = startOfWeek(monthStart, { weekStartsOn });

  // Always render 6 rows to avoid layout shifts between months.
  return Array.from({ length: CALENDAR_GRID_SIZE }, (_, index) => {
    const date = addDays(gridStart, index);

    return {
      date,
      isCurrentMonth: isSameMonth(date, monthStart),
      isToday: isSameDay(date, new Date()),
    };
  });
}
