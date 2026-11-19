import { motion } from "framer-motion";
import { weddingData } from "@/config/weddingData";
import { HeartDivider } from "./Ornaments";

export function ClosingMessage() {
  const { couple, closing, images } = weddingData;
  return (
    <section className="relative overflow-hidden px-14 pb-40 pt-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="font-script text-[2.7rem] leading-[1.3] text-sage">{closing}</p>
        <p className="mt-5 font-script text-3xl text-ink/80">
          {couple.groom} &amp; {couple.bride}
        </p>
        <HeartDivider className="mt-8" />
      </motion.div>

      {(["left", "right"] as const).map((side) => (
        <motion.img
          key={side}
          src={images.roseCorner}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className={`pointer-events-none absolute bottom-0 w-44 ${side === "left" ? "-left-6" : "-right-6 -scale-x-100"}`}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.3 }}
        />
      ))}
    </section>
  );
}

export function InvitationFooter() {
  const { couple } = weddingData;
  return (
    <footer className="relative z-10 bg-forest px-6 pb-24 pt-8 text-center">
      <p className="font-script text-3xl text-gold-light">
        {couple.groom} &amp; {couple.bride}
      </p>
      <p className="mt-1 font-caps text-[0.6rem] text-ivory/70">{weddingData.dateLabel}</p>
    </footer>
  );
}
