import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Heart } from "lucide-react";
import { useRef } from "react";
import { weddingData } from "@/config/weddingData";
import { HeartDivider } from "./Ornaments";

/** Garden-and-fountain stage with the couple's names, revealed after the curtains. */
export function InvitationHero({ revealed }: { revealed: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const { couple } = weddingData;

  const item = (i: number) => ({
    initial: { opacity: 0, y: 24, filter: "blur(6px)" },
    animate: revealed ? { opacity: 1, y: 0, filter: "blur(0px)" } : {},
    transition: { duration: 1.1, delay: 0.2 + i * 0.22, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section
      id="invitation"
      ref={ref}
      className="relative isolate overflow-hidden bg-hero-cream"
      style={{ height: "clamp(860px, 100svh, 1000px)" }}
    >
      {/* Drapes and valance, anchored to the top */}
      <motion.img
        src={weddingData.images.garden}
        alt=""
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-auto w-full"
        style={{
          WebkitMaskImage: "linear-gradient(to bottom, black 36%, transparent 46%)",
          maskImage: "linear-gradient(to bottom, black 36%, transparent 46%)",
        }}
        initial={{ scale: 1.06 }}
        animate={revealed ? { scale: 1 } : {}}
        transition={{ duration: 3, ease: "easeOut" }}
        fetchPriority="high"
      />
      {/* Royal garden and fountain, anchored to the bottom */}
      <motion.img
        src={weddingData.images.garden}
        alt="Royal garden with a marble fountain, cypress trees and roses"
        className="absolute inset-x-0 bottom-0 -z-10 h-auto w-full"
        style={{
          y: bgY,
          WebkitMaskImage: "linear-gradient(to bottom, transparent 47%, black 55%)",
          maskImage: "linear-gradient(to bottom, transparent 47%, black 55%)",
        }}
        initial={{ scale: 1.08 }}
        animate={revealed ? { scale: 1 } : {}}
        transition={{ duration: 3, ease: "easeOut" }}
      />

      <motion.div style={{ y: textY }} className="relative px-8 pt-24 text-center min-[360px]:px-16">
        <motion.div {...item(0)} className="flex justify-center">
          <Heart className="h-5 w-5 fill-forest text-forest" />
        </motion.div>
        <motion.p {...item(1)} className="mt-3 font-serif text-[1.55rem] italic tracking-wide text-ink">
          {weddingData.heroTagline}
        </motion.p>
        <motion.div {...item(1.5)}>
          <HeartDivider className="mt-3" />
        </motion.div>

        <motion.h1 {...item(2)} className="mt-2 font-script text-[4.4rem] leading-none text-forest">
          {couple.groom}
        </motion.h1>
        <motion.div {...item(2.5)} className="mt-1 font-serif text-[0.92rem] italic leading-snug text-sage">
          {couple.groomParents.map((l) => (
            <p key={l}>{l}</p>
          ))}
        </motion.div>

        <motion.p {...item(3)} className="my-2 font-script text-4xl text-sage">
          &amp;
        </motion.p>

        <motion.h1 {...item(3.5)} className="font-script text-[4.4rem] leading-none text-forest">
          {couple.bride}
        </motion.h1>
        <motion.div {...item(4)} className="mt-1 font-serif text-[0.92rem] italic leading-snug text-sage">
          {couple.brideParents.map((l) => (
            <p key={l}>{l}</p>
          ))}
        </motion.div>
      </motion.div>

      <motion.a
        href="#message"
        className="absolute bottom-[7%] left-1/2 flex -translate-x-1/2 flex-col items-center text-ink"
        initial={{ opacity: 0 }}
        animate={revealed ? { opacity: 1 } : {}}
        transition={{ delay: 1.8, duration: 1 }}
      >
        <span className="font-caps text-xs text-ink/90 drop-shadow">Scroll</span>
        <ChevronDown className="mt-1 h-5 w-5 animate-bob" />
      </motion.a>
    </section>
  );
}
