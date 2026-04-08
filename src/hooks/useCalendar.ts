"use client";

import { addMonths, startOfMonth, subMonths } from "date-fns";
import { useCallback, useMemo, useState } from "react";

import { generateCalendarDays } from "@/lib/calendar";
import type { CalendarDay } from "@/types";

interface UseCalendarReturn {
  currentDate: Date;
  calendarDays: CalendarDay[];
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  goToToday: () => void;
}

export function useCalendar(weekStartsOn: 0 | 1 = 0): UseCalendarReturn {
  const [currentDate, setCurrentDate] = useState<Date>(startOfMonth(new Date()));

  const calendarDays = useMemo(
    () => generateCalendarDays(currentDate, weekStartsOn),
    [currentDate, weekStartsOn],
  );

  const goToPreviousMonth = useCallback(() => {
    setCurrentDate((prev) => startOfMonth(subMonths(prev, 1)));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentDate((prev) => startOfMonth(addMonths(prev, 1)));
  }, []);

  const goToToday = useCallback(() => {
    setCurrentDate(startOfMonth(new Date()));
  }, []);

  return {
    currentDate,
    calendarDays,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
  };
}
