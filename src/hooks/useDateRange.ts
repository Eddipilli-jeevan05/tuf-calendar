"use client";

import { isAfter, isSameDay } from "date-fns";
import { useCallback, useMemo, useState } from "react";

import { getDatesInRange } from "@/lib/dateHelpers";
import type { SelectionState } from "@/types";

interface UseDateRangeReturn {
  selectionState: SelectionState;
  startDate: Date | null;
  endDate: Date | null;
  hoveredDate: Date | null;
  previewRange: Date[];
  handleDateClick: (date: Date) => void;
  handleDateHover: (date: Date) => void;
  handleMouseLeave: () => void;
  resetSelection: () => void;
}

interface InternalRangeState {
  state: SelectionState;
  startDate: Date | null;
  endDate: Date | null;
}

const INITIAL_STATE: InternalRangeState = {
  state: "IDLE",
  startDate: null,
  endDate: null,
};

export function useDateRange(): UseDateRangeReturn {
  const [rangeState, setRangeState] = useState<InternalRangeState>(INITIAL_STATE);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const handleDateClick = useCallback((date: Date) => {
    setRangeState((prev) => {
      if (prev.state === "IDLE") {
        return {
          state: "START_SET",
          startDate: date,
          endDate: null,
        };
      }

      if (prev.state === "START_SET" && prev.startDate) {
        if (isSameDay(date, prev.startDate)) {
          return INITIAL_STATE;
        }

        if (isAfter(date, prev.startDate)) {
          return {
            state: "RANGE_SET",
            startDate: prev.startDate,
            endDate: date,
          };
        }

        return {
          state: "START_SET",
          startDate: date,
          endDate: null,
        };
      }

      return {
        state: "START_SET",
        startDate: date,
        endDate: null,
      };
    });

    setHoveredDate(null);
  }, []);

  const handleDateHover = useCallback(
    (date: Date) => {
      if (
        rangeState.state === "START_SET" &&
        rangeState.startDate &&
        isAfter(date, rangeState.startDate)
      ) {
        setHoveredDate(date);
        return;
      }

      setHoveredDate(null);
    },
    [rangeState.startDate, rangeState.state],
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredDate(null);
  }, []);

  const resetSelection = useCallback(() => {
    setRangeState(INITIAL_STATE);
    setHoveredDate(null);
  }, []);

  const previewRange = useMemo(() => {
    if (
      rangeState.state !== "START_SET" ||
      !rangeState.startDate ||
      !hoveredDate ||
      !isAfter(hoveredDate, rangeState.startDate)
    ) {
      return [];
    }

    return getDatesInRange(rangeState.startDate, hoveredDate);
  }, [hoveredDate, rangeState.startDate, rangeState.state]);

  return {
    selectionState: rangeState.state,
    startDate: rangeState.startDate,
    endDate: rangeState.endDate,
    hoveredDate,
    previewRange,
    handleDateClick,
    handleDateHover,
    handleMouseLeave,
    resetSelection,
  };
}
