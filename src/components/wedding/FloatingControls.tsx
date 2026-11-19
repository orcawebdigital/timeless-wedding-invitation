import { AnimatePresence, motion } from "framer-motion";
import { Check, Music2, Pause, Share2, Sparkles } from "lucide-react";
import { useState } from "react";

/** Persistent music, share and back-to-invitation controls. */
export function FloatingControls({
  playing,
  audioAvailable,
  onToggleMusic,
  showNav,
}: {
  playing: boolean;
  audioAvailable: boolean;
  onToggleMusic: () => void;
  showNav: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    const data = { title: document.title, text: "You're invited to our wedding!", url };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link", url);
    }
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] mx-auto w-full max-w-[480px]">
      <button
        type="button"
        onClick={share}
        aria-label="Share invitation"
        className="pointer-events-auto absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-md bg-forest/90 text-ivory shadow-[var(--shadow-soft)] backdrop-blur transition active:scale-95"
      >
        {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
      </button>
      <AnimatePresence>
        {copied && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute right-4 top-16 rounded bg-forest px-2 py-1 font-serif text-xs text-ivory"
          >
            Link copied
          </motion.span>
        )}
      </AnimatePresence>

      <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onToggleMusic}
          disabled={!audioAvailable}
          aria-pressed={playing}
          aria-label={playing ? "Pause music" : "Play music"}
          className="btn-ivory-pill pointer-events-auto disabled:opacity-60"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Music2 className="h-4 w-4" />}
          {audioAvailable ? (playing ? "Pause" : "Music") : "No music"}
        </button>

        <AnimatePresence>
          {showNav && (
            <motion.a
              href="#invitation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="btn-gold-pill pointer-events-auto"
            >
              <Sparkles className="h-4 w-4" /> To the Invitation
            </motion.a>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
