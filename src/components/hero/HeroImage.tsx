"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

interface HeroImageProps {
  month: number;
  monthLabel: string;
}

const MONTHLY_HERO_IMAGES: string[] = [
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1465189684280-6a8fa9b19a7a?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=2000&q=80",
];

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
    img.src = src;
  });
}

export function HeroImage({ month, monthLabel }: HeroImageProps): React.JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const fallbackImageUrl =
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80";
  const imageUrl = MONTHLY_HERO_IMAGES[month] ?? fallbackImageUrl;
  const [displayImageUrl, setDisplayImageUrl] = useState<string>(imageUrl);
  const nextImageUrl = useMemo(
    () => MONTHLY_HERO_IMAGES[(month + 1) % MONTHLY_HERO_IMAGES.length] ?? fallbackImageUrl,
    [month, fallbackImageUrl],
  );

  useEffect(() => {
    let isCancelled = false;

    Object.values(MONTHLY_HERO_IMAGES).forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    preloadImage(imageUrl)
      .then(() => {
        if (!isCancelled) {
          setDisplayImageUrl(imageUrl);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setDisplayImageUrl(fallbackImageUrl);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [fallbackImageUrl, imageUrl]);

  useEffect(() => {
    const img = new Image();
    img.src = nextImageUrl;
  }, [nextImageUrl]);

  return (
    <section className="group relative overflow-hidden rounded-xl">
      <div className="relative h-[220px] w-full overflow-hidden rounded-xl">
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={displayImageUrl}
            src={displayImageUrl}
            alt={monthLabel}
            initial={prefersReducedMotion ? undefined : { opacity: 0.9, scale: 1.02 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0.9, scale: 1.01 }}
            transition={prefersReducedMotion ? undefined : { duration: 0.3, ease: "easeOut" }}
            onError={() => setDisplayImageUrl(fallbackImageUrl)}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.01]"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={monthLabel}
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
            transition={prefersReducedMotion ? undefined : { duration: 0.24, ease: "easeOut" }}
            className="absolute inset-x-0 bottom-0 space-y-1 px-6 pb-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white drop-shadow-md">Calendar View</p>
            <h1 className="text-2xl font-semibold tracking-tight text-white drop-shadow-md sm:text-3xl">
              {monthLabel}
            </h1>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
