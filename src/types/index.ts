export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export type SelectionState = "IDLE" | "START_SET" | "RANGE_SET";

export type DayCellState =
  | "default"
  | "today"
  | "start"
  | "end"
  | "in-range"
  | "preview"
  | "outside-month";

export interface Note {
  id: string;
  text: string;
  createdAt: string;
}

export type NotesStore = Record<string, Note[]>;
export type NotesMap = Record<string, string>;

export interface DateRangeState {
  state: SelectionState;
  startDate: Date | null;
  endDate: Date | null;
}

export interface DayCellVisualFlags {
  state: DayCellState;
  hasNote: boolean;
  isInteractive: boolean;
  isSelected: boolean;
}
