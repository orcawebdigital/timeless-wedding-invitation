import { AnimatePresence, motion } from "framer-motion";
import { CalendarHeart, Heart } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { weddingData } from "@/config/weddingData";
import { buildICS, downloadICS } from "@/lib/calendar";
import { HeartDivider, Reveal, Section } from "./Ornaments";

const HEART_PATH =
  "M50 88C20 66 0 48 0 26 0 11 11 0 25 0c11 0 20 6 25 15C55 6 64 0 75 0c14 0 25 11 25 26 0 22-20 40-50 62z";
const REVEAL_AT = 0.45;

export function saveTheDate() {
  const d = weddingData;
  downloadICS(
    `${d.couple.groom}-${d.couple.bride}-wedding.ics`,
    buildICS({
      title: `${d.couple.groom} & ${d.couple.bride} Wedding`,
      startISO: d.weddingDateISO,
      endISO: d.weddingEndISO,
      location: `${d.venue.name}, ${d.venue.address}`,
      description: d.heroLine,
      uid: `${d.couple.groom}-${d.couple.bride}`.toLowerCase(),
    }),
  );
}

/** Heart-shaped sage scratch card hiding the wedding date. */
export function ScratchReveal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const totalPixels = useRef(1);
  const moves = useRef(0);
  const [revealed, setRevealed] = useState(false);
  const [burst, setBurst] = useState(0);

  // Paint the sage glitter surface inside the heart.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const paint = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const sx = canvas.width / 100;
      const sy = canvas.height / 90;
      ctx.setTransform(sx, 0, 0, sy, 0, 0);
      const grad = ctx.createRadialGradient(40, 30, 5, 50, 45, 70);
      grad.addColorStop(0, "#a3ad86");
      grad.addColorStop(0.55, "#7d8862");
      grad.addColorStop(1, "#5c6744");
      ctx.fillStyle = grad;
      ctx.fill(new Path2D(HEART_PATH));
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      // glitter
      ctx.globalCompositeOperation = "source-atop";
      for (let i = 0; i < 900; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const r = Math.random() * 1.4 * dpr;
        ctx.fillStyle = `rgba(245,240,220,${0.15 + Math.random() * 0.55})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let count = 0;
      for (let i = 3; i < data.length; i += 32) if ((data[i] ?? 0) > 0) count++;
      totalPixels.current = Math.max(count, 1);
    };
    paint();
  }, []);

  const finish = useCallback(() => {
    setRevealed(true);
    setBurst((b) => b + 1);
  }, []);

  const checkProgress = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let remaining = 0;
    for (let i = 3; i < data.length; i += 32) if ((data[i] ?? 0) > 0) remaining++;
    const cleared = 1 - remaining / totalPixels.current;
    if (cleared >= REVEAL_AT) finish();
  };

  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const scratch = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || revealed) return;
    const canvas = e.currentTarget;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const p = point(e);
    const from = last.current ?? p;
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = canvas.width * 0.14;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(p.x + 0.1, p.y + 0.1);
    ctx.stroke();
    ctx.globalCompositeOperation = "source-over";
    last.current = p;
    if (++moves.current % 6 === 0) checkProgress();
  };

  const d = weddingData;

  return (
    <Section id="reveal" className="text-center">
      <div className="relative mb-8 h-[4.2rem]">
        <AnimatePresence mode="wait">
          <motion.h2
            key={revealed ? "after" : "before"}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.6 }}
            className="font-script text-[2.6rem] leading-[1.1] text-sage"
          >
            {revealed ? d.scratch.revealedTitle : d.scratch.title}
          </motion.h2>
        </AnimatePresence>
        <HeartDivider className="mt-3" />
      </div>

      <Reveal>
        <div className="relative mx-auto aspect-[100/90] w-[min(250px,100%)]" style={{ filter: "drop-shadow(var(--shadow-heart))" }}>
          {/* Hidden card */}
          <div className="heart-mask absolute inset-0 flex flex-col items-center bg-ivory pt-[17%] text-center">
            <p className="font-script text-[1.65rem] leading-none text-sage">{d.scratch.invitedLabel}</p>
            <p className="mt-2 font-caps text-[0.55rem] text-sage">{d.scratch.hiddenHeading}</p>
            <p className="mt-1 font-serif text-lg font-bold text-ink">{d.dateLabel}</p>
            <p className="font-serif text-sm italic text-ink/80">{d.dayLabel}</p>
            <p className="font-serif text-xs text-ink/70">{d.timeLabel}</p>
          </div>

          <motion.canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full cursor-grab touch-none"
            aria-label="Scratch the heart to reveal the wedding date"
            role="img"
            animate={revealed ? { opacity: 0, scale: 1.06 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            style={{ pointerEvents: revealed ? "none" : "auto" }}
            onPointerDown={(e: React.PointerEvent<HTMLCanvasElement>) => {
              drawing.current = true;
              last.current = null;
              e.currentTarget.setPointerCapture(e.pointerId);
              scratch(e);
            }}
            onPointerMove={scratch}
            onPointerUp={() => {
              drawing.current = false;
              last.current = null;
              checkProgress();
            }}
            onPointerCancel={() => {
              drawing.current = false;
            }}
          />

          {!revealed && (
            <p className="pointer-events-none absolute inset-x-0 top-[38%] font-serif text-sm italic text-ivory/90">
              Scratch here
            </p>
          )}

          <Celebration key={burst} active={burst > 0} />
        </div>
      </Reveal>

      <Reveal delay={0.15} className="mt-10">
        <button type="button" onClick={saveTheDate} className="btn-sage">
          <CalendarHeart className="h-4 w-4" /> Save the Date
        </button>
      </Reveal>
    </Section>
  );
}

/** Confetti, leaves and little hearts bursting from the heart card. */
function Celebration({ active }: { active: boolean }) {
  if (!active) return null;
  const pieces = Array.from({ length: 34 }, (_, i) => i);
  const palette = ["bg-gold", "bg-sage", "bg-ivory", "bg-blush", "bg-gold-light"];
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {pieces.map((i) => {
        const angle = (i / pieces.length) * Math.PI * 2;
        const dist = 90 + ((i * 53) % 90);
        const x = Math.cos(angle) * dist;
        const y = Math.sin(angle) * dist * 0.8;
        return (
          <motion.span
            key={i}
            className={`absolute left-1/2 top-1/2 block ${palette[i % palette.length]}`}
            style={{ width: i % 4 ? 6 : 8, height: i % 4 ? 10 : 8, borderRadius: i % 3 ? 2 : 999 }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
            animate={{ x: [0, x, x * 1.1], y: [0, y, y + 220], opacity: [1, 1, 0], rotate: 360 + i * 20 }}
            transition={{ duration: 2.6, ease: "easeOut", times: [0, 0.35, 1] }}
          />
        );
      })}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={`h${i}`}
          className="absolute left-1/2 top-1/2 text-heart"
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
          animate={{ x: (i - 2) * 38, y: -120 - (i % 2) * 30, opacity: [0, 1, 0], scale: 1 }}
          transition={{ duration: 2, delay: 0.2 + i * 0.12, ease: "easeOut" }}
        >
          <Heart className="h-4 w-4 fill-current" />
        </motion.span>
      ))}
    </div>
  );
}
