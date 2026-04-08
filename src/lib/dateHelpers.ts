import {
  eachDayOfInterval,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isWithinInterval,
} from "date-fns";

import type {
  DayCellVisualFlags,
  SelectionState,
} from "@/types";

interface DayCellStateInput {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasNote: boolean;
  selectionState: SelectionState;
  startDate: Date | null;
  endDate: Date | null;
  hoveredDate: Date | null;
}

export function formatDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function normalizeRange(start: Date, end: Date): { start: Date; end: Date } {
  if (isAfter(start, end)) {
    return { start: end, end: start };
  }

  return { start, end };
}

export function getDatesInRange(start: Date, end: Date): Date[] {
  const normalized = normalizeRange(start, end);

  return eachDayOfInterval({ start: normalized.start, end: normalized.end });
}

export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  const normalized = normalizeRange(start, end);

  return isWithinInterval(date, {
    start: normalized.start,
    end: normalized.end,
  });
}

export function shouldShowPreview(
  selectionState: SelectionState,
  startDate: Date | null,
  hoveredDate: Date | null,
): boolean {
  return (
    selectionState === "START_SET" &&
    startDate !== null &&
    hoveredDate !== null &&
    isAfter(hoveredDate, startDate)
  );
}

export function getDayCellState(input: DayCellStateInput): DayCellVisualFlags {
  const {
    date,
    isCurrentMonth,
    isToday,
    hasNote,
    selectionState,
    startDate,
    endDate,
    hoveredDate,
  } = input;

  if (!isCurrentMonth) {
    return {
      state: "outside-month",
      hasNote,
      isInteractive: true,
      isSelected: false,
    };
  }

  if (startDate && isSameDay(date, startDate)) {
    return {
      state: "start",
      hasNote,
      isInteractive: true,
      isSelected: true,
    };
  }

  if (endDate && isSameDay(date, endDate)) {
    return {
      state: "end",
      hasNote,
      isInteractive: true,
      isSelected: true,
    };
  }

  if (startDate && endDate && isDateInRange(date, startDate, endDate)) {
    return {
      state: "in-range",
      hasNote,
      isInteractive: true,
      isSelected: true,
    };
  }

  if (shouldShowPreview(selectionState, startDate, hoveredDate) && startDate && hoveredDate) {
    if (
      isDateInRange(date, startDate, hoveredDate) &&
      !isSameDay(date, startDate) &&
      !isSameDay(date, hoveredDate)
    ) {
      return {
        state: "preview",
        hasNote,
        isInteractive: true,
        isSelected: false,
      };
    }
  }

  if (isToday) {
    return {
      state: "today",
      hasNote,
      isInteractive: true,
      isSelected: false,
    };
  }

  return {
    state: "default",
    hasNote,
    isInteractive: true,
    isSelected: false,
  };
}

export function isDateAfterStart(
  selectionState: SelectionState,
  startDate: Date | null,
  date: Date,
): boolean {
  return selectionState === "START_SET" && startDate !== null && isAfter(date, startDate);
}

export function isDateBeforeOrSameStart(
  selectionState: SelectionState,
  startDate: Date | null,
  date: Date,
): boolean {
  return (
    selectionState === "START_SET" &&
    startDate !== null &&
    (isBefore(date, startDate) || isSameDay(date, startDate))
  );
}
