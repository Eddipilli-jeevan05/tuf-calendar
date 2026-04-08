import { format, isSameDay } from "date-fns";
import { motion } from "framer-motion";
import { useCallback, useMemo, useRef } from "react";

import { DayCell } from "@/components/calendar/DayCell";
import { formatDateKey, getDayCellState } from "@/lib/dateHelpers";
import type { CalendarDay, SelectionState } from "@/types";

interface CalendarGridProps {
  days: CalendarDay[];
  selectionState: SelectionState;
  startDate: Date | null;
  endDate: Date | null;
  hoveredDate: Date | null;
  previewRange: Date[];
  noteCounts: Record<string, number>;
  onDateClick: (date: Date) => void;
  onDateHover: (date: Date) => void;
  onMouseLeave: () => void;
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarGrid({
  days,
  selectionState,
  startDate,
  endDate,
  hoveredDate,
  previewRange,
  noteCounts,
  onDateClick,
  onDateHover,
  onMouseLeave,
}: CalendarGridProps): React.JSX.Element {
  const cellRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const previewSet = useMemo(() => {
    return new Set(previewRange.map((date) => formatDateKey(date)));
  }, [previewRange]);

  const rangeSet = useMemo(() => {
    if (!startDate || !endDate) {
      return new Set<string>();
    }

    const set = new Set<string>();
    days.forEach((day) => {
      const key = formatDateKey(day.date);
      const state = getDayCellState({
        date: day.date,
        isCurrentMonth: day.isCurrentMonth,
        isToday: day.isToday,
        hasNote: false,
        selectionState,
        startDate,
        endDate,
        hoveredDate,
      }).state;

      if (state === "in-range" || state === "start" || state === "end") {
        set.add(key);
      }
    });

    return set;
  }, [days, endDate, hoveredDate, selectionState, startDate]);

  const registerCell = useCallback((index: number, node: HTMLButtonElement | null) => {
    cellRefs.current[index] = node;
  }, []);

  const handleMoveFocus = useCallback((currentIndex: number, key: string) => {
    let nextIndex = currentIndex;

    if (key === "ArrowRight") {
      nextIndex = Math.min(currentIndex + 1, days.length - 1);
    } else if (key === "ArrowLeft") {
      nextIndex = Math.max(currentIndex - 1, 0);
    } else if (key === "ArrowDown") {
      nextIndex = Math.min(currentIndex + 7, days.length - 1);
    } else if (key === "ArrowUp") {
      nextIndex = Math.max(currentIndex - 7, 0);
    }

    cellRefs.current[nextIndex]?.focus();
  }, [days.length]);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-0"
    >
      <div className="mb-2 grid grid-cols-7 justify-items-center gap-1 sm:gap-1.5" aria-hidden="true">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="flex h-7 items-center justify-center text-[11px] font-medium uppercase tracking-wider text-gray-400"
          >
            {label}
          </div>
        ))}
      </div>

      <div
        role="grid"
        aria-label="Calendar"
        onMouseLeave={onMouseLeave}
        className="grid grid-cols-7 justify-items-center gap-1 sm:gap-1.5"
      >
        {days.map((day, index) => {
          const dayKey = formatDateKey(day.date);
          const noteCount = noteCounts[dayKey] ?? 0;
          const visual = getDayCellState({
            date: day.date,
            isCurrentMonth: day.isCurrentMonth,
            isToday: day.isToday,
            hasNote: noteCount > 0,
            selectionState,
            startDate,
            endDate,
            hoveredDate,
          });

          const prevDay = index > 0 ? days[index - 1] : undefined;
          const nextDay = index < days.length - 1 ? days[index + 1] : undefined;
          const prevKey = prevDay ? formatDateKey(prevDay.date) : "";
          const nextKey = nextDay ? formatDateKey(nextDay.date) : "";

          const isRangeCurrent = rangeSet.has(dayKey);
          const isRangeEdgeStart = isRangeCurrent && !rangeSet.has(prevKey);
          const isRangeEdgeEnd = isRangeCurrent && !rangeSet.has(nextKey);

          const isPreviewCurrent = previewSet.has(dayKey);
          const isPreviewEdgeStart = isPreviewCurrent && !previewSet.has(prevKey);
          const isPreviewEdgeEnd = isPreviewCurrent && !previewSet.has(nextKey);

          return (
            <div key={dayKey} role="row" className="contents">
              <DayCell
                date={day.date}
                index={index}
                label={format(day.date, "MMMM d, yyyy")}
                state={visual.state}
                isCurrentMonth={day.isCurrentMonth}
                isToday={day.isToday}
                hasNote={visual.hasNote}
                isPreviewEdgeStart={isPreviewEdgeStart}
                isPreviewEdgeEnd={isPreviewEdgeEnd}
                isRangeEdgeStart={isRangeEdgeStart || (startDate ? isSameDay(startDate, day.date) : false)}
                isRangeEdgeEnd={isRangeEdgeEnd || (endDate ? isSameDay(endDate, day.date) : false)}
                noteCount={noteCount}
                onClickDate={onDateClick}
                onHoverDate={onDateHover}
                onMoveFocus={handleMoveFocus}
                registerCell={registerCell}
              />
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}
