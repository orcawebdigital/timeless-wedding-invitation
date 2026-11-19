import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import {
  BedDouble,
  Bus,
  Clock,
  ExternalLink,
  Gift,
  Heart,
  MapPin,
  Navigation,
  PartyPopper,
  Phone,
  Shirt,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { weddingData } from "@/config/weddingData";
import { getTimeLeft } from "@/lib/calendar";
import { HeartDivider, Reveal, Section, SectionHeading } from "./Ornaments";

export function WeddingMessage() {
  const words = weddingData.message.split(" ");
  return (
    <Section id="message" className="pt-16 text-center">
      <HeartDivider className="mb-8" />
      <motion.p
        className="font-script text-[1.7rem] leading-[1.55] text-ink"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={{ show: { transition: { staggerChildren: 0.05 } } }}
      >
        {words.map((w, i) => (
          <motion.span
            key={i}
            className="inline-block"
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
          >
            {w}&nbsp;
          </motion.span>
        ))}
        <Heart className="inline h-5 w-5 fill-heart text-heart" />
      </motion.p>
      <HeartDivider className="mt-8" />
    </Section>
  );
}

export function CoupleGallery() {
  const photos = weddingData.photos;
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % photos.length), 4500);
    return () => clearInterval(t);
  }, [photos.length]);

  return (
    <Section id="gallery" className="text-center">
      <Reveal>
        <motion.div
          ref={ref}
          className="relative mx-auto aspect-[3/2] w-full overflow-hidden rounded-md bg-muted shadow-[var(--shadow-soft)]"
          initial={{ clipPath: "inset(12% 12% 12% 12% round 6px)" }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0% round 6px)" }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <AnimatePresence initial={false}>
            <motion.img
              key={index}
              src={photos[index]?.src}
              alt={photos[index]?.alt ?? ""}
              loading="lazy"
              className="absolute inset-0 h-[116%] w-full object-cover"
              style={{ y, top: "-8%" }}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
            />
          </AnimatePresence>
          <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {photos.map((p, i) => (
              <button
                key={p.src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show photo ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-ivory" : "w-1.5 bg-ivory/60"}`}
              />
            ))}
          </div>
        </motion.div>
      </Reveal>
    </Section>
  );
}

