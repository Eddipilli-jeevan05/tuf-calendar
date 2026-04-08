"use client";

import { eachDayOfInterval } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";

import { formatDateKey, normalizeRange } from "@/lib/dateHelpers";
import type { Note, NotesStore } from "@/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const STORAGE_KEY = "calendar-notes";
const WRITE_DEBOUNCE_MS = 300;

interface UseNotesReturn {
  notes: Record<string, Note[]>;
  addNote: (dateKey: string, text: string) => void;
  addNoteToRange: (start: Date, end: Date, text: string) => void;
  deleteNote: (dateKey: string, noteId: string) => void;
  getNotesForDate: (date: Date) => Note[];
  getNotesForRange: (start: Date, end: Date) => Map<string, Note[]>;
  hasNotes: (date: Date) => boolean;
}

export function useNotes(): UseNotesReturn {
  const { value: storedNotes, setValue: setStoredNotes } =
    useLocalStorage<NotesStore>(STORAGE_KEY, {});
  const [notes, setNotes] = useState<NotesStore>(storedNotes);

  useEffect(() => {
    setNotes(storedNotes);
  }, [storedNotes]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setStoredNotes(notes);
    }, WRITE_DEBOUNCE_MS);

    return () => window.clearTimeout(timeout);
  }, [notes, setStoredNotes]);

  const addNote = useCallback((dateKey: string, text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) {
      return;
    }

    const sharedId = crypto.randomUUID();
    const nextNote: Note = {
      id: sharedId,
      text: trimmedText,
      createdAt: new Date().toISOString(),
    };

    setNotes((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] ?? []), nextNote],
    }));
  }, []);

  const addNoteToRange = useCallback((start: Date, end: Date, text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) {
      return;
    }

    const normalized = normalizeRange(start, end);
    const dates = eachDayOfInterval({ start: normalized.start, end: normalized.end });
    const sharedId = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    setNotes((prev) => {
      const next = { ...prev };

      dates.forEach((date) => {
        const key = formatDateKey(date);
        const note: Note = {
          id: sharedId,
          text: trimmedText,
          createdAt,
        };

        next[key] = [...(next[key] ?? []), note];
      });

      return next;
    });
  }, []);

  const deleteNote = useCallback((_dateKey: string, noteId: string) => {
    setNotes((prev) => {
      const next: NotesStore = {};

      Object.entries(prev).forEach(([key, list]) => {
        const filtered = list.filter((note) => note.id !== noteId);
        if (filtered.length > 0) {
          next[key] = filtered;
        }
      });

      return next;
    });
  }, []);

  const getNotesForDate = useCallback(
    (date: Date) => {
      const key = formatDateKey(date);
      return notes[key] ?? [];
    },
    [notes],
  );

  const getNotesForRange = useCallback(
    (start: Date, end: Date) => {
      const normalized = normalizeRange(start, end);
      const dates = eachDayOfInterval({
        start: normalized.start,
        end: normalized.end,
      });

      const grouped = new Map<string, Note[]>();
      dates.forEach((date) => {
        const key = formatDateKey(date);
        const list = notes[key] ?? [];
        if (list.length > 0) {
          grouped.set(key, list);
        }
      });

      return grouped;
    },
    [notes],
  );

  const hasNotes = useCallback(
    (date: Date) => {
      const key = formatDateKey(date);
      return (notes[key] ?? []).length > 0;
    },
    [notes],
  );

  const stableNotes = useMemo(() => notes, [notes]);

  return {
    notes: stableNotes,
    addNote,
    addNoteToRange,
    deleteNote,
    getNotesForDate,
    getNotesForRange,
    hasNotes,
  };
}
