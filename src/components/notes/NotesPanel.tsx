import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface NotesPanelProps {
  isOpen: boolean;
  title: string;
  currentNote: string;
  onSaveNote: (text: string) => void;
  onClearSelection: () => void;
}

export function NotesPanel({
  isOpen,
  title,
  currentNote,
  onSaveNote,
  onClearSelection,
}: NotesPanelProps): React.JSX.Element {
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setDraft("");
      return;
    }

    setDraft(currentNote);
  }, [currentNote, isOpen]);

  const hasSavedNote = useMemo(() => currentNote.trim().length > 0, [currentNote]);

  const handleSubmit = () => {
    onSaveNote(draft);
  };

  if (!isOpen) {
    return (
      <aside
        className="h-full min-h-[220px] rounded-xl border border-gray-200/50 bg-white/70 p-4 backdrop-blur-sm md:min-h-0"
        aria-live="polite"
      >
        <h2 className="mb-3 text-lg font-medium text-gray-900">Notes</h2>
        <div className="rounded-lg border border-dashed border-gray-200/60 bg-white p-4">
          <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">Pick a date to start planning.</p>
          <p className="mt-1 text-sm text-gray-500 leading-relaxed">
            Your saved notes will appear here by date.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.aside
        key="notes-open"
        initial={prefersReducedMotion ? undefined : { opacity: 0, x: 20, y: 8 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
        exit={prefersReducedMotion ? undefined : { opacity: 0, x: 20, y: 8 }}
        transition={prefersReducedMotion ? undefined : { duration: 0.2, ease: "easeOut" }}
        className="flex h-full min-h-[220px] flex-col rounded-xl border border-gray-200/50 bg-white/70 p-4 backdrop-blur-sm md:min-h-0"
        aria-live="polite"
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Notes</h2>
            <p className="mt-1 text-sm text-gray-500 leading-relaxed">{title}</p>
          </div>
          <Button variant="ghost" className="text-gray-500" onClick={onClearSelection}>
            Clear
          </Button>
        </div>

        <div className="mb-4 space-y-3">
          <Textarea
            ref={inputRef}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Add a note for this selection..."
            aria-label="Add note"
          />
          <Button onClick={handleSubmit} className="w-full sm:w-auto">
            Save
          </Button>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={title}
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 6 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
            transition={prefersReducedMotion ? undefined : { duration: 0.2, ease: "easeOut" }}
            className="flex-1 space-y-3 overflow-y-auto pr-1"
          >
            {!hasSavedNote && (
              <p className="rounded-lg border border-dashed border-gray-200/60 bg-white p-4 text-sm text-gray-500 leading-relaxed">
                No notes yet. Add your first note for this selection.
              </p>
            )}

            {hasSavedNote && (
              <section className="rounded-lg border border-gray-200/60 bg-white p-3">
                <h3 className="text-caption mb-2 text-gray-500">Saved note</h3>
                <p className="whitespace-pre-wrap text-sm text-gray-500 leading-relaxed">{currentNote}</p>
              </section>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.aside>
    </AnimatePresence>
  );
}
