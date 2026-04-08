import { format, isSameDay } from "date-fns";
import { motion, useReducedMotion } from "framer-motion";
import { memo, useCallback } from "react";

import { NoteIndicator } from "@/components/notes/NoteIndicator";
import { RangeHighlight } from "@/components/calendar/RangeHighlight";
import type { DayCellState } from "@/types";
import { cn } from "@/lib/utils";

interface DayCellProps {
  date: Date;
  index: number;
  label: string;
  state: DayCellState;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasNote: boolean;
  isPreviewEdgeStart: boolean;
  isPreviewEdgeEnd: boolean;
  isRangeEdgeStart: boolean;
  isRangeEdgeEnd: boolean;
  noteCount: number;
  onClickDate: (date: Date) => void;
  onHoverDate: (date: Date) => void;
  onMoveFocus: (currentIndex: number, key: string) => void;
  registerCell: (index: number, node: HTMLButtonElement | null) => void;
}

function DayCellComponent({
  date,
  index,
  label,
  state,
  isCurrentMonth,
  isToday,
  hasNote,
  isPreviewEdgeStart,
  isPreviewEdgeEnd,
  isRangeEdgeStart,
  isRangeEdgeEnd,
  noteCount,
  onClickDate,
  onHoverDate,
  onMoveFocus,
  registerCell,
}: DayCellProps): React.JSX.Element {
  const prefersReducedMotion = useReducedMotion();

  const handleClick = useCallback(() => {
    onClickDate(date);
  }, [date, onClickDate]);

  const handleMouseEnter = useCallback(() => {
    onHoverDate(date);
  }, [date, onHoverDate]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (
        event.key === "ArrowRight" ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowUp" ||
        event.key === "ArrowDown"
      ) {
        event.preventDefault();
        onMoveFocus(index, event.key);
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onClickDate(date);
      }
    },
    [date, index, onClickDate, onMoveFocus],
  );

  const setButtonRef = useCallback(
    (node: HTMLButtonElement | null) => {
      registerCell(index, node);
    },
    [index, registerCell],
  );

  const isRangeBody = state === "in-range";
  const isPreviewBody = state === "preview";
  const isStart = state === "start";
  const isEnd = state === "end";
  const isTodayDefault = state === "today";

  return (
    <div role="gridcell" aria-selected={isStart || isEnd || isRangeBody} className="relative p-0.5">
      {(isRangeBody || isPreviewBody) && (
        <RangeHighlight
          kind={isPreviewBody ? "preview" : "in-range"}
          isStartEdge={isPreviewBody ? isPreviewEdgeStart : isRangeEdgeStart}
          isEndEdge={isPreviewBody ? isPreviewEdgeEnd : isRangeEdgeEnd}
        />
      )}
      <motion.button
        ref={setButtonRef}
        type="button"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onKeyDown={handleKeyDown}
        whileHover={undefined}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.92 }}
        transition={prefersReducedMotion ? undefined : { duration: 0.18, ease: "easeOut" }}
        className={cn(
          "relative z-10 flex h-9 w-9 min-h-[36px] min-w-[36px] items-center justify-center rounded-md p-0.5 text-[11px] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 hover:scale-[1.03] sm:h-10 sm:w-10 sm:text-xs lg:h-11 lg:w-11",
          isCurrentMonth
            ? "text-gray-800"
            : "text-gray-400",
          (state === "default" || state === "today") && "hover:bg-gray-200",
          isTodayDefault && "ring-1 ring-blue-400 text-blue-600",
          isRangeBody && "bg-blue-100 text-blue-700",
          isPreviewBody && "bg-blue-50 text-blue-600",
          (isStart || isEnd) && "scale-100 rounded-md bg-blue-600 text-white shadow-sm",
        )}
        aria-label={`${label}${isToday ? ", today" : ""}${isStart || isEnd || isRangeBody ? ", selected" : ""}${hasNote ? `, has ${noteCount} notes` : ""}`}
      >
        <span className={cn("relative z-10 text-[11px] font-medium sm:text-xs", isCurrentMonth ? "text-gray-800" : "text-gray-400", (isStart || isEnd) && "text-white", isTodayDefault && "font-semibold")}>{format(date, "d")}</span>
        {isToday && state === "today" && !isRangeBody && !isPreviewBody && !isStart && !isEnd && (
          <span aria-hidden="true" className="absolute bottom-1 h-0.5 w-4 rounded-full bg-blue-500" />
        )}
        {hasNote && !isStart && !isEnd && !isRangeBody && <NoteIndicator />}
      </motion.button>
    </div>
  );
}

export const DayCell = memo(DayCellComponent, (prev, next) => {
  return (
    prev.state === next.state &&
    prev.hasNote === next.hasNote &&
    prev.noteCount === next.noteCount &&
    prev.isCurrentMonth === next.isCurrentMonth &&
    prev.isToday === next.isToday &&
    prev.isPreviewEdgeStart === next.isPreviewEdgeStart &&
    prev.isPreviewEdgeEnd === next.isPreviewEdgeEnd &&
    prev.isRangeEdgeStart === next.isRangeEdgeStart &&
    prev.isRangeEdgeEnd === next.isRangeEdgeEnd &&
    isSameDay(prev.date, next.date)
  );
});
