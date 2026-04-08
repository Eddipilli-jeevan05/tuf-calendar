import { motion, useReducedMotion } from "framer-motion";

interface RangeHighlightProps {
  kind: "in-range" | "preview";
  isStartEdge: boolean;
  isEndEdge: boolean;
}

export function RangeHighlight({
  kind,
  isStartEdge,
  isEndEdge,
}: RangeHighlightProps): React.JSX.Element {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.span
      aria-hidden="true"
      initial={prefersReducedMotion ? undefined : { opacity: 0, scaleX: 0.94 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, scaleX: 1 }}
      transition={prefersReducedMotion ? undefined : { duration: 0.2, ease: "easeOut" }}
      className={[
        "absolute inset-y-1 left-0 right-0 z-0",
        kind === "preview"
          ? "bg-blue-50"
          : "bg-blue-100",
        isStartEdge ? "rounded-l-day" : "rounded-l-none",
        isEndEdge ? "rounded-r-day" : "rounded-r-none",
      ].join(" ")}
    />
  );
}
