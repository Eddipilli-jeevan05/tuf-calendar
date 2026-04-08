"use client";

import { format, startOfMonth } from "date-fns";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";

import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { HeroImage } from "@/components/hero/HeroImage";
import { NotesPanel } from "@/components/notes/NotesPanel";
import { useCalendar } from "@/hooks/useCalendar";
import { useDateRange } from "@/hooks/useDateRange";
import { formatDateKey, getDatesInRange } from "@/lib/dateHelpers";
import type { NotesMap } from "@/types";

const NOTES_STORAGE_KEY = "calendar-notes";

export function Calendar(): React.JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const [monthDirection, setMonthDirection] = useState<1 | -1>(1);
  const { currentDate, calendarDays, goToNextMonth, goToPreviousMonth, goToToday } =
    useCalendar();
  const {
    selectionState,
    startDate,
    endDate,
    hoveredDate,
    previewRange,
    handleDateClick,
    handleDateHover,
    handleMouseLeave,
    resetSelection,
  } = useDateRange();
  const [notes, setNotes] = useState<NotesMap>({});

  const noteCounts = useMemo(
    () => Object.fromEntries(Object.keys(notes).map((dateKey) => [dateKey, 1])),
    [notes],
  );

  const isPanelOpen = selectionState !== "IDLE" && startDate !== null;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.localStorage.getItem(NOTES_STORAGE_KEY);
    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as Record<string, unknown>;
      const normalized = Object.fromEntries(
        Object.entries(parsed).filter(
          ([key, value]) => typeof key === "string" && typeof value === "string" && value.trim().length > 0,
        ),
      ) as NotesMap;
      setNotes(normalized);
    } catch {
      setNotes({});
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const selectedDateKeys = useMemo(() => {
    if (startDate && endDate) {
      return getDatesInRange(startDate, endDate).map((date) => formatDateKey(date));
    }

    if (startDate) {
      return [formatDateKey(startDate)];
    }

    return [] as string[];
  }, [endDate, startDate]);

  const selectedDateKey = useMemo(() => {
    if (endDate) {
      return formatDateKey(endDate);
    }

    if (startDate) {
      return formatDateKey(startDate);
    }

    return "";
  }, [endDate, startDate]);

  const currentNote = useMemo(() => notes[selectedDateKey] ?? "", [notes, selectedDateKey]);

  const handleSaveNote = useCallback(
    (text: string) => {
      if (selectedDateKeys.length === 0) {
        return;
      }

      const trimmed = text.trim();

      setNotes((prev) => {
        const next = { ...prev };

        if (!trimmed) {
          selectedDateKeys.forEach((dateKey) => {
            delete next[dateKey];
          });
          return next;
        }

        selectedDateKeys.forEach((dateKey) => {
          next[dateKey] = trimmed;
        });

        return next;
      });
    },
    [selectedDateKeys],
  );

  const selectionTitle = useMemo(() => {
    if (!startDate) {
      return "Select a date";
    }

    if (endDate) {
      return `${format(startDate, "MMM d, yyyy")} - ${format(endDate, "MMM d, yyyy")}`;
    }

    return format(startDate, "EEEE, MMMM d, yyyy");
  }, [endDate, startDate]);

  const monthLabel = useMemo(() => format(currentDate, "MMMM yyyy"), [currentDate]);
  const currentMonth = useMemo(() => format(currentDate, "yyyy-MM"), [currentDate]);

  const handlePreviousMonth = useCallback(() => {
    setMonthDirection(-1);
    goToPreviousMonth();
  }, [goToPreviousMonth]);

  const handleNextMonth = useCallback(() => {
    setMonthDirection(1);
    goToNextMonth();
  }, [goToNextMonth]);

  const handleToday = useCallback(() => {
    const todayMonth = startOfMonth(new Date());

    if (todayMonth > currentDate) {
      setMonthDirection(1);
    } else if (todayMonth < currentDate) {
      setMonthDirection(-1);
    }

    goToToday();
  }, [currentDate, goToToday]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        resetSelection();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [resetSelection]);

  const standoutPreview = useMemo(() => {
    // Enhanced range animation feature: keep preview list stable for smooth transitions.
    if (previewRange.length > 0) {
      return previewRange;
    }

    if (!startDate || !endDate) {
      return [];
    }

    return getDatesInRange(startDate, endDate);
  }, [endDate, previewRange, startDate]);

  return (
    <article className="w-full space-y-6">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`hero-${currentMonth}`}
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 6 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
          transition={prefersReducedMotion ? undefined : { duration: 0.22, ease: "easeOut" }}
        >
          <HeroImage month={currentDate.getMonth()} monthLabel={monthLabel} />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`calendar-${currentMonth}`}
          initial={prefersReducedMotion ? undefined : { opacity: 0, x: monthDirection === 1 ? 40 : -40 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0, x: monthDirection === 1 ? -40 : 40 }}
          transition={prefersReducedMotion ? undefined : { duration: 0.25, ease: "easeOut" }}
          className="grid min-h-0 grid-cols-1 gap-6 md:grid-cols-3"
        >
        <aside className="order-3 min-h-0 md:order-none">
          <NotesPanel
            isOpen={isPanelOpen}
            title={selectionTitle}
            currentNote={currentNote}
            onSaveNote={handleSaveNote}
            onClearSelection={resetSelection}
          />
        </aside>

        <section className="order-2 min-h-0 rounded-xl border border-gray-200/60 bg-white/90 p-6 shadow-[0_6px_24px_rgba(0,0,0,0.05)] backdrop-blur-sm transition-shadow duration-200 hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)] md:order-none md:col-span-2">
          <CalendarHeader
            currentDate={currentDate}
            onPrevious={handlePreviousMonth}
            onNext={handleNextMonth}
            onToday={handleToday}
          />
          <CalendarGrid
            days={calendarDays}
            selectionState={selectionState}
            startDate={startDate}
            endDate={endDate}
            hoveredDate={hoveredDate}
            previewRange={standoutPreview}
            noteCounts={noteCounts}
            onDateClick={handleDateClick}
            onDateHover={handleDateHover}
            onMouseLeave={handleMouseLeave}
          />
        </section>
        </motion.div>
      </AnimatePresence>
    </article>
  );
}
