import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { weddingData } from "@/config/weddingData";
import { Plaque } from "./Plaque";

type Stage = "closed" | "doors" | "curtains" | "done";

/**
 * Full-screen opening: green double doors with a gold plaque. Tapping opens the
 * doors in 3D, then the cream curtains part to reveal the invitation behind.
 */
export function OpeningSequence({ onOpen, onDone }: { onOpen: () => void; onDone: () => void }) {
  const [stage, setStage] = useState<Stage>("closed");
  const reduce = useReducedMotion();
  const { door, curtains } = weddingData.images;

  useEffect(() => {
    if (stage === "done") return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [stage]);

  const open = () => {
    if (stage !== "closed") return;
    onOpen();
    setStage("doors");
  };

  useEffect(() => {
    if (stage === "doors") {
      const t = setTimeout(() => setStage("curtains"), reduce ? 300 : 2300);
      return () => clearTimeout(t);
    }
    if (stage === "curtains") {
      const t = setTimeout(() => {
        setStage("done");
        onDone();
      }, reduce ? 300 : 3000);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [stage, reduce, onDone]);

  const doorEase = [0.65, 0, 0.35, 1] as const;

  return (
    <AnimatePresence>
      {stage !== "done" && (
        <motion.div
          key="opening"
          className="fixed inset-0 z-50 flex justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative h-full w-full max-w-[480px] overflow-hidden">
            {/* Curtains sit behind the doors */}
            <div className="absolute inset-0 flex">
              {(["left", "right"] as const).map((side) => (
                <motion.div
                  key={side}
                  className="relative h-full w-1/2"
                  style={{
                    backgroundImage: `url(${curtains})`,
                    backgroundSize: "200% 100%",
                    backgroundPosition: side === "left" ? "left center" : "right center",
                    transformOrigin: side === "left" ? "left center" : "right center",
                  }}
                  initial={false}
                  animate={
                    stage === "curtains"
                      ? { x: side === "left" ? "-92%" : "92%", scaleX: 0.55 }
                      : { x: 0, scaleX: 1 }
                  }
                  transition={{ duration: 2.8, ease: [0.6, 0.05, 0.3, 1] }}
                />
              ))}
            </div>

            {/* Doors */}
            <div className="absolute inset-0 flex" style={{ perspective: "1800px" }}>
              {(["left", "right"] as const).map((side) => (
                <motion.button
                  key={side}
                  type="button"
                  onClick={open}
                  aria-label="Open the invitation"
                  className="relative h-full w-1/2 cursor-pointer"
                  style={{
                    backgroundImage: `url(${door})`,
                    backgroundSize: "200% 100%",
                    backgroundPosition: side === "left" ? "left center" : "right center",
                    transformOrigin: side === "left" ? "left center" : "right center",
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                    boxShadow:
                      side === "left"
                        ? "inset -14px 0 24px -14px oklch(0.2 0.03 130 / 0.55)"
                        : "inset 14px 0 24px -14px oklch(0.2 0.03 130 / 0.55)",
                  }}
                  initial={false}
                  animate={
                    stage === "closed"
                      ? { rotateY: 0, opacity: 1 }
                      : { rotateY: side === "left" ? -110 : 110, opacity: [1, 1, 0] }
                  }
                  transition={{ duration: 2, delay: 0.35, ease: doorEase, opacity: { duration: 2, times: [0, 0.8, 1], delay: 0.35 } }}
                >
                  {/* Gold rope half on each door edge */}
                  <span
                    className="absolute top-0 h-full w-[2px]"
                    style={{
                      [side === "left" ? "right" : "left"]: 0,
                      background: "var(--gradient-gold)",
                    }}
                  />
                </motion.button>
              ))}
            </div>

            {/* Plaque */}
            <AnimatePresence>
              {stage === "closed" && (
                <motion.button
                  type="button"
                  onClick={open}
                  className="absolute left-1/2 top-1/2 z-10 h-[230px] w-[176px] -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.25, filter: "blur(4px)" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  aria-label={weddingData.plaqueText}
                >
                  <span className="block h-full w-full animate-plaque">
                    <Plaque label={weddingData.plaqueText} />
                  </span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
