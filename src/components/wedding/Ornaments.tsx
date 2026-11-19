import { motion, type HTMLMotionProps } from "framer-motion";
import { Heart } from "lucide-react";
import type { ReactNode } from "react";

/** Thin line – small heart – thin line, as used between headings and content. */
export function HeartDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-sage/60" />
      <Heart className="h-2.5 w-2.5 fill-sage text-sage" />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-sage/60" />
    </div>
  );
}

/** Faint hand-drawn wave that separates sections. */
export function WavyRule({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 12"
      preserveAspectRatio="none"
      className={`mx-auto h-3 w-full max-w-[300px] text-sage/35 ${className}`}
      aria-hidden="true"
    >
      <path
        d="M0 6 C25 1 50 11 75 6 S125 1 150 6 S200 11 225 6 S275 1 300 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

/** Fade-up reveal when an element scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  ...rest
}: { children: ReactNode; delay?: number; y?: number } & HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Icon + calligraphy title + heart divider. */
export function SectionHeading({ icon, title }: { icon?: ReactNode; title: string }) {
  return (
    <Reveal className="mb-8 text-center">
      {icon && <div className="mb-3 flex justify-center text-sage">{icon}</div>}
      <h2 className="font-script text-[2.6rem] leading-[1.1] text-sage sm:text-5xl">{title}</h2>
      <HeartDivider className="mt-4" />
    </Reveal>
  );
}

/** A parchment section with consistent spacing and a wave at the end. */
export function Section({
  id,
  children,
  className = "",
  wave = true,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  wave?: boolean;
}) {
  return (
    <section id={id} className={`relative px-14 py-14 sm:px-16 ${className}`}>
      {children}
      {wave && <WavyRule className="mt-14" />}
    </section>
  );
}