function FlipNumber({ value }: { value: number }) {
  const text = String(value).padStart(2, "0");
  return (
    <span className="relative inline-flex h-[1.3em] overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={text}
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="block"
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Countdown() {
  const target = new Date(weddingData.weddingDateISO).getTime();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const left = now === null ? null : getTimeLeft(target, now);
  const units = [
    { label: "Days", value: left?.days },
    { label: "Hours", value: left?.hours },
    { label: "Minutes", value: left?.minutes },
    { label: "Seconds", value: left?.seconds },
  ];

  return (
    <Section id="countdown" className="text-center">
      <SectionHeading title="Counting Down to Forever" />
      {left?.done ? (
        <Reveal>
          <p className="font-script text-4xl text-forest">Today is our wedding day!</p>
          <p className="mt-2 font-serif italic text-ink/80">Thank you for celebrating with us.</p>
        </Reveal>
      ) : (
        <Reveal className="flex justify-center gap-2">
          {units.map((u) => (
            <div key={u.label} className="flex flex-col items-center">
              <div className="flex h-14 w-[3.6rem] items-center justify-center rounded-[3px] border border-sage/25 bg-secondary/80 font-serif text-[1.65rem] font-semibold text-ink shadow-[var(--shadow-soft)]">
                {u.value === undefined ? "--" : <FlipNumber value={u.value} />}
              </div>
              <span className="mt-2 font-caps text-[0.52rem] text-ink/70">{u.label}</span>
            </div>
          ))}
        </Reveal>
      )}
    </Section>
  );
}

type TimelineGroup = { date: string; events: { time: string; title: string; description: string }[] };

function Timeline({ groups }: { groups: TimelineGroup[] }) {
  return (
    <div className="space-y-9">
      {groups.map((g) => (
        <Reveal key={g.date}>
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-sage/40" />
            <p className="font-caps text-[0.66rem] text-ink">{g.date}</p>
            <span className="h-px flex-1 bg-sage/40" />
          </div>
          <div className="space-y-5">
            {g.events.map((e, i) => (
              <motion.div
                key={e.title}
                className="grid grid-cols-[4.6rem_1fr] gap-3 text-left"
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.12 }}
              >
                <p className="pt-0.5 font-serif text-[0.95rem] font-semibold text-ink">{e.time}</p>
                <div className="border-l border-sage/40 pl-3">
                  <p className="font-serif text-lg font-semibold leading-tight text-ink">{e.title}</p>
                  <p className="mt-1 font-serif text-[0.95rem] leading-snug text-ink/75">{e.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function ProgramTimeline() {
  return (
    <Section id="program">
      <SectionHeading icon={<Clock className="h-7 w-7" strokeWidth={1.3} />} title="Program Timeline" />
      <Timeline groups={weddingData.program as unknown as TimelineGroup[]} />
    </Section>
  );
}

export function PreWeddingEvents() {
  const groups = weddingData.preWedding.map((e) => ({ date: e.date, events: [e] }));
  return (
    <Section id="pre-wedding">
      <SectionHeading icon={<PartyPopper className="h-7 w-7" strokeWidth={1.3} />} title="Pre-Wedding Events" />
      <Timeline groups={groups} />
    </Section>
  );
}

export function VenueSection() {
  const { venue } = weddingData;
  const q = encodeURIComponent(venue.mapQuery);
  return (
    <Section id="venue" className="text-center">
      <SectionHeading icon={<MapPin className="h-7 w-7" strokeWidth={1.3} />} title="Venue" />
      <Reveal>
        <p className="font-serif text-xl font-semibold text-ink">{venue.name}</p>
        <p className="mt-1 font-serif italic text-ink/75">{venue.address}</p>
      </Reveal>
      <Reveal delay={0.1} className="mt-6">
        <div className="relative aspect-square w-full overflow-hidden rounded-md border border-sage/25 bg-muted shadow-[var(--shadow-soft)]">
          <iframe
            title={`Map of ${venue.name}`}
            src={`https://www.google.com/maps?q=${q}&output=embed`}
            className="absolute inset-0 h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Reveal>
      <Reveal delay={0.15} className="mt-6 flex flex-wrap justify-center gap-3">
        <a href={`https://www.google.com/maps/search/?api=1&query=${q}`} target="_blank" rel="noreferrer" className="btn-sage">
          <ExternalLink className="h-4 w-4" /> Open in Maps
        </a>
        <a href={`https://www.google.com/maps/dir/?api=1&destination=${q}`} target="_blank" rel="noreferrer" className="btn-sage">
          <Navigation className="h-4 w-4" /> Directions
        </a>
      </Reveal>
    </Section>
  );
}

export function DressCode() {
  const { dressCode } = weddingData;
  return (
    <Section id="dress-code" className="text-center">
      <SectionHeading icon={<Shirt className="h-7 w-7" strokeWidth={1.3} />} title="Dress Code" />
      <div className="space-y-8">
        {[
          { label: "Women", text: dressCode.women },
          { label: "Men", text: dressCode.men },
        ].map((d, i) => (
          <Reveal key={d.label} delay={i * 0.1}>
            <p className="font-serif text-xl font-semibold text-ink">{d.label}</p>
            <p className="mx-auto mt-2 max-w-[18rem] font-serif text-base leading-relaxed text-ink/75">{d.text}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function Transportation() {
  const t = weddingData.transportation;
  return (
    <Section id="transportation" className="text-center">
      <SectionHeading icon={<Bus className="h-7 w-7" strokeWidth={1.3} />} title="Transportation" />
      <Reveal>
        <p className="font-serif text-[1.05rem] leading-relaxed text-ink/85">{t.text}</p>
        <p className="mt-3 font-serif text-[1.05rem] text-ink">
          Pickup point: <strong className="font-semibold">{t.pickup}</strong> at <strong className="font-semibold">{t.time}</strong>
        </p>
      </Reveal>
    </Section>
  );
}

export function Accommodation() {
  const a = weddingData.accommodation;
  return (
    <Section id="accommodation" className="text-center">
      <SectionHeading icon={<BedDouble className="h-7 w-7" strokeWidth={1.3} />} title="Accommodation" />
      <Reveal>
        <p className="font-serif text-[1.05rem] leading-relaxed text-ink/85">{a.text}</p>
        <p className="mt-2 font-serif italic text-ink/75">{a.details}</p>
        <a
          href={`tel:${a.phone.replace(/\s/g, "")}`}
          className="mt-4 inline-flex items-center gap-2 font-serif text-ink underline decoration-gold/60 underline-offset-4"
        >
          <Phone className="h-4 w-4" /> {a.phone}
        </a>
      </Reveal>
    </Section>
  );
}

export function GiftsSection() {
  return (
    <Section id="gifts" className="text-center">
      <SectionHeading icon={<Gift className="h-7 w-7" strokeWidth={1.3} />} title="Gifts" />
      <Reveal>
        <p className="font-serif text-[1.1rem] leading-relaxed text-ink/85">{weddingData.gifts}</p>
      </Reveal>
    </Section>
  );
}
